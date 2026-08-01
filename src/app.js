import {
  captureDemo,
  explanationText,
  property,
  runTimeline,
  spatialFixture
} from "./data.js";
import {
  advanceRun,
  applyBoilerOutputChange,
  backOneLevel,
  canPromote,
  createInitialState,
  createWhatIf,
  discardWhatIf,
  openEvidence,
  openExplanation,
  pauseRun,
  promoteImport,
  resetRun,
  resolveTightenItem,
  routeFor,
  selectNode,
  selectedId,
  selectedNode,
  startRun
} from "./model.js";

const app = document.querySelector("#app");
let state = createInitialState();
let activeLayer = "all";
let activeComponentId = "boiler";
let runTimer = null;

const routes = [
  ["Living Twin", "/main"],
  ["Review", "/tighten"],
  ["Change", "/what-if"],
  ["Playback", "/run"],
  ["Capture Demo", "/capture-demo"]
];

function currentRoute() {
  return routeFor(window.location.hash.replace(/^#/, ""));
}

function link(route) {
  return `href="#${route}" data-route="${route}"`;
}

function icon(name) {
  const paths = {
    tighten: "M12 3v18M5 8h14M7 16h10",
    home: "M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3v-9.5Z",
    run: "M5 4v16l14-8L5 4Z",
    branch: "M6 4v6a4 4 0 0 0 4 4h8M6 10h8a4 4 0 0 1 4 4v6",
    camera: "M4 7h4l1.4-2h5.2L16 7h4v12H4V7Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
    heat: "M13 3s2 2.2 0 5.4c-1.2 3 2.8 3.6 2.8 7A4.8 4.8 0 0 1 6.2 15c0-2.4 1.5-4 3.2-5.8C11 7.5 12 5.8 13 3Z",
    drop: "M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z",
    bolt: "m13 2-8 12h6l-1 8 8-12h-6l1-8Z",
    meter: "M4 14a8 8 0 1 1 16 0v6H4v-6Zm8-5v5l3-3",
    thermometer: "M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z",
    note: "M5 4h11l3 3v13H5V4Zm10 0v4h4",
    evidence: "M5 5h14v14H5V5Zm3 4h8M8 13h8M8 17h5",
    explain: "M12 17h.01M9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.5.2-.7.6-.7 1.1v.5"
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.home}"/></svg>`;
}

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) return;

  const action = event.target.closest("[data-action]");
  if (action) {
    handleAction(action.dataset.action, action.dataset.value, action.dataset.resolution);
    return;
  }

  const tag = event.target.closest("[data-tag]");
  if (tag) {
    state = { ...state, tagPath: [tag.dataset.group, tag.dataset.tag] };
    render();
  }

  const layer = event.target.closest("[data-layer]");
  if (layer) {
    activeLayer = layer.dataset.layer;
    render();
    return;
  }

  const component = event.target.closest("[data-component]");
  if (component) {
    activeComponentId = component.dataset.component;
    if (activeComponentId === "boiler") state = selectNode(state, "boiler");
    render();
  }
});

window.addEventListener("hashchange", () => {
  render();
  syncRunTimer();
});

window.addEventListener("beforeunload", () => {
  if (runTimer) clearInterval(runTimer);
});

function handleAction(action, value, resolution) {
  if (action === "select") state = selectNode(state, value);
  if (action === "back") state = backOneLevel(state);
  if (action === "evidence") state = openEvidence(state);
  if (action === "explain") state = openExplanation(state, value || "plain");
  if (action === "close-explain") state = { ...state, explanationOpen: false };
  if (action === "resolve") state = resolveTightenItem(state, value, resolution);
  if (action === "promote") {
    const result = promoteImport(state);
    state = result.state;
    if (result.promoted) window.location.hash = "#/main";
  }
  if (action === "create-what-if") {
    state = createWhatIf(state);
    window.location.hash = "#/what-if";
  }
  if (action === "apply-output") state = applyBoilerOutputChange(state, Number(value));
  if (action === "discard-what-if") state = discardWhatIf(state);
  if (action === "start-run") {
    state = startRun(state, value || undefined);
    if (currentRoute() !== "/run") window.location.hash = "#/run";
  }
  if (action === "pause-run") state = pauseRun(state);
  if (action === "advance-run") state = advanceRun(state);
  if (action === "reset-run") state = resetRun(state);
  render();
  syncRunTimer();
}

