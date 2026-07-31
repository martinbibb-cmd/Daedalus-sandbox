import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceRun,
  applyManualTightenEdit,
  applyBoilerOutputChange,
  canPromote,
  createInitialState,
  createWhatIf,
  discardWhatIf,
  promoteImport,
  resetRun,
  resolveTightenItem,
  routeFor,
  startRun,
  updateTightenDraft
} from "../src/model.js";

test("/main remains the Main entry route", () => {
  assert.equal(routeFor("#/main"), "/main");
  assert.equal(routeFor("/main"), "/main");
  assert.equal(routeFor("#/twin"), "/main");
  assert.equal(routeFor(""), "/main");
});

test("Scenario Twin creates a proposed clone without mutating current reality", () => {
  const current = createInitialState();
  const proposed = createWhatIf(current);

  assert.equal(current.proposedTwin, null);
  assert.equal(proposed.proposedTwin.authority, "proposed");
  assert.notEqual(proposed.proposedTwin.id, proposed.authoritativeTwin.id);
  assert.equal(proposed.authoritativeTwin.nodes.boiler.outputKw, 24);
});

test("applying the boiler change generates expected consequences", () => {
  const current = createInitialState();
  const changed = applyBoilerOutputChange(createWhatIf(current), 35);

  assert.equal(changed.authoritativeTwin.nodes.boiler.outputKw, 24);
  assert.equal(changed.proposedTwin.nodes.boiler.outputKw, 35);
  assert.deepEqual(changed.proposedChanges[0], {
    nodeId: "boiler",
    field: "outputKw",
    from: 24,
    to: 35
  });
  assert.ok(changed.consequences.some((item) => item.id === "primary-pipework-limit"));
  assert.ok(changed.consequences.some((item) => item.id === "controls-limit"));
});

test("discarding a Scenario Twin preserves the authoritative Twin", () => {
  const changed = applyBoilerOutputChange(createWhatIf(createInitialState()), 35);
  const discarded = discardWhatIf(changed);

  assert.equal(discarded.proposedTwin, null);
  assert.equal(discarded.authoritativeTwin.nodes.boiler.outputKw, 24);
  assert.deepEqual(discarded.proposedChanges, []);
});

test("Run advances and resets", () => {
  const state = createInitialState();
  const advanced = advanceRun(advanceRun(state));
  assert.equal(advanced.runStep, 2);

  const reset = resetRun(advanced);
  assert.equal(reset.runStep, 0);
  assert.equal(reset.runPlaying, false);
});

test("Run restarts from the first step when replayed from the end", () => {
  let state = createInitialState();
  for (let index = 0; index < 10; index += 1) {
    state = advanceRun(state);
  }

  const replaying = startRun(state);
  assert.equal(replaying.runStep, 0);
  assert.equal(replaying.runPlaying, true);
});

test("Tighten cannot promote with unresolved blockers", () => {
  const state = createInitialState();

  assert.equal(canPromote(state), false);
  const result = promoteImport(state);
  assert.equal(result.promoted, false);
  assert.equal(result.state.authoritativeTwin.version, 1);
});

test("Tighten can promote after blockers are resolved", () => {
  let state = createInitialState();
  for (const item of state.reviewItems) {
    state = resolveTightenItem(state, item.id);
  }

  assert.equal(canPromote(state), true);
  const result = promoteImport(state);
  assert.equal(result.promoted, true);
  assert.equal(result.state.authoritativeTwin.version, 2);
});

test("Tighten records the chosen resolution rather than only confirming", () => {
  const state = resolveTightenItem(createInitialState(), "unknown-occupancy", "mark-unknown");
  const item = state.reviewItems.find((candidate) => candidate.id === "unknown-occupancy");

  assert.equal(item.resolved, true);
  assert.equal(item.resolutionId, "mark-unknown");
  assert.match(item.action, /explicit unknown/);
});

test("Tighten supports manual refinement when direct evidence is missing", () => {
  const drafted = updateTightenDraft(
    createInitialState(),
    "unknown-occupancy",
    "Customer states Bedroom 2 is used by children; keep as customer_statement."
  );
  const refined = applyManualTightenEdit(drafted, "unknown-occupancy");
  const item = refined.reviewItems.find((candidate) => candidate.id === "unknown-occupancy");

  assert.equal(item.resolved, true);
  assert.equal(item.resolutionId, "manual-edit");
  assert.match(item.manualValue, /customer_statement/);
  assert.match(item.action, /Manual refinement recorded/);
});

test("empty manual refinement does not silently resolve a Tighten item", () => {
  const refined = applyManualTightenEdit(createInitialState(), "unknown-occupancy");
  const item = refined.reviewItems.find((candidate) => candidate.id === "unknown-occupancy");

  assert.equal(item.resolved, false);
  assert.equal(item.manualValue, undefined);
});
