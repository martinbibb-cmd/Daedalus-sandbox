import {
  authoritativeTwin,
  importReviewItems,
  proposedBoilerConsequences,
  editedBoiler,
  runTimeline
} from "./data.js";

const MAIN_ROUTES = new Set(["", "/home", "/main", "/twin", "/command", "/reasoning", "/scenarios"]);
const CLONE_ROUTES = new Set(["/clone", "/what-if"]);

export function routeFor(hashRoute) {
  const route = hashRoute.replace(/^#/, "");
  if (MAIN_ROUTES.has(route)) return "/main";
  if (CLONE_ROUTES.has(route)) return "/clone";
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
    activeReviewId: importReviewItems.find((item) => !item.resolved)?.id || importReviewItems[0]?.id || null,
    reviewSpatialEdits: {},
    explanationOpen: false,
    explanationMode: "plain",
    proposedTwin: null,
    proposedChanges: [],
    consequences: [],
    comparisonOpen: false,
    runTarget: "current",
    runStep: 0,
    runPlaying: false,
    tagPath: []
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

export function selectedReviewItem(state) {
  return state.reviewItems.find((item) => item.id === state.activeReviewId)
    || state.reviewItems.find((item) => !item.resolved)
    || state.reviewItems[0]
    || null;
}

export function reviewAnchor(state, itemId) {
  const item = state.reviewItems.find((candidate) => candidate.id === itemId);
  const edit = state.reviewSpatialEdits[itemId];
  return edit || clone(item?.anchor || { x: 0, y: 0, z: 0, unit: "canvas", reference: "unlocated review item" });
}

export function selectReviewItem(state, itemId) {
  const next = clone(state);
  if (next.reviewItems.some((item) => item.id === itemId)) {
    next.activeReviewId = itemId;
  }
  return next;
}

export function adjustReviewAnchor(state, itemId, delta = {}) {
  const next = selectReviewItem(state, itemId);
  const current = reviewAnchor(next, itemId);
  next.reviewSpatialEdits[itemId] = {
    ...current,
    x: roundCoordinate(current.x + Number(delta.x || 0)),
    y: roundCoordinate(current.y + Number(delta.y || 0)),
    z: roundCoordinate(current.z + Number(delta.z || 0)),
    reference: `${current.reference} · manually adjusted in Tighten`
  };
  return next;
}

export function resolveTightenItem(state, itemId, resolutionId = "resolve") {
  const next = clone(state);
  next.activeReviewId = itemId;
  next.reviewItems = next.reviewItems.map((item) => {
    if (item.id !== itemId) return item;
    const resolution = item.resolutions?.find((option) => option.id === resolutionId);
    return {
      ...item,
      resolved: true,
      resolutionId,
      resolutionLabel: resolution?.label || "Resolved",
      action: resolution?.result || "resolved in sandbox review",
      followUp: resolution?.followUp
    };
  });
  return next;
}

function roundCoordinate(value) {
  return Math.round(value * 1000) / 1000;
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

export function createEditableClone(state) {
  const next = clone(state);
  next.proposedTwin = clone(next.authoritativeTwin);
  next.proposedTwin.id = `${next.authoritativeTwin.id}-clone`;
  next.proposedTwin.label = "Editable Twin clone";
  next.proposedTwin.authority = "proposed";
  next.proposedChanges = [];
  next.consequences = [];
  next.comparisonOpen = true;
  next.runTarget = "proposed";
  return next;
}

export function editGraphItem(state, nodeId = "boiler", edit = editedBoiler) {
  const next = state.proposedTwin ? clone(state) : createEditableClone(state);
  const currentNode = state.authoritativeTwin.nodes[nodeId];
  if (!currentNode) return next;
  const editedNode = {
    ...clone(currentNode),
    ...clone(edit),
    id: nodeId,
    editedFrom: currentNode.name,
    preservedPosition: edit.position || currentNode.position
  };
  next.proposedTwin.nodes[nodeId] = editedNode;
  next.proposedChanges = [{
    type: "graph-item-edit",
    editKind: "component-edit",
    nodeId,
    from: currentNode.name,
    to: editedNode.name,
    preservesPosition: true,
    position: editedNode.preservedPosition || editedNode.position
  }];
  next.consequences = clone(proposedBoilerConsequences);
  next.comparisonOpen = true;
  return next;
}

export function applyBoilerOutputChange(state) {
  return editGraphItem(state, "boiler", editedBoiler);
}

export function discardEditableClone(state) {
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
