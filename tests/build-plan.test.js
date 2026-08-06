import assert from "node:assert/strict";
import test from "node:test";
import {
  publishedBuildPlanCommit,
  publishedBuildPlanProjection,
  renderBuildPlanMarkdown
} from "../src/build-plan.js";

test("published projection is pinned to the current Contracts authority", () => {
  assert.equal(publishedBuildPlanCommit, "27adae9");
  assert.match(publishedBuildPlanProjection, /Authority: Daedalus-contracts/);
});

test("established scientific models remain ahead of explanation", () => {
  const workingSystem = publishedBuildPlanProjection.indexOf("Current tranche: Existing scientific model integration");
  const explanation = publishedBuildPlanProjection.indexOf("Expand grounded explanation only after");

  assert.ok(workingSystem >= 0);
  assert.ok(explanation > workingSystem);
  assert.match(publishedBuildPlanProjection, /scientifically modelled/);
  assert.match(publishedBuildPlanProjection, /pre-existing scientific model estate/);
  assert.match(publishedBuildPlanProjection, /Wi-Fi signal and bandwidth/);
  assert.match(publishedBuildPlanProjection, /captured 3D frame/);
});

test("build plan markdown renders headings, lists, and code safely", () => {
  const html = renderBuildPlanMarkdown(`# Plan\n\n- First\n- Second\n\n\`truth\` <script>`);

  assert.match(html, /<h1>Plan<\/h1>/);
  assert.match(html, /<ul>\s*<li>First<\/li>\s*<li>Second<\/li>\s*<\/ul>/);
  assert.match(html, /<code>truth<\/code>/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});