function syncRunTimer() {
  if (runTimer) {
    clearInterval(runTimer);
    runTimer = null;
  }
  if (!state.runPlaying) return;

  runTimer = window.setInterval(() => {
    state = advanceRun(state);
    render();
    if (!state.runPlaying) syncRunTimer();
  }, 1200);
}

function shell(content) {
  const active = currentRoute();
  return `
    <main class="app">
      <header class="topbar">
        <div>
          <p class="eyebrow">${active === "/capture-demo" ? "Disposable Capture demo" : "Daedalus Main sandbox"}</p>
          <h1>${titleFor(active)}</h1>
        </div>
        <a class="pill" ${link("/capture-demo")}>Capture demo</a>
      </header>
      ${content}
      <nav class="tabbar">
        ${routes.map(([label, route]) => `
          <a ${link(route)} class="${active === route ? "active" : ""}">
            ${icon(route === "/tighten" ? "tighten" : route === "/what-if" ? "branch" : route === "/run" ? "run" : route === "/capture-demo" ? "camera" : "home")}
            <span>${label}</span>
          </a>
        `).join("")}
      </nav>
    </main>
  `;
}

function titleFor(route) {
  return {
    "/main": "Living Twin",
    "/tighten": "Review & Complete",
    "/what-if": "Change & Compare",
    "/run": "Operate Playback",
    "/capture-demo": "Capture Demo"
  }[route] || "Main";
}

function mainView() {
  const node = selectedNode(state);
  const path = state.selectedPath;
  const isEvidence = selectedId(state) === "boiler-evidence";
  const activeComponent = selectedSpatialComponent();
  return shell(`
    <section class="mission-strip">
      <div>
        <p class="eyebrow">Current Reality · Authoritative</p>
        <h2>${property.name}</h2>
        <p>${property.address} · ${spatialFixture.rooms.length} captured spaces · ${spatialFixture.components.length} specialist records</p>
      </div>
      <div class="mission-metrics">
        <span><b>Capture</b> v2 fixture</span>
        <span><b>Authority</b> Current Twin v${state.authoritativeTwin.version}</span>
        <span><b>Layer</b> ${labelForLayer(activeLayer)}</span>
      </div>
    </section>

    <section class="living-workspace">
      <article class="dollhouse-stage">
        <div class="workspace-head">
          <div>
            <p class="eyebrow">Living Dollhouse Workspace</p>
            <h2>Property as the interface</h2>
          </div>
          ${path.length > 1 ? `<button class="secondary small" data-action="back">Back</button>` : ""}
        </div>
        ${layerBar()}
        ${breadcrumb(path)}
        ${graphicTwin("current")}
      </article>

      <aside class="twin-inspector">
        <p class="eyebrow">${activeComponent.domain} · ${activeComponent.state}</p>
        <h2>${activeComponent.label}</h2>
        <p>${activeComponent.summary}</p>
        <div class="component-meta">
          <span><b>Room</b>${roomFor(activeComponent.roomId).label}</span>
          <span><b>Confidence</b>${activeComponent.confidence}</span>
          <span><b>Evidence</b>${activeComponent.evidence.length} refs</span>
          <span><b>XYZ</b>${formatPosition(activeComponent.position)}</span>
        </div>
        <div class="evidence-chips">
          ${activeComponent.evidence.map((item) => `<span>${item}</span>`).join("")}
        </div>
        ${relationshipPanel(activeComponent)}
        <div class="inspector-actions">
          ${activeComponent.id === "boiler" ? `
            <button class="secondary" data-action="evidence">${icon("evidence")} Boiler evidence</button>
            <button class="secondary" data-action="explain" data-value="plain">${icon("explain")} Explain boiler</button>
            <button class="primary" data-action="create-what-if">${icon("branch")} Change & Compare</button>
          ` : `
            <button class="secondary" data-action="explain" data-value="plain">${icon("explain")} Explain selected layer</button>
          `}
        </div>
      </aside>
    </section>

    <section class="twin-lenses">
      ${dimensionCard("House", state.authoritativeTwin.dimensions.house)}
      ${dimensionCard("System", state.authoritativeTwin.dimensions.system)}
      ${dimensionCard("Home", state.authoritativeTwin.dimensions.home)}
      <article class="lens-card unresolved-lens">
        <p class="eyebrow">Unresolved</p>
        <h3>${state.reviewItems.filter((item) => !item.resolved).length} ambiguities need review</h3>
        <a class="secondary" ${link("/tighten")}>Review & complete</a>
      </article>
    </section>

    ${state.explanationOpen ? explanationPanel() : ""}
  `);
}

