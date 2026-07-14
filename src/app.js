import { captureDemo, property, runModel, tightenItems, twinPages, whatIf } from "./data.js";

const app = document.querySelector("#app");

const state = {
  tagPath: [],
  zoom: "whole home",
  explain: "plain language"
};

const routes = [
  ["Tighten", "/tighten"],
  ["Twin", "/twin"],
  ["What If", "/what-if"],
  ["Run", "/run"],
  ["Capture Demo", "/capture-demo"]
];

function currentRoute() {
  const hashRoute = window.location.hash.replace(/^#/, "");
  if (["", "/home", "/main", "/command", "/reasoning", "/scenarios"].includes(hashRoute)) return "/twin";
  return hashRoute.startsWith("/") ? hashRoute : "/twin";
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
    note: "M5 4h11l3 3v13H5V4Zm10 0v4h4"
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.home}"/></svg>`;
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-route]")) return;

  const zoom = event.target.closest("[data-zoom]");
  if (zoom) {
    state.zoom = zoom.dataset.zoom;
    render();
    return;
  }

  const explain = event.target.closest("[data-explain]");
  if (explain) {
    state.explain = explain.dataset.explain;
    render();
    return;
  }

  const tag = event.target.closest("[data-tag]");
  if (tag) {
    state.tagPath = [tag.dataset.group, tag.dataset.tag];
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
      ${active !== "/capture-demo" ? globalControls() : ""}
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
    "/tighten": "Tighten Import",
    "/twin": "Living Twin",
    "/what-if": "What If...",
    "/run": "Run",
    "/capture-demo": "Capture Demo"
  }[route] || "Living Twin";
}

function globalControls() {
  return `
    <section class="control-strip">
      <div>
        <span>Zoom</span>
        ${["whole home", "system", "room", "component", "evidence"].map((level) => `
          <button class="${state.zoom === level ? "active" : ""}" data-zoom="${level}">${level}</button>
        `).join("")}
      </div>
      <div>
        <span>Explain</span>
        ${["plain language", "visual flow", "technical", "evidence trail"].map((mode) => `
          <button class="${state.explain === mode ? "active" : ""}" data-explain="${mode}">${mode}</button>
        `).join("")}
      </div>
    </section>
  `;
}

function tightenView() {
  return shell(`
    <section class="property-card main-hero">
      <div>
        <p class="eyebrow">Fresh Import Only</p>
        <h2>${property.name}</h2>
        <p>Tighten is temporary review. It promotes a fresh import into the authoritative twin by resolving weak, missing or conflicting evidence.</p>
      </div>
      <a class="primary" ${link("/twin")}>Promote Twin</a>
    </section>
    <section class="panel">
      <h2>Highlighted Notes</h2>
      <div class="tighten-list">
        ${tightenItems.map(([type, title, action]) => `
          <article>
            <span>${type}</span>
            <strong>${title}</strong>
            <p>${action}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `);
}

function twinView() {
  return shell(`
    <section class="twin-notebook">
      <div class="notebook-page overview-page">
        <p class="eyebrow">Authoritative Current State</p>
        <h2>${property.name}</h2>
        <p>The living twin is the product. It is readable as a technical notebook while retaining the graph underneath.</p>
        <div class="mini-map">
          <span class="room kitchen">Kitchen</span>
          <span class="room hall">Hall</span>
          <span class="room lounge">Lounge</span>
          <span class="room utility">Utility</span>
          <span class="system boiler">Boiler</span>
          <span class="system cylinder">Cylinder?</span>
        </div>
      </div>
      ${twinPages.map((page) => `
        <article class="notebook-page">
          <p class="eyebrow">${page.name} Twin</p>
          <h2>${page.name}</h2>
          <p>${page.summary}</p>
          <ul>${page.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>
        </article>
      `).join("")}
    </section>
  `);
}

function whatIfView() {
  return shell(`
    <section class="property-card main-hero proposed">
      <div>
        <p class="eyebrow">Cloned Proposed Twin</p>
        <h2>${whatIf.change}</h2>
        <p>The current twin remains authoritative. What If manipulates a proposed copy and makes causal consequences visible.</p>
      </div>
      <a class="primary" ${link("/run")}>Run Proposed Twin</a>
    </section>
    <section class="panel">
      <h2>Causal Consequences</h2>
      <div class="impact-chain">
        ${whatIf.affected.map(([type, title, text]) => `
          <article class="${type.toLowerCase().replaceAll(" ", "-")}">
            <span>${type}</span>
            <strong>${title}</strong>
            <p>${text}</p>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <h2>Scenario Shortcuts</h2>
      <p>Scenarios are entry points into What If, not a separate workspace.</p>
      <div class="shortcut-list">
        ${whatIf.shortcuts.map((shortcut) => `<button>${shortcut}</button>`).join("")}
      </div>
    </section>
  `);
}

function runView() {
  return shell(`
    <section class="run-board">
      <div class="flow-visual">
        <span class="source">Boiler</span>
        <span class="pipe one"></span>
        <span class="pipe two"></span>
        <span class="room-load kitchen">Kitchen slow</span>
        <span class="room-load hall">Hall satisfied</span>
        <span class="bottleneck">Bottleneck</span>
      </div>
      <aside class="twin-side">
        <p class="eyebrow">System Operation</p>
        <h2>What is it doing?</h2>
        <div class="timeline">
          ${runModel.map(([time, text]) => `<div><span>${time}</span><strong>${text}</strong></div>`).join("")}
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
    "/tighten": tightenView,
    "/twin": twinView,
    "/what-if": whatIfView,
    "/run": runView,
    "/capture-demo": captureDemoView
  };
  app.innerHTML = (views[currentRoute()] || twinView)();
  app.classList.add("ready");
}

render();
