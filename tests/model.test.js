import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceRun,
  applyBoilerOutputChange,
  canPromote,
  createInitialState,
  createWhatIf,
  discardWhatIf,
  promoteImport,
  resetRun,
  resolveTightenItem,
  routeFor
} from "../src/model.js";

test("/main remains the Main entry route", () => {
  assert.equal(routeFor("#/main"), "/main");
  assert.equal(routeFor("/main"), "/main");
  assert.equal(routeFor("#/twin"), "/main");
  assert.equal(routeFor(""), "/main");
});

test("What If creates a proposed clone without mutating current reality", () => {
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

test("discarding What If preserves the authoritative Twin", () => {
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