function selectedSpatialComponent() {
  return spatialFixture.components.find((item) => item.id === activeComponentId) || spatialFixture.components[0];
}

function roomFor(roomId) {
  return spatialFixture.rooms.find((room) => room.id === roomId) || spatialFixture.rooms[0];
}

function labelForLayer(layerId) {
  return spatialFixture.layers.find((layer) => layer.id === layerId)?.label || "All";
}

function layerBar() {
  return `
    <div class="layer-bar" aria-label="Twin layer filters">
      ${spatialFixture.layers.map((layer) => `
        <button class="${activeLayer === layer.id ? "active" : ""}" data-layer="${layer.id}">${layer.label}</button>
      `).join("")}
    </div>
  `;
}

function breadcrumb(path) {
  return `
    <div class="breadcrumb">
      ${path.map((id, index) => {
        const node = state.authoritativeTwin.nodes[id];
        return `<button data-action="select" data-value="${id}" ${index === path.length - 1 ? "class=\"active\"" : ""}>${node.name}</button>`;
      }).join("<span>/</span>")}
    </div>
  `;
}

function graphicTwin(mode = "current") {
  const path = state.selectedPath;
  const isBoilerFocus = path.includes("boiler") || selectedId(state) === "boiler-evidence";
  const isProposed = mode === "proposed" && state.proposedTwin;
  const hasConsequences = Boolean(state.consequences.length);
  const runStep = mode === "run" ? runTimeline[state.runStep] : null;
  const bottleneck = runStep?.bottleneck;
  const boilerOutput = isProposed ? state.proposedTwin.nodes.boiler.outputKw : state.authoritativeTwin.nodes.boiler.outputKw;
  const visible = (domain) => activeLayer === "all" || activeLayer === domain || (activeLayer === "evidence" && domain === "evidence");
  return `
    <div class="graphic-twin spatial ${mode} ${isBoilerFocus ? "focus-boiler" : ""} ${hasConsequences ? "has-consequences" : ""} ${bottleneck ? "has-bottleneck" : ""}">
      <svg class="spatial-map" viewBox="0 0 740 620" role="img" aria-label="Spatial Living Dollhouse projection">
        <defs>
          <filter id="softGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect class="map-backdrop" x="0" y="0" width="740" height="620" rx="28"/>
        <g class="room-layer">
          ${spatialFixture.rooms.map((room) => `
            <path class="captured-room ${room.confidence}" d="${room.path}" tabindex="0"/>
            <text class="room-label" x="${roomCenter(room.path).x}" y="${roomCenter(room.path).y - 6}">${room.label}</text>
            <text class="room-role" x="${roomCenter(room.path).x}" y="${roomCenter(room.path).y + 18}">${room.role}</text>
          `).join("")}
        </g>
        <g class="route-layer">
          ${spatialFixture.routes.filter((route) => visible(route.domain)).map((route) => `
            <path class="system-route ${route.domain} ${isRouteSelected(route) ? "selected" : ""} ${routeRunClass(route, runStep)} ${hasConsequences && route.id === "primary" ? "constraint" : ""}" d="${routePath(route)}"/>
            ${isRouteSelected(route) ? `<text class="route-label" x="${routeLabelPosition(route).x}" y="${routeLabelPosition(route).y}">${route.label}</text>` : ""}
          `).join("")}
        </g>
        <g class="component-layer">
          ${spatialFixture.components.filter((component) => visible(component.domain)).map((component) => `
            <g class="component-node ${component.domain} ${component.state} ${activeComponentId === component.id ? "selected" : ""} ${componentRunClass(component, runStep)} ${isSubstituted(component) ? "substituted" : ""}" data-component="${component.id}" tabindex="0" transform="translate(${component.x} ${component.y})">
              ${componentShape(component)}
              <text class="component-label" x="0" y="-22">${componentDisplayLabel(component, isProposed, boilerOutput)}</text>
            </g>
          `).join("")}
        </g>
        <g class="comment-layer">
          ${spatialFixture.comments.filter(commentVisible).map(renderComment).join("")}
        </g>
        ${hasConsequences ? `
          <g class="consequence-layer">
            <path class="constraint-zone" d="M280 210 L428 282 L240 432"/>
            <text class="warning-label" x="425" y="260">Primary constraint</text>
            <text class="warning-label small" x="500" y="220">controls evidence incomplete</text>
          </g>
        ` : ""}
        ${runStep ? `
          <g class="run-overlay">
            <rect x="78" y="546" width="584" height="46" rx="12"/>
            <text x="102" y="575">${runStep.time} · ${runStep.title}: ${runStep.state}</text>
          </g>
        ` : ""}
      </svg>
      <div class="map-caption">
        <strong>${spatialFixture.captureId}</strong>
        <span>${spatialFixture.note}</span>
      </div>
    </div>
  `;
}

