import assert from "node:assert/strict";
import test from "node:test";
import {
  adjustReviewAnchor,
  advanceRun,
  applyBoilerOutputChange,
  canPromote,
  createEditableClone,
  createInitialState,
  discardEditableClone,
  promoteImport,
  reviewAnchor,
  resetRun,
  resolveTightenItem,
  routeFor,
  selectReviewItem,
  selectedReviewItem,
  startRun
} from "../src/model.js";
import { spatialFixture } from "../src/data.js";

test("/main remains the Main entry route", () => {
  assert.equal(routeFor("#/main"), "/main");
  assert.equal(routeFor("/main"), "/main");
  assert.equal(routeFor("#/twin"), "/main");
  assert.equal(routeFor("#/clone"), "/clone");
  assert.equal(routeFor("#/what-if"), "/clone");
  assert.equal(routeFor(""), "/main");
});

test("editable clone creates a branch without mutating current reality", () => {
  const current = createInitialState();
  const proposed = createEditableClone(current);

  assert.equal(current.proposedTwin, null);
  assert.equal(proposed.proposedTwin.authority, "proposed");
  assert.notEqual(proposed.proposedTwin.id, proposed.authoritativeTwin.id);
  assert.equal(proposed.authoritativeTwin.nodes.boiler.outputKw, 24);
});

test("editing a graph item in a clone generates expected consequences", () => {
  const current = createInitialState();
  const changed = applyBoilerOutputChange(createEditableClone(current), 35);

  assert.equal(changed.authoritativeTwin.nodes.boiler.outputKw, 24);
  assert.equal(changed.proposedTwin.nodes.boiler.outputKw, 35);
  assert.deepEqual(changed.proposedChanges[0], {
    type: "graph-item-edit",
    editKind: "component-edit",
    nodeId: "boiler",
    from: "Existing gas boiler",
    to: "Edited boiler node",
    preservesPosition: true,
    position: {
      x: 3.4,
      y: 1.55,
      z: 0.12,
      unit: "m",
      reference: "room-1 wall-local"
    }
  });
  assert.equal(changed.proposedTwin.nodes.boiler.editedFrom, "Existing gas boiler");
  assert.equal(changed.proposedTwin.nodes.boiler.name, "Edited boiler node");
  assert.ok(changed.consequences.some((item) => item.id === "boiler-edit"));
  assert.ok(changed.consequences.some((item) => item.id === "primary-pipework-limit"));
  assert.ok(changed.consequences.some((item) => item.id === "controls-limit"));
});

test("spatial components and comments carry explicit xyz locations", () => {
  for (const component of spatialFixture.components) {
    assert.equal(component.position.unit, "m");
    assert.equal(typeof component.position.x, "number");
    assert.equal(typeof component.position.y, "number");
    assert.equal(typeof component.position.z, "number");
  }

  for (const comment of spatialFixture.comments) {
    assert.equal(comment.position.unit, "m");
    assert.ok(comment.targetId);
    assert.equal(typeof comment.x, "number");
    assert.equal(typeof comment.y, "number");
    assert.equal(typeof comment.position.x, "number");
    assert.equal(typeof comment.position.y, "number");
    assert.equal(typeof comment.position.z, "number");
  }
});

test("discarding an editable clone preserves the authoritative Twin", () => {
  const changed = applyBoilerOutputChange(createEditableClone(createInitialState()), 35);
  const discarded = discardEditableClone(changed);

  assert.equal(discarded.proposedTwin, null);
  assert.equal(discarded.authoritativeTwin.nodes.boiler.outputKw, 24);
  assert.deepEqual(discarded.proposedChanges, []);
});

test("operate playback advances and resets", () => {
  const state = createInitialState();
  const advanced = advanceRun(advanceRun(state));
  assert.equal(advanced.runStep, 2);

  const reset = resetRun(advanced);
  assert.equal(reset.runStep, 0);
  assert.equal(reset.runPlaying, false);
});

