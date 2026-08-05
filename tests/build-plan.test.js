import assert from "node:assert/strict";
import test from "node:test";
import {
  publishedBuildPlanCommit,
  publishedBuildPlanProjection,
  renderBuildPlanMarkdown
} from "../src/build-plan.js";

test("published projection is pinned to the current Contracts authority", () => {
  assert.equal(publishedBuildPlanCommit, "b906afa");
  assert.match(publishedBuildPlanProjection, /Authority: Daedalus-contracts/);
});

test("working system remains ahead of contracts and explanation", () => {
  const workingSystem = publishedBuildPlanProjection.indexOf("Current tranche: Working System demonstration");
  const runContracts = publishedBuildPlanProjection.indexOf("Following tranche: Behaviour and Run contract extraction");
  const explanation = publishedBuildPlanProjection.indexOf("Later tranche: Grounded explanation and correction");

  assert.ok(workingSystem >= 0);
  assert.ok(runContracts > workingSystem);
  assert.ok(explanation > runContracts);
});

test("build plan markdown renders headings, lists, and code safely", () => {
  const html = renderBuildPlanMarkdown(`# Plan\n\n- First\n- Second\n\n\`truth\` <script>`);

  assert.match(html, /<h1>Plan<\/h1>/);
  assert.match(html, /<ul>\s*<li>First<\/li>\s*<li>Second<\/li>\s*<\/ul>/);
  assert.match(html, /<code>truth<\/code>/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});