function routeRunClass(route, runStep) {
  if (!runStep) return "";
  const activeRoutes = {
    "heating-demand": ["primary"],
    boiler: ["primary"],
    "primary-pipework": ["primary"],
    "emitter-response": ["primary"]
  }[runStep.active] || [];
  return activeRoutes.includes(route.id) ? "active" : "";
}

function formatPosition(position) {
  if (!position) return "not located";
  return `${position.x}, ${position.y}, ${position.z} ${position.unit}`;
}

function componentDisplayLabel(component, isProposed, boilerOutput) {
  if (component.id === "boiler" && isProposed && state.proposedTwin) {
    return `${state.proposedTwin.nodes.boiler.name} ${boilerOutput} kW`;
  }
  return component.label;
}

function isSubstituted(component) {
  return state.proposedChanges.some((change) => (
    change.type === "graph-item-substitution" && change.nodeId === component.id
  ));
}

function commentVisible(comment) {
  if (activeLayer === "all" || activeLayer === "evidence") return true;
  if (comment.targetId === activeComponentId) return true;
  const route = spatialFixture.routes.find((candidate) => candidate.id === comment.targetId);
  return Boolean(route && route.componentIds?.includes(activeComponentId));
}

function renderComment(comment) {
  const target = targetPointForComment(comment);
  return `
    <g class="comment-pin ${comment.targetId === activeComponentId ? "selected" : ""}">
      <title>${comment.text} XYZ ${formatPosition(comment.position)}</title>
      <path class="comment-leader" d="M${comment.x} ${comment.y} L${target.x} ${target.y}"/>
      <rect class="comment-card" x="${comment.x - 48}" y="${comment.y - 24}" width="96" height="36" rx="10"/>
      <text class="comment-label" x="${comment.x}" y="${comment.y - 4}">${comment.label}</text>
      <text class="comment-xyz" x="${comment.x}" y="${comment.y + 10}">${comment.position.x},${comment.position.y},${comment.position.z}m</text>
    </g>
  `;
}

function targetPointForComment(comment) {
  const component = spatialFixture.components.find((candidate) => candidate.id === comment.targetId);
  if (component) return { x: component.x, y: component.y };
  const route = spatialFixture.routes.find((candidate) => candidate.id === comment.targetId);
  if (route) return routeLabelPosition(route);
  return { x: comment.x, y: comment.y };
}