test("operate playback restarts from the first step when replayed from the end", () => {
  let state = createInitialState();
  for (let index = 0; index < 10; index += 1) {
    state = advanceRun(state);
  }

  const replaying = startRun(state);
  assert.equal(replaying.runStep, 0);
  assert.equal(replaying.runPlaying, true);
});

test("review cannot promote with unresolved blockers", () => {
  const state = createInitialState();

  assert.equal(canPromote(state), false);
  const result = promoteImport(state);
  assert.equal(result.promoted, false);
  assert.equal(result.state.authoritativeTwin.version, 1);
});

test("review can promote after blockers are resolved", () => {
  let state = createInitialState();
  for (const item of state.reviewItems) {
    state = resolveTightenItem(state, item.id);
  }

  assert.equal(canPromote(state), true);
  const result = promoteImport(state);
  assert.equal(result.promoted, true);
  assert.equal(result.state.authoritativeTwin.version, 2);
});

test("review records the chosen ambiguity resolution rather than only confirming", () => {
  const state = resolveTightenItem(createInitialState(), "unknown-occupancy", "mark-unknown");
  const item = state.reviewItems.find((candidate) => candidate.id === "unknown-occupancy");

  assert.equal(item.resolved, true);
  assert.equal(item.resolutionId, "mark-unknown");
  assert.match(item.action, /explicit unknown/);
});

test("review starts on a located unresolved ambiguity", () => {
  const state = createInitialState();
  const item = selectedReviewItem(state);
  const anchor = reviewAnchor(state, item.id);

  assert.equal(item.id, "candidate-cylinder");
  assert.equal(item.targetId, "boiler");
  assert.deepEqual(anchor, {
    x: 300,
    y: 170,
    z: 0,
    unit: "canvas",
    reference: "hot-water source graph node"
  });
});

test("review selection focuses a different graph ambiguity", () => {
  const state = selectReviewItem(createInitialState(), "network-no-ont");
  const item = selectedReviewItem(state);
  const anchor = reviewAnchor(state, item.id);

  assert.equal(item.id, "network-no-ont");
  assert.equal(item.targetId, "broadband-entry");
  assert.equal(anchor.x, 604);
  assert.equal(anchor.y, 142);
});

test("manual Tighten position edits are separate from captured review anchors", () => {
  const original = createInitialState();
  const edited = adjustReviewAnchor(original, "network-no-ont", { x: 12, y: -6, z: 0.25 });
  const originalAnchor = original.reviewItems.find((item) => item.id === "network-no-ont").anchor;
  const editedAnchor = reviewAnchor(edited, "network-no-ont");

  assert.deepEqual(originalAnchor, {
    x: 604,
    y: 142,
    z: 0,
    unit: "canvas",
    reference: "communications entry graph node"
  });
  assert.deepEqual(edited.reviewItems.find((item) => item.id === "network-no-ont").anchor, originalAnchor);
  assert.equal(edited.activeReviewId, "network-no-ont");
  assert.equal(editedAnchor.x, 616);
  assert.equal(editedAnchor.y, 136);
  assert.equal(editedAnchor.z, 0.25);
  assert.match(editedAnchor.reference, /manually adjusted in Tighten/);
});

test("review can preserve fibre ambiguity as a follow-up question", () => {
  const state = resolveTightenItem(createInitialState(), "network-no-ont", "ont-missing");
  const item = state.reviewItems.find((candidate) => candidate.id === "network-no-ont");

  assert.equal(item.resolved, true);
  assert.equal(item.resolutionId, "ont-missing");
  assert.match(item.action, /follow-up for ONT location/);
});

test("hot-water ambiguity captures the downstream follow-up", () => {
  const state = resolveTightenItem(createInitialState(), "candidate-cylinder", "combi-with-cylinder");
  const item = state.reviewItems.find((candidate) => candidate.id === "candidate-cylinder");

  assert.equal(item.resolved, true);
  assert.equal(item.resolutionId, "combi-with-cylinder");
  assert.match(item.followUp, /Which taps/);
});
