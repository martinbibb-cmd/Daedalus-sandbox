import {
  captureDemo,
  explanationText,
  property,
  runTimeline
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

const routes = [
  ["Main", "/main"],
  ["Tighten", "/tighten"],
  ["What If", "/what-if"],
  ["Run", "/run"],
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
    handleAction(action.dataset.action, action.dataset.value);
    return;
  }

  const tag = event.target.closest("[data-tag]");
  if (tag) {
    state = { ...state, tagPath: [tag.dataset.group, tag.dataset.tag] };
    render();
  }
});

window.addEventListener("hashchange", render);

function handleAction(action, value) {
  if (action === "select") state = selectNode(state, value);
  if (action === "back") state = backOneLevel(state);
  if (action === "evidence") state = openEvidence(state);
  if (action === "explain") state = openExplanation(state, value || "plain");
  if (action === "close-explain") state = { ...state, explanationOpen: false };
  if (action === "resolve") state = resolveTightenItem(state, value);
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
    "/main": "Main",
    "/tighten": "Tighten Import",
    "/what-if": "What If",
    "/run": "Run",
    "/capture-demo": "Capture Demo"
  }[route] || "Main";
}

function mainView() {
  const node = selectedNode(state);
  const path = state.selectedPath;
  const isEvidence = selectedId(state) === "boiler-evidence";
  return shell(`
    <section class="hero-card">
      <div>
        <p class="eyebrow">Current Reality · Authoritative</p>
        <h2>${property.name}</h2>
        <p>${property.address}</p>
      </div>
      <div class="status-pill">Current Twin v${state.authoritativeTwin.version}</div>
    </section>

    <section class="workspace-grid">
      <article class="panel twin-map">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Combined Twin</p>
            <h2>House + System + Home</h2>
          </div>
          ${path.length > 1 ? `<button class="secondary small" data-action="back">Back</button>` : ""}
        </div>
        ${breadcrumb(path)}
        ${graphicTwin("current")}
      </article>

      <aside class="panel inspector">
        <p class="eyebrow">${node.type}</p>
        <h2>${node.name}</h2>
        <p>${node.summary}</p>
        ${factList(node)}
        ${isEvidence ? evidenceList(node) : contextualActions(node)}
      </aside>
    </section>

    <section class="panel dimensions">
      ${dimensionCard("House", state.authoritativeTwin.dimensions.house)}
      ${dimensionCard("System", state.authoritativeTwin.dimensions.system)}
      ${dimensionCard("Home", state.authoritativeTwin.dimensions.home)}
    </section>

    <section class="panel unresolved">
      <h2>Important unresolved evidence</h2>
      <div class="tighten-list">
        ${state.reviewItems.filter((item) => !item.resolved).map(reviewItem).join("")}
      </div>
      <a class="secondary" ${link("/tighten")}>Open Tighten review</a>
    </section>

    ${state.explanationOpen ? explanationPanel() : ""}
  `);
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
  const selected = selectedId(state);
  const isBoilerFocus = path.includes("boiler") || selected === "boiler-evidence";
  const isProposed = mode === "proposed" && state.proposedTwin;
  const hasConsequences = Boolean(state.consequences.length);
  const runStep = mode === "run" ? runTimeline[state.runStep] : null;
  const bottleneck = runStep?.bottleneck;
  const boilerOutput = isProposed ? state.proposedTwin.nodes.boiler.outputKw : state.authoritativeTwin.nodes.boiler.outputKw;
  return `
    <div class="graphic-twin ${mode} ${isBoilerFocus ? "focus-boiler" : ""} ${hasConsequences ? "has-consequences" : ""} ${bottleneck ? "has-bottleneck" : ""}">
      <div class="house-shell" aria-label="Graphic twin of the property">
        <button class="room-zone kitchen" data-action="select" data-value="heating">
          <strong>Kitchen</strong>
          <span>plant wall</span>
        </button>
        <button class="room-zone lounge" data-action="select" data-value="heat-loss">
          <strong>Lounge</strong>
          <span>heat demand</span>
        </button>
        <button class="room-zone hall" data-action="select" data-value="primary-pipework">
          <strong>Hall</strong>
          <span>primary route</span>
        </button>
        <button class="room-zone utility" data-action="select" data-value="controls">
          <strong>Utility</strong>
          <span>controls</span>
        </button>

        <button class="appliance boiler-object ${path.includes("boiler") ? "selected" : ""} ${runStep?.active === "boiler" ? "active" : ""}" data-action="select" data-value="boiler">
          <span class="appliance-body"></span>
          <strong>Boiler</strong>
          <em>${boilerOutput} kW</em>
        </button>

        <button class="system-overlay primary-pipe ${path.includes("primary-pipework") ? "selected" : ""} ${hasConsequences ? "constraint" : ""} ${runStep?.active === "primary-pipework" ? "active" : ""}" data-action="select" data-value="primary-pipework">
          <span>Primary pipework</span>
        </button>
        <button class="system-overlay control-link ${path.includes("controls") ? "selected" : ""} ${hasConsequences ? "limited" : ""}" data-action="select" data-value="controls">
          <span>Controls</span>
        </button>
        <button class="system-overlay heat-zone ${path.includes("heat-loss") ? "selected" : ""}" data-action="select" data-value="heat-loss">
          <span>Heat-loss evidence</span>
        </button>

        ${isBoilerFocus ? `
          <button class="evidence-marker photo" data-action="evidence" aria-label="Boiler photo evidence">Photo</button>
          <button class="evidence-marker manual" data-action="evidence" aria-label="Manual measurement evidence">Measure</button>
          <button class="evidence-marker declared" data-action="evidence" aria-label="Declared model evidence">Declared</button>
          <div class="graphic-callout boiler-callout">
            <strong>Boiler evidence</strong>
            <span>Observed photo, manual measurement and declared model remain attached here.</span>
          </div>
        ` : ""}

        ${hasConsequences ? `
          <div class="graphic-callout pipe-callout warning">
            <strong>Primary constraint</strong>
            <span>Useful output plateaus before 35 kW reaches rooms.</span>
          </div>
          <div class="graphic-callout controls-callout amber">
            <strong>Controls limit</strong>
            <span>Current configuration does not request the proposed output.</span>
          </div>
        ` : ""}

        ${bottleneck ? `<div class="graphic-callout bottleneck-callout"><strong>Bottleneck</strong><span>${bottleneck}</span></div>` : ""}
      </div>
    </div>
  `;
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
      <button class="primary" data-action="create-what-if">${icon("branch")} Create What If copy</button>
      <a class="secondary" ${link("/run")}>Run current system</a>
    </div>
  `;
}

function dimensionCard(name, dimension) {
  return `
    <article>
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
        <h2>Tighten fresh Capture Package</h2>
        <p>Resolve candidates, unknowns and conflicts before promoting the import into authoritative reality.</p>
      </div>
      <button class="primary" data-action="promote" ${blocked ? "disabled" : ""}>Promote to Authoritative Twin</button>
    </section>
    <section class="panel">
      <h2>Review items</h2>
      <div class="tighten-list">
        ${state.reviewItems.map((item) => `
          ${reviewItem(item)}
          ${item.resolved ? "" : `<button class="secondary" data-action="resolve" data-value="${item.id}">${actionLabel(item.type)}</button>`}
        `).join("")}
      </div>
    </section>
  `);
}

function reviewItem(item) {
  return `
    <article class="${item.type} ${item.resolved ? "resolved" : ""}">
      <span>${item.resolved ? "resolved" : item.type}</span>
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </article>
  `;
}

function actionLabel(type) {
  return {
    candidate: "Confirm candidate",
    unknown: "Mark unknown",
    conflict: "Resolve conflict",
    confirmed: "Acknowledge"
  }[type] || "Resolve";
}

function whatIfView() {
  const hasProposal = Boolean(state.proposedTwin);
  return shell(`
    <section class="hero-card proposed">
      <div>
        <p class="eyebrow">${hasProposal ? "Proposed branch" : "Current reality only"}</p>
        <h2>Boiler output What If</h2>
        <p>Create a proposed Twin branch, change boiler output from 24 kW to 35 kW, and inspect causal consequences without mutating the authoritative Twin.</p>
      </div>
      <div class="action-stack compact">
        <button class="primary" data-action="create-what-if">Create proposed copy</button>
        <button class="secondary" data-action="apply-output" data-value="35" ${hasProposal ? "" : "disabled"}>Apply 35 kW change</button>
      </div>
    </section>

    <section class="compare-grid">
      <article class="panel current">
        <p class="eyebrow">Current Reality</p>
        <h2>${state.authoritativeTwin.nodes.boiler.outputKw} kW boiler</h2>
        <p>The authoritative Twin remains unchanged.</p>
        ${graphicTwin("current")}
      </article>
      <article class="panel proposed-copy">
        <p class="eyebrow">Proposed What If Twin</p>
        <h2>${hasProposal ? `${state.proposedTwin.nodes.boiler.outputKw} kW boiler` : "No proposed branch yet"}</h2>
        <p>${hasProposal ? "This is a cloned branch with a change set." : "Create a What If copy before making changes."}</p>
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
        <button class="secondary" data-action="discard-what-if" ${hasProposal ? "" : "disabled"}>Discard proposed Twin</button>
        <button class="primary" data-action="start-run" data-value="proposed" ${state.consequences.length ? "" : "disabled"}>Run proposed system</button>
      </div>
    </section>
  `);
}

function runView() {
  const step = runTimeline[state.runStep];
  const target = state.runTarget === "proposed" && state.proposedTwin ? "Proposed What If Twin" : "Current authoritative Twin";
  return shell(`
    <section class="hero-card">
      <div>
        <p class="eyebrow">Time-based behaviour</p>
        <h2>Run ${target}</h2>
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
