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
  canPromote,
  createInitialState,
  createWhatIf,
  discardWhatIf,
  pauseRun,
  promoteImport,
  resetRun,
  resolveTightenItem,
  routeFor,
  startRun
} from "./model.js";

const app = document.querySelector("#app");
let state = createInitialState();
let activeLayer = "all";
let selectedComponentId = "boiler";
let runTimer = null;

const routes = [
  ["Place", "/main"],
  ["Tighten", "/tighten"],
  ["Clone", "/what-if"],
  ["Operate", "/run"],
  ["Capture", "/capture-demo"]
];

function currentRoute() {
  return routeFor(window.location.hash.replace(/^#/, ""));
}

function link(route) {
  return `href="#${route}" data-route="${route}"`;
}

function icon(name) {
  const paths = {
    home: "M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3v-9.5Z",
    tighten: "M12 3v18M5 8h14M7 16h10",
    clone: "M7 7h10v10H7zM4 4h10M10 20h10V10",
    operate: "M5 4v16l14-8L5 4Z",
    capture: "M4 7h4l1.4-2h5.2L16 7h4v12H4V7Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
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
  if (event.target.closest("[data-route]")) return;

  const action = event.target.closest("[data-action]");
  if (action) {
    handleAction(action.dataset.action, action.dataset.value, action.dataset.resolution);
    return;
  }

  const layer = event.target.closest("[data-layer]");
  if (layer) {
    activeLayer = layer.dataset.layer;
    render();
    return;
  }

  const component = event.target.closest("[data-component]");
  if (component) {
    selectedComponentId = component.dataset.component;
    render();
    return;
  }

  const tag = event.target.closest("[data-tag]");
  if (tag) {
    state = { ...state, tagPath: [tag.dataset.group, tag.dataset.tag] };
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
  }, 1100);
}

function shell(content) {
  const active = currentRoute();
  return `
    <main class="app place-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Daedalus Main sandbox</p>
          <h1>${titleFor(active)}</h1>
        </div>
        <a class="pill" ${link("/capture-demo")}>Capture demo</a>
      </header>
      ${content}
      <nav class="tabbar">
        ${routes.map(([label, route]) => `
          <a ${link(route)} class="${active === route ? "active" : ""}">
            ${icon(route === "/tighten" ? "tighten" : route === "/what-if" ? "clone" : route === "/run" ? "operate" : route === "/capture-demo" ? "capture" : "home")}
            <span>${label}</span>
          </a>
        `).join("")}
      </nav>
    </main>
  `;
}

function titleFor(route) {
  return {
    "/main": "Living Place Twin",
    "/tighten": "Tighten Import",
    "/what-if": "Clone & Edit",
    "/run": "Operate Twin",
    "/capture-demo": "Capture Demo"
  }[route] || "Living Place Twin";
}

function selectedComponent() {
  return spatialFixture.components.find((item) => item.id === selectedComponentId) || spatialFixture.components[0];
}

function roomFor(roomId) {
  return spatialFixture.rooms.find((room) => room.id === roomId) || spatialFixture.rooms[0];
}

function visibleDomain(domain) {
  return activeLayer === "all" || activeLayer === domain || (activeLayer === "evidence" && domain === "evidence");
}

function layerBar() {
  return `
    <div class="layer-bar" aria-label="Specialist overlays">
      ${spatialFixture.layers.map((layer) => `
        <button class="${activeLayer === layer.id ? "active" : ""}" data-layer="${layer.id}">${layer.label}</button>
      `).join("")}
    </div>
  `;
}

function modeIntro(mode) {
  const selected = selectedComponent();
  const unresolved = state.reviewItems.filter((item) => !item.resolved).length;
  const copyState = state.proposedTwin ? "Clone active" : "Current only";
  const runStep = runTimeline[state.runStep];
  return `
    <section class="place-context">
      <div>
        <p class="eyebrow">${property.type} · ${property.address}</p>
        <h2>${property.name}</h2>
        <p>${introText(mode)}</p>
      </div>
      <div class="place-readouts">
        <span><b>Selected</b>${selected.label}</span>
        <span><b>Review</b>${unresolved} open</span>
        <span><b>Clone</b>${copyState}</span>
        <span><b>Operate</b>${runStep.time} ${runStep.title}</span>
      </div>
    </section>
  `;
}

function introText(mode) {
  if (mode === "tighten") return "Ambiguities are pinned to real graph locations. The choices update provenance rather than merely confirming text.";
  if (mode === "clone") return "Clone creates an editable Twin branch. Edits keep their spatial anchors unless the change explicitly moves them; Current reality stays protected.";
  if (mode === "run") return "The graph operates through the same place model. This is one coherent heating sequence, not disconnected mode events.";
  return "The Place remains the interface. Specialist systems appear as overlays on the same captured geometry.";
}

function mainView() {
  const component = selectedComponent();
  return shell(`
    ${modeIntro("main")}
    <section class="place-workbench">
      ${placeCanvas({ mode: "main" })}
      ${componentInspector(component)}
    </section>
    <section class="lower-dock">
      ${dimensionCard("House", state.authoritativeTwin.dimensions.house)}
      ${dimensionCard("System", state.authoritativeTwin.dimensions.system)}
      ${dimensionCard("Home", state.authoritativeTwin.dimensions.home)}
    </section>
  `);
}

function tightenView() {
  const blocked = !canPromote(state);
  return shell(`
    ${modeIntro("tighten")}
    <section class="place-workbench">
      ${placeCanvas({ mode: "tighten" })}
      <aside class="instrument-panel">
        <p class="eyebrow">Spatial ambiguity pass</p>
        <h2>Questions tied to the Twin</h2>
        <p>Each question is tied to a route, component, or missing relationship. Manual answers preserve evidence class and confidence.</p>
        <div class="tighten-questions">
          ${state.reviewItems.map(reviewItem).join("")}
        </div>
        <button class="primary wide" data-action="promote" ${blocked ? "disabled" : ""}>Promote reviewed import</button>
      </aside>
    </section>
  `);
}

function cloneView() {
  const hasProposal = Boolean(state.proposedTwin);
  return shell(`
    ${modeIntro("clone")}
    <section class="place-workbench">
      ${placeCanvas({ mode: "clone" })}
      <aside class="instrument-panel">
        <p class="eyebrow">Protected current · editable clone</p>
        <h2>Edit cloned Twin</h2>
        <p>The boiler node is edited in the clone while retaining the same XYZ anchor. The original Current Twin stays authoritative and runnable.</p>
        <div class="clone-actions">
          <button class="primary wide" data-action="create-what-if">Create clone</button>
          <button class="secondary wide" data-action="apply-output" data-value="35" ${hasProposal ? "" : "disabled"}>Edit boiler at same location</button>
          <button class="secondary wide" data-action="discard-what-if" ${hasProposal ? "" : "disabled"}>Discard clone</button>
          <button class="primary wide" data-action="start-run" data-value="proposed" ${state.consequences.length ? "" : "disabled"}>Operate clone</button>
        </div>
        ${state.consequences.length ? consequenceList() : `<p class="quiet-note">No clone edits applied yet.</p>`}
      </aside>
    </section>
  `);
}

function runView() {
  const step = runTimeline[state.runStep];
  return shell(`
    ${modeIntro("run")}
    <section class="place-workbench">
      ${placeCanvas({ mode: "run" })}
      <aside class="instrument-panel">
        <p class="eyebrow">Single system operation</p>
        <h2>${step.time} · ${step.title}</h2>
        <p>${step.state}</p>
        <div class="run-controls">
          <button class="primary" data-action="${state.runPlaying ? "pause-run" : "start-run"}">${state.runPlaying ? "Pause" : "Play"}</button>
          <button class="secondary" data-action="advance-run">Step</button>
          <button class="secondary" data-action="reset-run">Reset</button>
        </div>
        <div class="timeline">
          ${runTimeline.map((item, index) => `
            <div class="${index === state.runStep ? "active" : ""}">
              <span>${item.time}</span>
              <strong>${item.title}</strong>
              <p>${item.active === "primary-pipework" ? "Primary route highlighted in place." : "State projected onto the same heating graph."}</p>
            </div>
          `).join("")}
        </div>
      </aside>
    </section>
  `);
}

function placeCanvas({ mode }) {
  const component = selectedComponent();
  const proposal = state.proposedTwin && (mode === "clone" || mode === "run");
  const activeStep = mode === "run" ? runTimeline[state.runStep] : null;
  const lens = activeLayer === "all" ? "heating" : activeLayer;
  const lensInfo = twinLensInfo(lens);
  return `
    <article class="place-canvas-card workstation-panel ${lensInfo.id}">
      <div class="workstation-chrome">
        <div>
          <p class="eyebrow">Daedalus · Living Dollhouse · Ground floor</p>
          <h2><span>${lensInfo.icon}</span>${lensInfo.title}</h2>
        </div>
        <div class="workstation-actions">
          <button aria-label="Layer stack">▰</button>
          <button aria-label="Settings">⚙</button>
          <button aria-label="More">⋮</button>
        </div>
      </div>
      ${lensTabs(lensInfo.id)}
      ${lensStats(lensInfo.id, activeStep)}
      <div class="workstation-body">
        ${lensLegend(lensInfo.id)}
        ${lensFloatingPanel(lensInfo.id, component, activeStep)}
        <div class="cad-viewport ${mode} ${proposal ? "proposal-active" : ""}">
          <svg class="place-svg" viewBox="0 0 960 640" role="img" aria-label="CAD-style Place Twin sandbox mockup">
            <defs>
              <pattern id="floor-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="rgba(20,22,26,.055)" stroke-width="1"/>
              </pattern>
              <linearGradient id="roomSurface" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stop-color="#ffffff"/>
                <stop offset="1" stop-color="#dfe5ec"/>
              </linearGradient>
              <linearGradient id="wallFace" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stop-color="#cbd5df"/>
                <stop offset="1" stop-color="#9ba8b8"/>
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect class="cad-bg" x="0" y="0" width="960" height="640" rx="26"/>
            <rect x="0" y="0" width="960" height="640" fill="url(#floor-grid)"/>
            ${placeShell()}
            ${coverageLayer(lensInfo.id)}
            ${routeLayer(activeStep)}
            ${componentLayer(proposal, activeStep)}
            ${tightenPins(mode)}
            ${cloneOverlay(proposal)}
            ${runOverlay(activeStep)}
          </svg>
        </div>
      </div>
      <div class="workstation-dock">
        ${dockCards(lensInfo.id, component)}
      </div>
    </article>
  `;
}

function twinLensInfo(layerId) {
  const map = {
    heating: { id: "heating", title: "Heating Twin", icon: "♨", accent: "heat" },
    water: { id: "water", title: "Water Twin", icon: "◖", accent: "water" },
    electrical: { id: "electrical", title: "Electrical Twin", icon: "ϟ", accent: "power" },
    network: { id: "network", title: "WiFi Twin", icon: "≋", accent: "network" },
    access: { id: "access", title: "Human Interaction Twin", icon: "◎", accent: "access" },
    evidence: { id: "evidence", title: "Evidence Twin", icon: "◇", accent: "evidence" }
  };
  return map[layerId] || map.heating;
}

function lensTabs(layerId) {
  const tabs = {
    heating: ["System", "Temperatures", "Flow / Return", "Efficiency", "Evidence"],
    water: ["Outlets", "Pressure", "Flow", "Hot water", "Evidence"],
    electrical: ["Circuits", "Sockets", "Lighting", "Supplies", "Evidence"],
    network: ["Coverage", "Devices", "Backhaul", "Entry", "Evidence"],
    access: ["Navigate", "Clearances", "Obstacles", "Surfaces", "Evidence"],
    evidence: ["Observed", "Inferred", "Unknown", "Conflicts", "Sources"]
  }[layerId] || ["System", "Evidence"];
  return `
    <div class="lens-tabs">
      ${spatialFixture.layers.filter((layer) => layer.id !== "all").map((layer) => `
        <button class="${activeLayer === layer.id || (activeLayer === "all" && layer.id === "heating") ? "active" : ""}" data-layer="${layer.id}">${layer.label}</button>
      `).join("")}
      <span class="tab-divider"></span>
      ${tabs.map((tab, index) => `<button class="${index === 0 ? "active subtab" : "subtab"}">${tab}</button>`).join("")}
    </div>
  `;
}

function lensStats(layerId, activeStep) {
  const rows = {
    heating: [["System mode", activeStep ? "OPERATING" : "HEATING"], ["Outdoor", "6.2 °C"], ["Flow", activeStep?.active === "primary-pipework" ? "Limited" : "45.1 °C"], ["Return", "37.8 °C"], ["Efficiency", "87%"]],
    water: [["Mode", "Observed"], ["Standing", "3.4 bar"], ["Flow", "14.6 l/min"], ["Hot water", "uncertain"], ["Evidence", "mixed"]],
    electrical: [["Supply", "observed"], ["Circuits", "candidate"], ["Sockets", "1 tagged"], ["Lighting", "missing"], ["Evidence", "partial"]],
    network: [["Band", "2.4 / 5 GHz"], ["Router", "observed"], ["Entry", "candidate"], ["Backhaul", "unknown"], ["Dead zones", "1"]],
    access: [["Profile", "wheelchair"], ["Route", "candidate"], ["Narrowest", "760 mm"], ["Turns", "3"], ["Step", "190 mm"]],
    evidence: [["Observed", "6"], ["Candidate", "5"], ["Unknown", "3"], ["Conflicts", "1"], ["Photos", "linked"]]
  }[layerId] || [];
  return `
    <div class="lens-stats">
      ${rows.map(([label, value]) => `<span><b>${label}</b>${value}</span>`).join("")}
    </div>
  `;
}

function lensLegend(layerId) {
  const items = {
    heating: [["Flow hot", "legend-hot"], ["Return cool", "legend-cool"], ["Valve", "legend-valve"], ["Pump", "legend-pump"], ["Unknown", "legend-dash"]],
    water: [["Cold supply", "legend-cool"], ["Hot supply", "legend-hot"], ["Outlet", "legend-pump"], ["Inferred", "legend-dash"]],
    electrical: [["Socket", "legend-power"], ["Consumer unit", "legend-pump"], ["Circuit candidate", "legend-dash"], ["Unknown", "legend-unknown"]],
    network: [["Router / AP", "legend-network"], ["ONT / entry", "legend-amber"], ["Wired backhaul", "legend-dash"], ["Coverage", "legend-coverage"]],
    access: [["Reachable", "legend-access"], ["Constrained", "legend-amber"], ["Blocked", "legend-red"], ["Unknown", "legend-dash"]],
    evidence: [["Observed", "legend-network"], ["Candidate", "legend-amber"], ["Unknown", "legend-unknown"], ["Conflict", "legend-red"]]
  }[layerId] || [];
  return `
    <aside class="map-legend">
      <strong>${twinLensInfo(layerId).title} Legend</strong>
      ${items.map(([label, klass]) => `<span><i class="${klass}"></i>${label}</span>`).join("")}
    </aside>
  `;
}

function lensFloatingPanel(layerId, component, activeStep) {
  const content = {
    heating: `<b>${component.domain === "heating" ? component.label : "Bathroom Radiator"}</b><span>Flow: 44.0 °C</span><span>Return: 36.2 °C</span><span>ΔT: 7.8 °C</span>`,
    water: `<b>Hot-water uncertainty</b><span>Combination boiler and cylinder both referenced.</span><span>Tighten needs a bounded choice.</span>`,
    electrical: `<b>Socket evidence</b><span>1 observed accessory</span><span>Consumer unit candidate</span><span>Circuit not confirmed</span>`,
    network: `<b>Dead Zone #1</b><span>Signal: weak</span><span>Serving AP: Router</span><span>ONT unresolved</span>`,
    access: `<b>Route to living room</b><span>Status: candidate</span><span>Narrowest: 760 mm</span><span>Step: 190 mm</span>`,
    evidence: `<b>${component.label}</b><span>${component.evidence.length} linked refs</span><span>${component.confidence}</span><span>${formatPosition(component.position)}</span>`
  }[layerId];
  return `<aside class="map-popover">${content}</aside>`;
}

function dockCards(layerId, component) {
  const cards = {
    heating: [["Hall radiator", "Low ΔT suggests restricted flow"], ["Kitchen pipework", "Possible bottleneck detected"], [component.label, `${component.confidence} · ${roomFor(component.roomId).label}`]],
    water: [["Kitchen tap", "Observed outlet"], ["Hot-water source", "Needs bounded Tighten question"], ["Flow evidence", "Pressure and flow linked"]],
    electrical: [["Socket", "Observed accessory"], ["Consumer unit", "Candidate component"], ["Lighting", "Missing capture item"]],
    network: [["Phone", "-48 dBm · 5 GHz"], ["Router", "Observed node"], ["ONT", "Not captured"]],
    access: [["Kitchen doorway", "Clear width below target"], ["Threshold", "Needs measurement"], ["Turning space", "Unknown"]],
    evidence: [["Photo", "Anchored to boiler"], ["Point cloud", "Observed detail patch"], ["Transcript", "Customer statements only"]]
  }[layerId] || [];
  return cards.map(([title, detail]) => `<article><strong>${title}</strong><span>${detail}</span></article>`).join("");
}

function coverageLayer(layerId) {
  if (layerId !== "network" && layerId !== "access") return "";
  if (layerId === "network") {
    return `
      <g class="coverage-layer">
        <ellipse class="coverage good" cx="320" cy="340" rx="290" ry="210"/>
        <ellipse class="coverage weak" cx="620" cy="190" rx="150" ry="110"/>
        <ellipse class="coverage blocked" cx="660" cy="410" rx="130" ry="96"/>
      </g>
    `;
  }
  return `
    <g class="coverage-layer access-clearance">
      <path class="access-fill reachable" d="M640 292 L452 292 L452 500 L120 500"/>
      <path class="access-fill constrained" d="M120 500 L96 500"/>
      <rect class="access-zone" x="230" y="392" width="112" height="86" rx="18"/>
    </g>
  `;
}

function placeShell() {
  const rooms = [
    { id: "room-1", label: "Kitchen / plant", x: 108, y: 112, w: 344, h: 218 },
    { id: "room-2", label: "Hall / service spine", x: 452, y: 112, w: 322, h: 218 },
    { id: "room-3", label: "Living space", x: 108, y: 330, w: 410, h: 214 },
    { id: "room-4", label: "Utility edge", x: 518, y: 330, w: 256, h: 214 }
  ];
  return `
    <g class="place-shell-svg">
      <g class="dollhouse-shadow">
        <path d="M126 566 L802 566 L846 520 L172 520 Z"/>
      </g>
      ${rooms.map((room) => dollhouseRoom(room)).join("")}
      <path class="outer-wall iso-wall-line" d="M108 112H774V544H108Z"/>
      <path class="inner-wall iso-wall-line" d="M452 112V330H108M452 330H774M518 330V544"/>
      <path class="opening iso-opening" d="M432 330H472M518 410V458M268 330H326"/>
      <path class="exterior-path" d="M108 562H774"/>
      <text class="scale-label" x="108" y="594">0m</text>
      <path class="scale-bar" d="M142 588H302"/>
      <text class="scale-label" x="314" y="594">4m mock scale</text>
    </g>
  `;
}

function dollhouseRoom(room) {
  const lift = 34;
  const depth = 22;
  const x = room.x;
  const y = room.y;
  const w = room.w;
  const h = room.h;
  return `
    <g class="dollhouse-room" data-room="${room.id}">
      <path class="room-side south" d="M${x} ${y + h}H${x + w}L${x + w} ${y + h + depth}H${x}Z"/>
      <path class="room-side east" d="M${x + w} ${y}V${y + h}L${x + w} ${y + h + depth}V${y + depth}Z"/>
      <rect class="room-plate" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>
      <path class="room-wall north" d="M${x} ${y}H${x + w}V${y + lift}H${x}Z"/>
      <path class="room-wall west" d="M${x} ${y}V${y + h}H${x + lift}V${y}Z"/>
      <text class="room-name" x="${x + w / 2}" y="${y + h / 2 - 4}">${room.label}</text>
      <text class="room-role" x="${x + w / 2}" y="${y + h / 2 + 16}">captured room volume</text>
    </g>
  `;
}

function routeLayer(activeStep) {
  return `
    <g class="route-layer-svg">
      ${spatialFixture.routes.filter((route) => visibleDomain(route.domain)).map((route) => `
        <path class="route-svg ${route.domain} ${route.id === "primary" && activeStep ? "run-active" : ""} ${route.id === "primary" && activeStep?.bottleneck ? "route-bottleneck" : ""}" d="${route.d}"/>
        ${route.componentIds?.includes(selectedComponentId) || activeStep?.active === "primary-pipework" ? `<text class="route-text" x="${routeLabelPosition(route).x}" y="${routeLabelPosition(route).y}">${route.label}</text>` : ""}
      `).join("")}
    </g>
  `;
}

function componentLayer(proposal, activeStep) {
  return `
    <g class="component-layer-svg">
      ${spatialFixture.components.filter((item) => visibleDomain(item.domain)).map((item) => {
        const isActive = item.id === selectedComponentId || runComponentIds(activeStep).includes(item.id);
        return `
          <g class="component-svg ${item.domain} ${item.state} ${isActive ? "selected" : ""} ${proposal && item.id === "boiler" ? "edited" : ""}" data-component="${item.id}" transform="translate(${item.x} ${item.y})">
            ${componentShape(item)}
            <text class="component-text" x="0" y="-22">${proposal && item.id === "boiler" ? "Replacement boiler" : item.label}</text>
          </g>
        `;
      }).join("")}
    </g>
  `;
}

function tightenPins(mode) {
  if (mode !== "tighten") return "";
  return `
    <g class="tighten-pins">
      ${state.reviewItems.filter((item) => !item.resolved).map((item, index) => {
        const point = reviewPoint(item, index);
        return `
          <g class="review-pin ${item.type}" transform="translate(${point.x} ${point.y})">
            <circle r="13"/>
            <text x="0" y="5">${index + 1}</text>
          </g>
        `;
      }).join("")}
    </g>
  `;
}

function cloneOverlay(proposal) {
  if (!proposal) return "";
  return `
    <g class="clone-overlay">
      <rect x="268" y="126" width="64" height="104" rx="7"/>
      <path d="M300 230V438H210"/>
      <text x="350" y="154">proposed boiler node</text>
      <text x="350" y="177">same wall-local XYZ</text>
    </g>
  `;
}

function runOverlay(step) {
  if (!step) return "";
  return `
    <g class="operation-overlay">
      <rect x="108" y="34" width="666" height="48" rx="14"/>
      <text x="132" y="64">${step.time} · ${step.title} · ${step.state}</text>
    </g>
  `;
}

function runComponentIds(step) {
  if (!step) return [];
  return {
    "heating-demand": ["controls", "boiler", "emitter"],
    boiler: ["boiler"],
    "primary-pipework": ["boiler", "emitter"],
    "emitter-response": ["emitter"]
  }[step.active] || [];
}

function reviewPoint(item, index) {
  const map = {
    "candidate-cylinder": { x: 300, y: 170 },
    "network-no-ont": { x: 604, y: 142 },
    "unknown-occupancy": { x: 286, y: 444 },
    "conflict-boiler-space": { x: 300, y: 170 }
  };
  return map[item.id] || { x: 150 + index * 52, y: 92 };
}

function componentShape(component) {
  if (component.id === "boiler") return `<rect class="component-body" x="-18" y="-28" width="36" height="56" rx="4"/><circle r="5"/>`;
  if (component.domain === "heating") return `<circle class="component-body" r="17"/><path d="M-8 0h16M0-8v16"/>`;
  if (component.domain === "water") return `<path class="component-body" d="M0-18C16 0 12 18 0 18C-12 18-16 0 0-18Z"/>`;
  if (component.domain === "electrical") return `<rect class="component-body" x="-15" y="-15" width="30" height="30" rx="4"/><path d="M-6 0h12M0-6v12"/>`;
  if (component.domain === "network") return `<rect class="component-body" x="-18" y="-12" width="36" height="24" rx="5"/><path d="M-10-2h20M-7 5h14"/>`;
  if (component.domain === "access") return `<path class="component-body" d="M-18 16H18V-16"/><path d="M-16 13C0 8 10-2 18-16"/>`;
  return `<circle class="component-body" r="16"/>`;
}

function componentInspector(component) {
  return `
    <aside class="instrument-panel">
      <p class="eyebrow">${component.domain} · ${component.state}</p>
      <h2>${component.label}</h2>
      <p>${component.summary}</p>
      <div class="component-meta">
        <span><b>Room</b>${roomFor(component.roomId).label}</span>
        <span><b>Confidence</b>${component.confidence}</span>
        <span><b>XYZ</b>${formatPosition(component.position)}</span>
        <span><b>Evidence</b>${component.evidence.length} refs</span>
      </div>
      <div class="evidence-chips">
        ${component.evidence.map((item) => `<span>${item}</span>`).join("")}
      </div>
      ${relationshipPanel(component)}
      <div class="inspector-actions">
        <a class="secondary" ${link("/tighten")}>Tighten related evidence</a>
        <button class="primary" data-action="create-what-if">Clone and edit</button>
      </div>
    </aside>
  `;
}

function relationshipPanel(component) {
  const routes = spatialFixture.routes.filter((route) => route.componentIds?.includes(component.id));
  if (!routes.length) {
    return `<div class="relationship-panel empty"><strong>No evidenced route yet</strong><p>This graph item is spatially located, but no route relationship is authoritative.</p></div>`;
  }
  return `
    <div class="relationship-panel">
      <strong>Graph relationships projected in place</strong>
      ${routes.map((route) => `<article class="${route.domain}"><span>${route.domain}</span><b>${route.label}</b><p>${route.evidenceState}</p></article>`).join("")}
    </div>
  `;
}

function reviewItem(item) {
  const point = reviewPoint(item, 0);
  return `
    <article class="ambiguity-card ${item.type} ${item.resolved ? "resolved" : ""}">
      <span>${item.resolved ? "resolved" : item.type}</span>
      <strong>${item.title}</strong>
      <p class="xyz-readout">XYZ ${point.x}, ${point.y}, 0.00 canvas · target ${item.id}</p>
      ${item.question ? `<h3>${item.question}</h3>` : ""}
      <p>${item.detail}</p>
      ${item.action ? `<em>${item.action}</em>` : ""}
      ${item.followUp ? `<q>${item.followUp}</q>` : ""}
      ${item.resolved ? "" : resolutionActions(item)}
    </article>
  `;
}

function resolutionActions(item) {
  const options = item.resolutions || [{ id: "resolve", label: "Resolve", result: "Resolved in sandbox review" }];
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

function consequenceList() {
  return `
    <div class="impact-chain compact-chain">
      ${state.consequences.map((item) => `
        <article class="${item.className}">
          <span>${item.title}</span>
          <strong>${item.current} -> ${item.proposed}</strong>
          <p>${item.result}</p>
        </article>
      `).join("")}
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

function formatPosition(position) {
  if (!position) return "not located";
  return `${position.x}, ${position.y}, ${position.z} ${position.unit}`;
}

function routeLabelPosition(route) {
  const numbers = route.d.match(/-?\d+/g)?.map(Number) || [360, 310];
  const xs = numbers.filter((_, index) => index % 2 === 0);
  const ys = numbers.filter((_, index) => index % 2 === 1);
  return {
    x: xs[Math.floor(xs.length / 2)] || 360,
    y: (ys[Math.floor(ys.length / 2)] || 310) - 18
  };
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
      <div class="thumbnail">${icon("capture")}</div>
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
    "/what-if": cloneView,
    "/run": runView,
    "/capture-demo": captureDemoView
  };
  app.innerHTML = (views[currentRoute()] || mainView)();
  app.classList.add("ready");
}

render();
