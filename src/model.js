import {
  authoritativeTwin,
  importReviewItems,
  proposedBoilerConsequences,
  runTimeline
} from "./data.js";

const MAIN_ROUTES = new Set(["", "/home", "/main", "/twin", "/command", "/reasoning", "/scenarios"]);

export function routeFor(hashRoute) {
  const route = hashRoute.replace(/^#/, "");
  if (MAIN_ROUTES.has(route)) return "/main";
  return route.startsWith("/") ? route : "/main";
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createInitialState() {
  return {
    reviewItems: clone(importReviewItems),
    authoritativeTwin: clone(authoritativeTwin),
    selectedPath: ["property"],
    explanationOpen: false,
    explanationMode: "plain",
    proposedTwin: null,
    proposedChanges: [],
    consequences: [],
    comparisonOpen: false,
    runTarget: "current",
    runStep: 0,
    runPlaying: false,
    tagPath: [],
    tightenDrafts: {}
  };
}

export function selectedId(state) {
  return state.selectedPath[state.selectedPath.length - 1];
}

export function selectedNode(state) {
  return state.authoritativeTwin.nodes[selectedId(state)] || state.authoritativeTwin.nodes.property;
}

export function selectNode(state, nodeId) {
  const next = clone(state);
  if (!next.authoritativeTwin.nodes[nodeId]) return next;
  const currentIndex = next.selectedPath.indexOf(nodeId);
  next.selectedPath = currentIndex >= 0
    ? next.selectedPath.slice(0, currentIndex + 1)
    : [...next.selectedPath, nodeId];
  next.explanationOpen = false;
  return next;
}

export function backOneLevel(state) {
  const next = clone(state);
  next.selectedPath = next.selectedPath.length > 1 ? next.selectedPath.slice(0, -1) : ["property"];
  next.explanationOpen = false;
  return next;
}

export function openEvidence(state) {
  return selectNode(state, "boiler-evidence");
}

export function openExplanation(state, mode = state.explanationMode || "plain") {
  const next = clone(state);
  next.explanationOpen = true;
  next.explanationMode = mode;
  return next;
}

export function canPromote(state) {
  return state.reviewItems.every((item) => item.resolved);
}

export function resolveTightenItem(state, itemId, resolutionId = "resolve") {
  const next = clone(state);
  next.reviewItems = next.reviewItems.map((item) => {
    if (item.id !== itemId) return item;
    const resolution = item.resolutions?.find((option) => option.id === resolutionId);
    return {
      ...item,
      resolved: true,
      resolutionId,
      resolutionLabel: resolution?.label || "Resolved",
      action: resolution?.result || "resolved in sandbox review"
    };
  });
  return next;
}

export function updateTightenDraft(state, itemId, value) {
  const next = clone(state);
  next.tightenDrafts[itemId] = value;
  return next;
}

export function applyManualTightenEdit(state, itemId) {
  const next = clone(state);
  const manualValue = (next.tightenDrafts[itemId] || "").trim();
  if (!manualValue) return next;

  next.reviewItems = next.reviewItems.map((item) => {
    if (item.id !== itemId) return item;
    return {
      ...item,
      resolved: true,
      resolutionId: "manual-edit",
      resolutionLabel: "Manual refinement",
      manualValue,
      action: `Manual refinement recorded: ${manualValue}`
    };
  });
  return next;
}

export function promoteImport(state) {
  const next = clone(state);
  if (!canPromote(next)) return { state: next, promoted: false };
  next.authoritativeTwin = {
    ...next.authoritativeTwin,
    version: next.authoritativeTwin.version + 1,
    label: "Authoritative Twin",
    importPromoted: true
  };
  return { state: next, promoted: true };
}

export function createWhatIf(state) {
  const next = clone(state);
  next.proposedTwin = clone(next.authoritativeTwin);
  next.proposedTwin.id = `${next.authoritativeTwin.id}-scenario`;
  next.proposedTwin.label = "Scenario Twin";
  next.proposedTwin.authority = "proposed";
  next.proposedChanges = [];
  next.consequences = [];
  next.comparisonOpen = true;
  next.runTarget = "proposed";
  return next;
}

export function applyBoilerOutputChange(state, outputKw = 35) {
  const next = state.proposedTwin ? clone(state) : createWhatIf(state);
  next.proposedTwin.nodes.boiler.outputKw = outputKw;
  next.proposedTwin.nodes.boiler.summary = `Scenario Twin boiler output changed to ${outputKw} kW.`;
  next.proposedChanges = [{
    nodeId: "boiler",
    field: "outputKw",
    from: state.authoritativeTwin.nodes.boiler.outputKw,
    to: outputKw
  }];
  next.consequences = clone(proposedBoilerConsequences);
  next.comparisonOpen = true;
  return next;
}

export function discardWhatIf(state) {
  const next = clone(state);
  next.proposedTwin = null;
  next.proposedChanges = [];
  next.consequences = [];
  next.comparisonOpen = false;
  next.runTarget = "current";
  next.runStep = 0;
  next.runPlaying = false;
  return next;
}

export function startRun(state, target = state.proposedTwin ? "proposed" : "current") {
  const next = clone(state);
  next.runTarget = target;
  if (next.runStep >= runTimeline.length - 1) next.runStep = 0;
  next.runPlaying = true;
  return next;
}

export function pauseRun(state) {
  const next = clone(state);
  next.runPlaying = false;
  return next;
}

export function advanceRun(state) {
  const next = clone(state);
  next.runStep = Math.min(next.runStep + 1, runTimeline.length - 1);
  if (next.runStep === runTimeline.length - 1) next.runPlaying = false;
  return next;
}

export function resetRun(state) {
  const next = clone(state);
  next.runStep = 0;
  next.runPlaying = false;
  return next;
}