function componentRunClass(component, runStep) {
  if (!runStep) return "";
  const activeComponents = {
    "heating-demand": ["boiler", "emitter"],
    boiler: ["boiler"],
    "primary-pipework": ["boiler", "emitter"],
    "emitter-response": ["emitter"]
  }[runStep.active] || [];
  return activeComponents.includes(component.id) ? "active" : "";
}

function relationshipPanel(component) {
  const routes = spatialFixture.routes.filter((route) => route.componentIds?.includes(component.id));
  if (!routes.length) {
    return `
      <div class="relationship-panel empty">
        <strong>No route relationship yet</strong>
        <p>This item is spatially located but no route or connection has been evidenced in the Sandbox fixture.</p>
      </div>
    `;
  }
  return `
    <div class="relationship-panel">
      <strong>Connected relationships</strong>
      ${routes.map((route) => `
        <article class="${route.domain}">
          <span>${route.domain}</span>
          <b>${route.label}</b>
          <p>${route.evidenceState}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function isRouteSelected(route) {
  return route.componentIds?.includes(activeComponentId);
}

function routePath(route) {
  if (route.d) return route.d;
  const points = route.points?.trim().split(/\s+/) || [];
  return points.map((point, index) => {
    const [x, y] = point.split(",");
    return `${index === 0 ? "M" : "L"}${x} ${y}`;
  }).join(" ");
}

function routeLabelPosition(route) {
  const numbers = routePath(route).match(/-?\d+/g)?.map(Number) || [360, 310];
  const xs = numbers.filter((_, index) => index % 2 === 0);
  const ys = numbers.filter((_, index) => index % 2 === 1);
  return {
    x: xs[Math.floor(xs.length / 2)] || 360,
    y: (ys[Math.floor(ys.length / 2)] || 310) - 14
  };
}

function roomCenter(path) {
  const numbers = path.match(/-?\d+/g)?.map(Number) || [0, 0];
  const xs = numbers.filter((_, index) => index % 2 === 0);
  const ys = numbers.filter((_, index) => index % 2 === 1);
  return {
    x: xs.reduce((sum, value) => sum + value, 0) / xs.length,
    y: ys.reduce((sum, value) => sum + value, 0) / ys.length
  };
}

function componentShape(component) {
  if (component.id === "boiler") {
    return `<rect class="component-body boiler-body" x="-18" y="-26" width="36" height="52" rx="5"/><circle class="component-core" r="5"/>`;
  }
  if (component.domain === "electrical") {
    return `<rect class="component-body" x="-14" y="-14" width="28" height="28" rx="4"/><path d="M-5 0h10M0-5v10"/>`;
  }
  if (component.domain === "water") {
    return `<path class="component-body" d="M0-16 C14 0 12 16 0 18 C-12 16 -14 0 0-16Z"/>`;
  }
  if (component.domain === "network") {
    return `<rect class="component-body" x="-18" y="-12" width="36" height="24" rx="5"/><path d="M-10-2h20M-7 5h14"/>`;
  }
  if (component.domain === "access") {
    return `<path class="component-body" d="M-16 14 L16 14 L16-14"/><path d="M-14 12 C2 8 10-2 16-14"/>`;
  }
  return `<circle class="component-body" r="15"/><path d="M-8 0h16M0-8v16"/>`;
}

function factList(node) {
  if (!node.facts?.length) return "";
  return `
    <div class="fact-list">
      ${node.facts.map((fact) => `
        <div class="${fact.state}">
          <span>${fact.state}</span>
          <strong>${fact.label}</strong>
          <p>${fact.value}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function evidenceList(node) {
  return `
    <div class="evidence-list">
      ${node.evidence.map((item) => `
        <article class="${item.state}">
          <span>${item.kind}</span>
          <strong>${item.title}</strong>
          <p>${item.provenance}</p>
          <em>${item.state}</em>
        </article>
      `).join("")}
    </div>
  `;
}

function contextualActions(node) {
  if (node.id !== "boiler" && node.id !== "heating") {
    return `<button class="secondary" data-action="select" data-value="boiler">Select boiler</button>`;
  }
  return `
    <div class="action-stack">
      <button class="secondary" data-action="evidence">${icon("evidence")} Boiler evidence</button>
      <button class="secondary" data-action="explain" data-value="plain">${icon("explain")} Explain selected ${node.type}</button>
      <button class="primary" data-action="create-what-if">${icon("branch")} Change & Compare</button>
      <a class="secondary" ${link("/run")}>Play current behaviour</a>
    </div>
  `;
}

function dimensionCard(name, dimension) {
  return `
    <article class="lens-card">
      <p class="eyebrow">${name}</p>
      <h3>${dimension.summary}</h3>
      <ul>${dimension.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>
    </article>
  `;
}

function explanationPanel() {
  const mode = explanationText[state.explanationMode] || explanationText.plain;
  return `
    <section class="panel explanation">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Explain · ${selectedNode(state).name}</p>
          <h2>${mode.title}</h2>
        </div>
        <button class="secondary small" data-action="close-explain">Close</button>
      </div>
      <p>${mode.body}</p>
      <div class="shortcut-list">
        ${Object.entries(explanationText).map(([key, item]) => `
          <button class="${state.explanationMode === key ? "active" : ""}" data-action="explain" data-value="${key}">${item.title}</button>
        `).join("")}
      </div>
    </section>
  `;
}

function tightenView() {
  const blocked = !canPromote(state);
  return shell(`
    <section class="hero-card">
      <div>
        <p class="eyebrow">Temporary import review</p>
        <h2>Review & Complete Capture evidence</h2>
        <p>Ambiguities become bounded questions. Choices preserve provenance and decide what may enter the authoritative Twin.</p>
      </div>
      <button class="primary" data-action="promote" ${blocked ? "disabled" : ""}>Promote to Authoritative Twin</button>
    </section>
    <section class="panel">
      <h2>Ambiguity questions</h2>
      <div class="tighten-list">
        ${state.reviewItems.map((item) => `
          ${reviewItem(item)}
          ${item.resolved ? "" : resolutionActions(item)}
        `).join("")}
      </div>
    </section>
  `);
}

function reviewItem(item) {
  return `
    <article class="ambiguity-card ${item.type} ${item.resolved ? "resolved" : ""}">
      <span>${item.resolved ? "resolved" : item.type}</span>
      <strong>${item.title}</strong>
      ${item.question ? `<h3>${item.question}</h3>` : ""}
      <p>${item.detail}</p>
      ${item.action ? `<em>${item.action}</em>` : ""}
      ${item.followUp ? `<q>${item.followUp}</q>` : ""}
    </article>
  `;
}

function resolutionActions(item) {
  const options = item.resolutions || [{
    id: "resolve",
    label: "Resolve",
    result: "Resolved in sandbox review"
  }];
  return `
    <div class="resolution-actions">
      ${options.map((option) => `
        <button class="choice-card" data-action="resolve" data-value="${item.id}" data-resolution="${option.id}">
          <strong>${option.label}</strong>
          <span>${option.result}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function whatIfView() {
  const hasProposal = Boolean(state.proposedTwin);
  return shell(`
    <section class="hero-card proposed">
      <div>
        <p class="eyebrow">${hasProposal ? "Proposed copy" : "Current reality only"}</p>
        <h2>Change & Compare</h2>
        <p>Copy the Current Twin, substitute the boiler graph item at the same XYZ location, and inspect causal consequences without mutating authoritative reality.</p>
      </div>
      <div class="action-stack compact">
        <button class="primary" data-action="create-what-if">Create proposed copy</button>
        <button class="secondary" data-action="apply-output" data-value="35" ${hasProposal ? "" : "disabled"}>Substitute boiler item</button>
      </div>
    </section>

    <section class="compare-grid">
      <article class="panel current">
        <p class="eyebrow">Current Reality</p>
        <h2>${state.authoritativeTwin.nodes.boiler.name}</h2>
        <p>The authoritative Twin remains unchanged.</p>
        ${graphicTwin("current")}
      </article>
      <article class="panel proposed-copy">
        <p class="eyebrow">Proposed copy</p>
        <h2>${hasProposal ? state.proposedTwin.nodes.boiler.name : "No proposed copy yet"}</h2>
        <p>${hasProposal ? "This copy has an explicit change set. The current Twin is unchanged." : "Create a proposed copy before making changes."}</p>
        ${hasProposal ? graphicTwin("proposed") : ""}
      </article>
    </section>

    <section class="panel">
      <h2>Causal consequences</h2>
      ${state.consequences.length ? `
        <div class="impact-chain">
          ${state.consequences.map((item) => `
            <article class="${item.className}">
              <span>${item.title}</span>
              <strong>${item.current} -> ${item.proposed}</strong>
              <p>${item.result}</p>
            </article>
          `).join("")}
        </div>
      ` : `<p>No proposed change has been applied yet.</p>`}
      <div class="action-row">
        <button class="secondary" data-action="discard-what-if" ${hasProposal ? "" : "disabled"}>Discard proposed copy</button>
        <button class="primary" data-action="start-run" data-value="proposed" ${state.consequences.length ? "" : "disabled"}>Play proposed behaviour</button>
      </div>
    </section>
  `);
}

function runView() {
  const step = runTimeline[state.runStep];
  const target = state.runTarget === "proposed" && state.proposedTwin ? "proposed copy" : "current authoritative Twin";
  return shell(`
    <section class="hero-card">
      <div>
        <p class="eyebrow">Time-based behaviour</p>
        <h2>Operate ${target}</h2>
        <p>Mocked operation over time. This explains behaviour and bottlenecks; it does not recommend a product.</p>
      </div>
      <div class="action-row">
        <button class="primary" data-action="${state.runPlaying ? "pause-run" : "start-run"}">${state.runPlaying ? "Pause" : "Play"}</button>
        <button class="secondary" data-action="advance-run">Step</button>
        <button class="secondary" data-action="reset-run">Reset</button>
      </div>
    </section>
    <section class="run-board">
      ${graphicTwin("run")}
      <aside class="panel">
        <p class="eyebrow">${step.time}</p>
        <h2>${step.title}</h2>
        <p>${step.state}</p>
        <div class="timeline">
          ${runTimeline.map((item, index) => `
            <div class="${index === state.runStep ? "active" : ""}">
              <span>${item.time}</span>
              <strong>${item.title}</strong>
            </div>
          `).join("")}
        </div>
      </aside>
    </section>
  `);
}

function capcom() {
  const tag = state.tagPath.length ? ` · ${state.tagPath.join(" / ")}` : "";
  return `<div class="capcom"><strong>CapCom</strong><span>Room 1 · Scanning${tag}</span><b>•••</b></div>`;
}

function tagRail(side) {
  const groups = side === "left" ? captureDemo.tagGroups.slice(0, 3) : captureDemo.tagGroups.slice(3);
  return `
    <div class="tag-rail ${side}">
      ${groups.map((group) => `
        <button class="tag-root ${state.tagPath[0] === group.label ? "open" : ""}" data-tag="${group.items[0]}" data-group="${group.label}">
          ${icon(group.icon)}
          <span>${group.label}</span>
        </button>
        ${state.tagPath[0] === group.label ? `<div class="tag-branch">
          ${group.items.map((item) => `<button data-tag="${item}" data-group="${group.label}">${item}</button>`).join("")}
        </div>` : ""}
      `).join("")}
    </div>
  `;
}

function captureDemoView() {
  return shell(`
    <section class="capture-surface">
      ${capcom()}
      ${tagRail("left")}
      ${tagRail("right")}
      <div class="readiness-ring"></div>
      <div class="thumbnail">${icon("camera")}</div>
      <div class="dollhouse"></div>
      <button class="shutter" aria-label="Capture evidence"></button>
      <button class="finish-room">Finish Room</button>
    </section>
    <section class="compact-strip">
      ${captureDemo.rooms.map((room, index) => `<span>${index + 1}. ${room}</span>`).join("")}
    </section>
  `);
}

function render() {
  const views = {
    "/main": mainView,
    "/tighten": tightenView,
    "/what-if": whatIfView,
    "/run": runView,
    "/capture-demo": captureDemoView
  };
  app.innerHTML = (views[currentRoute()] || mainView)();
  app.classList.add("ready");
}

render();
