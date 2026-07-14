import { handoff, measurements, property, roomPlanSession, stockItems, tagGroups } from "./data.js";

const app = document.querySelector("#app");

const state = {
  tagPath: [],
  workspaceMode: "object",
  measurementTool: "Standing pressure"
};

const routes = [
  ["Command", "/command"],
  ["RoomPlan", "/roomplan"],
  ["Tools", "/tools"],
  ["Workspace", "/workspace"],
  ["Handoff", "/handoff"]
];

function currentRoute() {
  const hashRoute = window.location.hash.replace(/^#/, "");
  if (hashRoute === "/home") return "/command";
  return hashRoute.startsWith("/") ? hashRoute : "/command";
}

function link(route) {
  return `href="#${route}" data-route="${route}"`;
}

function icon(name) {
  const paths = {
    home: "M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3v-9.5Z",
    camera: "M4 7h4l1.4-2h5.2L16 7h4v12H4V7Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
    folder: "M3 6h7l2 2h9v10.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5V6Z",
    cloud: "M7 19h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.4 9.4 4.8 4.8 0 0 0 7 19Z",
    heat: "M13 3s2 2.2 0 5.4c-1.2 3 2.8 3.6 2.8 7A4.8 4.8 0 0 1 6.2 15c0-2.4 1.5-4 3.2-5.8C11 7.5 12 5.8 13 3Z",
    drop: "M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z",
    bolt: "m13 2-8 12h6l-1 8 8-12h-6l1-8Z",
    meter: "M4 14a8 8 0 1 1 16 0v6H4v-6Zm8-5v5l3-3",
    thermometer: "M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z",
    note: "M5 4h11l3 3v13H5V4Zm10 0v4h4",
    cube: "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5-8-4.5",
    ruler: "M4 17 17 4l3 3L7 20l-3-3Zm3-3 2 2m1-5 2 2m1-5 2 2",
    pin: "M12 22s6-6.2 6-12A6 6 0 0 0 6 10c0 5.8 6 12 6 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.home}"/></svg>`;
}

document.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) return;

  const tag = event.target.closest("[data-tag]");
  if (tag) {
    const value = tag.dataset.tag;
    const group = tag.dataset.group;
    state.tagPath = state.tagPath[0] === group && state.tagPath[1] === value ? [] : [group, value];
    render();
    return;
  }

  const workspace = event.target.closest("[data-workspace]");
  if (workspace) {
    state.workspaceMode = workspace.dataset.workspace;
    render();
    return;
  }

  const measurement = event.target.closest("[data-measurement]");
  if (measurement) {
    state.measurementTool = measurement.dataset.measurement;
    render();
  }
});

window.addEventListener("hashchange", render);

function shell(content) {
  const active = currentRoute();
  return `
    <main class="app">
      <header class="topbar">
        <div>
          <p class="eyebrow">Daedalus Capture v2</p>
          <h1>${activeTitle(active)}</h1>
        </div>
        <a class="pill" ${link("/handoff")}>Main handoff</a>
      </header>
      ${content}
      <nav class="tabbar">
        ${routes.map(([label, route]) => `
          <a ${link(route)} class="${active === route ? "active" : ""}">
            ${icon(route === "/command" ? "home" : route === "/roomplan" ? "camera" : route === "/handoff" ? "cloud" : route === "/workspace" ? "cube" : "folder")}
            <span>${label}</span>
          </a>
        `).join("")}
      </nav>
    </main>
  `;
}

function activeTitle(route) {
  return {
    "/command": "Capture Command",
    "/roomplan": "RoomPlan Session",
    "/tools": "External Measurements",
    "/workspace": "Workspace / ARKit",
    "/handoff": "Data Flow to Main"
  }[route] || "Capture Command";
}

function statusGrid() {
  return `
    <section class="status-grid">
      ${[
        ["RoomPlan", property.status],
        ["Evidence", "Local"],
        ["Last Sync", property.lastSync],
        ["Main", "Connected"]
      ].map(([label, value]) => `
        <article>
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `).join("")}
    </section>
  `;
}

function commandView() {
  return shell(`
    <section class="property-card">
      <div>
        <p class="eyebrow">Current Property</p>
        <h2>${property.name}</h2>
        <p>${property.address}</p>
      </div>
      <a class="primary" ${link("/roomplan")}>Start Capture</a>
    </section>
    ${statusGrid()}
    <section class="panel">
      <h2>RoomPlan Sessions</h2>
      <a class="session-row ready" ${link("/roomplan")}>
        <span>${icon("camera")}</span>
        <strong>RoomPlan Capture</strong>
        <em>Ready</em>
      </a>
      <a class="session-row purple" ${link("/tools")}>
        <span>${icon("ruler")}</span>
        <strong>External Measurement</strong>
        <em>After RoomPlan</em>
      </a>
      <a class="session-row amber" ${link("/workspace")}>
        <span>${icon("cube")}</span>
        <strong>Workspace / ARKit</strong>
        <em>Proposed Reality</em>
      </a>
    </section>
    <section class="panel">
      <h2>Data Flow to Main</h2>
      <div class="handoff-summary">
        <span>${icon("cloud")}</span>
        <div>
          <strong>Export for Main</strong>
          <p>${property.evidenceItems + property.proposedItems} artifacts ready: ${property.roomsCaptured} RoomPlan, ${property.proposedItems} proposed.</p>
        </div>
      </div>
      <a class="secondary" ${link("/handoff")}>Review Handoff Bundle</a>
    </section>
  `);
}

function capcom() {
  const tag = state.tagPath.length ? ` · ${state.tagPath.join(" / ")}` : "";
  return `<div class="capcom"><strong>CapCom</strong><span>Room 1 · Scanning${tag}</span><b>•••</b></div>`;
}

function tagRail(side) {
  const groups = side === "left" ? tagGroups.slice(0, 3) : tagGroups.slice(3);
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

function roomPlanView() {
  return shell(`
    <section class="capture-surface">
      ${capcom()}
      ${tagRail("left")}
      ${tagRail("right")}
      <div class="scan-lines"></div>
      <div class="readiness-ring"><span></span></div>
      <div class="thumbnail">${icon("camera")}</div>
      <div class="dollhouse"></div>
      <button class="shutter" aria-label="Capture evidence"></button>
      <button class="finish-room">Finish Room</button>
    </section>
    <section class="compact-strip">
      ${roomPlanSession.rooms.map((room, index) => `<span>${index + 1}. ${room}</span>`).join("")}
    </section>
  `);
}

function toolsView() {
  return shell(`
    <section class="tool-grid">
      ${measurements.map((group) => `
        <article class="tool-group ${group.accent}">
          <h2>${group.group} Measurements</h2>
          <div class="tool-list">
            ${group.tools.map((tool) => `
              <button class="${state.measurementTool === tool.name ? "active" : ""}" data-measurement="${tool.name}">
                <strong>${tool.name}</strong>
                <span>${tool.value} ${tool.unit}</span>
              </button>
            `).join("")}
          </div>
        </article>
      `).join("")}
    </section>
    ${measurementEditor()}
  `);
}

function measurementEditor() {
  const tool = measurements.flatMap((group) => group.tools).find((candidate) => candidate.name === state.measurementTool);
  return `
    <section class="instrument">
      <p class="eyebrow">Record Evidence</p>
      <h2>${tool.name}</h2>
      <div class="big-reading"><strong>${tool.value}</strong><span>${tool.unit}</span></div>
      <div class="field-chips">
        ${tool.fields.map((field) => `<span>${field}</span>`).join("")}
      </div>
      <button class="primary wide">Save Measurement</button>
    </section>
  `;
}

function workspaceView() {
  return shell(`
    <section class="workspace-surface">
      <div class="workspace-header">
        <div>
          <p class="eyebrow">Proposed Reality Session</p>
          <h2>${state.workspaceMode === "object" ? "Proposed boiler" : state.workspaceMode === "measure" ? "Measure" : "Available space"}</h2>
        </div>
        <span class="tracking">Tracking stable</span>
      </div>
      <div class="ar-canvas ${state.workspaceMode}">
        <div class="wall-plane"></div>
        ${state.workspaceMode === "object" ? objectOverlay() : state.workspaceMode === "measure" ? measureOverlay() : spaceOverlay()}
      </div>
      <div class="mode-switch">
        ${["space", "measure", "object"].map((mode) => `<button data-workspace="${mode}" class="${state.workspaceMode === mode ? "active" : ""}">${mode[0].toUpperCase() + mode.slice(1)}</button>`).join("")}
      </div>
      ${state.workspaceMode === "object" ? stockPanel() : workspaceAction()}
    </section>
  `);
}

function objectOverlay() {
  return `
    <div class="clearance-box"></div>
    <div class="appliance"></div>
    <span class="object-label">Greenstar Ri ErP+ 9-24</span>
  `;
}

function measureOverlay() {
  return `
    <div class="measure-line"><span>1.69 m</span></div>
    <i class="endpoint a"></i>
    <i class="endpoint b"></i>
  `;
}

function spaceOverlay() {
  return `
    <div class="space-rect">
      <span class="width">1.53 m</span>
      <span class="height">970 mm</span>
    </div>
  `;
}

function stockPanel() {
  const item = stockItems[0];
  return `
    <section class="stock-panel">
      <div>
        <p class="eyebrow">${item.type}</p>
        <h2>${item.make}</h2>
        <strong>${item.model}</strong>
        <p>${item.dimensions}</p>
        <p>${item.clearance}</p>
      </div>
      <button class="primary wide">Save Proposed Boiler</button>
    </section>
  `;
}

function workspaceAction() {
  return `<button class="primary wide">Save ${state.workspaceMode === "measure" ? "Measure" : "Space"}</button>`;
}

function handoffView() {
  return shell(`
    <section class="property-card">
      <div>
        <p class="eyebrow">Capture Package</p>
        <h2>${handoff.packageName}</h2>
        <p>Observed evidence and Proposed Reality remain separated for ${handoff.destination}.</p>
      </div>
      <button class="primary">Share Bundle</button>
    </section>
    <section class="panel">
      <h2>Inventory</h2>
      <div class="inventory">
        ${handoff.inventory.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </div>
    </section>
  `);
}

function render() {
  const route = currentRoute();
  const views = {
    "/command": commandView,
    "/roomplan": roomPlanView,
    "/tools": toolsView,
    "/workspace": workspaceView,
    "/handoff": handoffView
  };
  app.innerHTML = (views[route] || commandView)();
  app.classList.add("ready");
}

render();
