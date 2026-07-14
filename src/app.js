import { captureDemo, handoff, mainModel, measurements, property } from "./data.js";

const app = document.querySelector("#app");

const state = {
  tagPath: [],
  workspaceMode: "object",
  measurementTool: "Standing pressure"
};

const routes = [
  ["Main", "/main"],
  ["Twin", "/twin"],
  ["Reason", "/reasoning"],
  ["Scenarios", "/scenarios"],
  ["Capture Demo", "/capture-demo"]
];

function currentRoute() {
  const hashRoute = window.location.hash.replace(/^#/, "");
  if (hashRoute === "/home" || hashRoute === "/command" || hashRoute === "") return "/main";
  return hashRoute.startsWith("/") ? hashRoute : "/main";
}

function link(route) {
  return `href="#${route}" data-route="${route}"`;
}

function icon(name) {
  const paths = {
    home: "M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3v-9.5Z",
    camera: "M4 7h4l1.4-2h5.2L16 7h4v12H4V7Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
    brain: "M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 5 2.2V4.8A3 3 0 0 0 9 4Zm6 0a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-5 2.2V4.8A3 3 0 0 1 15 4Z",
    branch: "M6 4v6a4 4 0 0 0 4 4h8M6 10h8a4 4 0 0 1 4 4v6M6 20v-6a4 4 0 0 1 4-4h8",
    cloud: "M7 19h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.4 9.4 4.8 4.8 0 0 0 7 19Z",
    heat: "M13 3s2 2.2 0 5.4c-1.2 3 2.8 3.6 2.8 7A4.8 4.8 0 0 1 6.2 15c0-2.4 1.5-4 3.2-5.8C11 7.5 12 5.8 13 3Z",
    drop: "M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z",
    bolt: "m13 2-8 12h6l-1 8 8-12h-6l1-8Z",
    meter: "M4 14a8 8 0 1 1 16 0v6H4v-6Zm8-5v5l3-3",
    thermometer: "M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z",
    note: "M5 4h11l3 3v13H5V4Zm10 0v4h4",
    cube: "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5-8-4.5",
    ruler: "M4 17 17 4l3 3L7 20l-3-3Zm3-3 2 2m1-5 2 2m1-5 2 2"
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.home}"/></svg>`;
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-route]")) return;

  const tag = event.target.closest("[data-tag]");
  if (tag) {
    state.tagPath = [tag.dataset.group, tag.dataset.tag];
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
          <p class="eyebrow">${active === "/capture-demo" ? "Capture demo lens" : "Daedalus Main proof of concept"}</p>
          <h1>${titleFor(active)}</h1>
        </div>
        <a class="pill" ${link("/capture-demo")}>Capture demo</a>
      </header>
      ${content}
      <nav class="tabbar">
        ${routes.map(([label, route]) => `
          <a ${link(route)} class="${active === route ? "active" : ""}">
            ${icon(route === "/main" ? "home" : route === "/twin" ? "cube" : route === "/reasoning" ? "brain" : route === "/scenarios" ? "branch" : "camera")}
            <span>${label}</span>
          </a>
        `).join("")}
      </nav>
    </main>
  `;
}

function titleFor(route) {
  return {
    "/main": "Property Intelligence",
    "/twin": "Evidence Twin",
    "/reasoning": "Main Reasoning",
    "/scenarios": "Scenario Lens",
    "/capture-demo": "Capture Demo"
  }[route] || "Property Intelligence";
}

function mainView() {
  return shell(`
    <section class="property-card main-hero">
      <div>
        <p class="eyebrow">Selected Property</p>
        <h2>${property.name}</h2>
        <p>${property.address}</p>
        <p>${mainModel.summary}</p>
      </div>
      <a class="primary" ${link("/twin")}>Open Twin</a>
    </section>
    <section class="status-grid">
      ${[
        ["Capture", property.status],
        ["Evidence", `${property.evidenceItems} items`],
        ["Proposed", `${property.proposedItems} items`],
        ["Unknowns", `${property.unknowns} open`]
      ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("")}
    </section>
    <section class="panel command-grid">
      <h2>Commands</h2>
      ${mainModel.commands.map((command) => `
        <article class="command-card">
          <strong>${command.name}</strong>
          <em>${command.state}</em>
          <p>${command.text}</p>
        </article>
      `).join("")}
    </section>
  `);
}

function twinView() {
  return shell(`
    <section class="twin-board">
      <div class="floorplan">
        <span class="room kitchen">Kitchen</span>
        <span class="room hall">Hall</span>
        <span class="room lounge">Lounge</span>
        <span class="room utility">Utility</span>
        <span class="system boiler">Boiler</span>
        <span class="system cylinder">Cylinder?</span>
        <span class="evidence-dot one"></span>
        <span class="evidence-dot two"></span>
        <span class="evidence-dot three"></span>
      </div>
      <aside class="twin-side">
        <p class="eyebrow">Provenance-first</p>
        <h2>Capture Package Imported</h2>
        <p>Main can display candidate and unresolved evidence, but may reason only from confirmed evidence.</p>
        <div class="inventory">
          ${handoff.inventory.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
        </div>
      </aside>
    </section>
  `);
}

function reasoningView() {
  return shell(`
    <section class="panel">
      <h2>Evidence Status</h2>
      <div class="fact-list">
        ${mainModel.facts.map(([type, text]) => `<div class="${type.toLowerCase()}"><span>${type}</span><strong>${text}</strong></div>`).join("")}
      </div>
    </section>
    <section class="panel">
      <h2>Questions Main Can Answer</h2>
      <div class="question-list">
        ${mainModel.questions.map((question) => `<button>${question}</button>`).join("")}
      </div>
    </section>
  `);
}

function scenariosView() {
  return shell(`
    <section class="panel">
      <h2>Scenario Lens</h2>
      <p>Scenarios are explanations over evidence. They are not recommendations and they do not mutate captured evidence.</p>
      <div class="scenario-list">
        ${mainModel.scenarios.map(([name, text]) => `<article><strong>${name}</strong><p>${text}</p></article>`).join("")}
      </div>
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
    "/twin": twinView,
    "/reasoning": reasoningView,
    "/scenarios": scenariosView,
    "/capture-demo": captureDemoView
  };
  app.innerHTML = (views[currentRoute()] || mainView)();
  app.classList.add("ready");
}

render();
