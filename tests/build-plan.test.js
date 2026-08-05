import assert from "node:assert/strict";
import test from "node:test";
import {
  publishedBuildPlanCommit,
  publishedBuildPlanProjection,
  renderBuildPlanMarkdown
} from "../src/build-plan.js";

test("published projection is pinned to the current Contracts authority", () => {
  assert.equal(publishedBuildPlanCommit, "4402050");
  assert.match(publishedBuildPlanProjection, /Authority: Daedalus-contracts/);
});

test("working system and Run contracts remain ahead of explanation", () => {
  const workingSystem = publishedBuildPlanProjection.indexOf("Completed gate: Working System and Run contract");
  const explanation = publishedBuildPlanProjection.indexOf("Current tranche: Grounded explanation and correction");

  assert.ok(workingSystem >= 0);
  assert.ok(explanation > workingSystem);
  assert.match(publishedBuildPlanProjection, /scientifically modelled/);
});

test("build plan markdown renders headings, lists, and code safely", () => {
  const html = renderBuildPlanMarkdown(`# Plan\n\n- First\n- Second\n\n\`truth\` <script>`);

  assert.match(html, /<h1>Plan<\/h1>/);
  assert.match(html, /<ul>\s*<li>First<\/li>\s*<li>Second<\/li>\s*<\/ul>/);
  assert.match(html, /<code>truth<\/code>/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});
