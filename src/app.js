import { navItems, twin } from "./data.js";

const app = document.querySelector("#app");

function route() {
  const hashRoute = window.location.hash.replace(/^#/, "");
  return hashRoute.startsWith("/") ? hashRoute : "/landing";
}

function navigate(path) {
  window.location.hash = path;
  render();
}

window.addEventListener("hashchange", render);

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-link]");
  if (!target) return;
  event.preventDefault();
  navigate(target.dataset.route);
});

function link(path) {
  return `href="#${path}" data-route="${path}" data-link`;
}

function shell(content, options = {}) {
  const current = route();
  const showNav = options.nav !== false;
  return `
    <div class="app-shell">
      ${showNav ? `
        <aside class="sidebar">
          <a class="brand" ${link("/home")}>
            <span class="brand-mark"></span>
            <span>Daedalus</span>
          </a>
          <nav>
            ${navItems.map(([label, href]) => `
              <a ${link(href)} class="${current.startsWith(href) ? "active" : ""}">${label}</a>
            `).join("")}
          </nav>
          <div class="twin-chip">
            <strong>${twin.property.name}</strong>
            <span>${twin.property.evidence} linked observations</span>
          </div>
        </aside>
      ` : ""}
      <main class="page ${showNav ? "" : "full"}">${content}</main>
    </div>
  `;
}

const roomPins = [
  ["Kitchen", "kitchen", 612, 394],
  ["Utility", "utility", 405, 394],
  ["Loft", "loft", 508, 170],
  ["Bathroom", "bathroom", 652, 286],
  ["Hall", "hall", 345, 286]
];

function twinModel({ interactive = false, compact = false } = {}) {
  return `
    <div class="twin-model ${compact ? "compact" : ""}">
      <svg viewBox="0 0 980 660" role="img" aria-label="Visible Digital Twin model">
        <defs>
          <linearGradient id="roof" x1="0" x2="1">
            <stop offset="0" stop-color="#2a3640"/>
            <stop offset="1" stop-color="#526472"/>
          </linearGradient>
          <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/>
            <stop offset=".55" stop-color="#edf5f7" stop-opacity=".74"/>
            <stop offset="1" stop-color="#d8e5ea" stop-opacity=".82"/>
          </linearGradient>
          <filter id="modelShadow">
            <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#34424c" flood-opacity=".18"/>
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <ellipse cx="500" cy="584" rx="350" ry="42" fill="#7c8d94" opacity=".16"/>
        <path d="M176 278 L500 76 L824 278" fill="none" stroke="url(#roof)" stroke-width="5" stroke-linecap="round"/>
        <path d="M234 279 H762 V535 H234 Z" fill="url(#shell)" stroke="#23313a" stroke-width="2" filter="url(#modelShadow)"/>
        <path d="M234 404 H762 M336 279 V535 M500 170 V535 M655 279 V535" stroke="#738792" stroke-width="1.5" opacity=".66"/>
        <path class="room-zone kitchen-zone" d="M500 404 H762 V535 H500 Z"/>
        <path class="room-zone utility-zone" d="M336 404 H500 V535 H336 Z"/>
        <path class="room-zone hall-zone" d="M234 279 H500 V404 H234 Z"/>
        <path class="room-zone bath-zone" d="M500 279 H762 V404 H500 Z"/>
        <path class="room-zone loft-zone" d="M326 230 L500 122 L674 230 Z"/>
        <path class="heat-line" d="M414 477 C478 436 566 438 658 492"/>
        <path class="water-line" d="M414 459 C505 350 605 326 675 295"/>
        <path class="evidence-line" d="M308 330 C420 296 518 226 636 324"/>
        <circle class="node heat" cx="414" cy="477" r="9"/>
        <circle class="node water" cx="675" cy="295" r="9"/>
        <circle class="node evidence" cx="636" cy="324" r="9"/>
        <circle class="node evidence" cx="308" cy="330" r="7"/>
      </svg>
      ${roomPins.map(([label, slug, x, y]) => `
        <a class="model-label" ${interactive ? link(`/rooms/${slug}`) : ""} style="left:${x / 9.8}%;top:${y / 6.6}%">
          <span></span>${label}
        </a>
      `).join("")}
      <div class="model-legend">
        <span><i class="heat-dot"></i> Heating</span>
        <span><i class="water-dot"></i> Water</span>
        <span><i class="evidence-dot"></i> Evidence</span>
      </div>
    </div>
  `;
}

function twinCanvas(lens, options = {}) {
  return `
    <section class="canvas-screen ${options.dense ? "dense" : ""}">
      <div class="canvas-house">
        ${twinModel({ interactive: true, compact: options.compact })}
      </div>
      <div class="canvas-lens">
        ${lens}
      </div>
    </section>
  `;
}

function orbit(label, value, path) {
  return `<a class="orbit-card" ${link(path)}><span>${label}</span><strong>${value}</strong></a>`;
}

function landing() {
  return shell(`
    <section class="landing-experience">
      <div class="landing-copy">
        <span class="signal">Property created</span>
        <h1>${twin.property.name}</h1>
        <p>${twin.property.address}</p>
        <a class="primary-action" ${link("/home")}>Enter the Twin</a>
      </div>
      <div class="landing-model">
        ${twinModel()}
      </div>
    </section>
  `, { nav: false });
}

function home() {
  return shell(`
    <section class="home-stage">
      <div class="stage-title">
        <span class="signal">${twin.property.type}</span>
        <h1>Your home, assembled into a living model.</h1>
      </div>
      <div class="twin-stage">
        ${twinModel({ interactive: true })}
        <div class="orbit orbit-a">${orbit("Rooms", twin.property.rooms, "/explore")}</div>
        <div class="orbit orbit-b">${orbit("Evidence", twin.property.evidence, "/documents")}</div>
        <div class="orbit orbit-c">${orbit("Unknowns", "16", "/explore")}</div>
        <div class="orbit orbit-d">${orbit("Ask", "Twin", "/conversation")}</div>
      </div>
      <div class="home-ribbons">
        ${twin.discoveries.slice(0, 3).map((item, index) => `
          <a class="ribbon" ${link(index === 1 ? "/rooms/kitchen" : "/components/boiler")}>
            <span>Understood</span>
            <strong>${item.split(".")[0]}</strong>
          </a>
        `).join("")}
      </div>
    </section>
  `);
}

function explore() {
  return shell(`
    ${twinCanvas(`
      <div class="stage-title compact-title">
        <span class="signal">Explore lens</span>
        <h1>Tap the model, not a menu.</h1>
      </div>
      <div class="floorplan-shell compact-map">
        <svg class="floorplan" viewBox="0 0 900 610" role="img" aria-label="Interactive home map">
          <defs>
            <filter id="softFloor"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#27343c" flood-opacity=".14"/></filter>
          </defs>
          <path class="floor-base" d="M126 122 H750 L824 206 V500 H204 L126 416 Z" filter="url(#softFloor)"/>
          <a ${link("/rooms/loft")}><path class="zone zone-loft" d="M210 146 H562 L628 222 H286 Z"/></a>
          <a ${link("/rooms/hall")}><path class="zone zone-hall" d="M178 246 H414 V430 H178 Z"/></a>
          <a ${link("/rooms/utility")}><path class="zone zone-utility" d="M414 246 H574 V430 H414 Z"/></a>
          <a ${link("/rooms/kitchen")}><path class="zone zone-kitchen" d="M574 246 H782 V500 H574 Z"/></a>
          <a ${link("/rooms/bathroom")}><path class="zone zone-bath" d="M414 430 H574 V500 H414 Z"/></a>
          <path class="flow heat-line" d="M490 338 C560 306 656 324 716 418"/>
          <path class="flow water-line" d="M500 356 C566 420 613 462 706 462"/>
          <path class="flow evidence-line" d="M280 333 C380 224 510 196 664 258"/>
          <a ${link("/components/boiler")}><circle class="map-marker heat" cx="492" cy="340" r="15"/></a>
          <a ${link("/components/radiator")}><circle class="map-marker heat" cx="710" cy="420" r="13"/></a>
          <circle class="map-marker water" cx="706" cy="462" r="12"/>
          <circle class="map-marker evidence" cx="664" cy="258" r="12"/>
          <text x="650" y="372">Kitchen</text><text x="454" y="334">Utility</text><text x="256" y="334">Hall</text><text x="444" y="474">Bath</text><text x="360" y="195">Loft</text>
        </svg>
        <div class="map-dock">
          <a ${link("/components/boiler")}><span class="heat-dot"></span>Boiler</a>
          <a ${link("/understanding/hot-water")}><span class="water-dot"></span>Hot water path</a>
          <a ${link("/documents")}><span class="evidence-dot"></span>Evidence layer</a>
        </div>
      </div>
    `, { compact: true })}
  `);
}

function room(slug) {
  const room = twin.rooms.find((item) => item.slug === slug) || twin.rooms[0];
  return shell(`
    ${twinCanvas(`
      <div class="stage-title compact-title">
        <a class="back-link" ${link("/explore")}>Explore</a>
        <span class="signal">Selected room</span>
        <h1>${room.name}</h1>
      </div>
      <div class="room-grid">
        <div class="room-map-card">
          ${roomSketch(room.slug)}
        </div>
        <div class="room-stack">
          <div class="metric-strip">
            <span><strong>${room.confidence}%</strong> confidence</span>
            <span><strong>${room.evidence}</strong> evidence</span>
            <span><strong>${room.unknowns}</strong> unknowns</span>
          </div>
          <div class="component-rail">
            ${room.components.map(component => {
              const path = component.toLowerCase().includes("boiler") ? "/components/boiler" : component.toLowerCase().includes("radiator") ? "/components/radiator" : "/explore";
              return `<a ${link(path)}><i></i>${component}</a>`;
            }).join("")}
          </div>
          <p class="short-note">${room.insight}</p>
        </div>
      </div>
    `, { compact: true, dense: true })}
  `);
}

function roomSketch(slug) {
  return `
    <svg class="room-sketch" viewBox="0 0 620 420" role="img">
      <path class="room-plane" d="M96 92 H470 L540 166 V338 H166 L96 266 Z"/>
      <path class="room-grid-line" d="M166 338 V166 L96 92 M166 166 H540 M338 92 V338"/>
      <path class="heat-line" d="M178 292 C260 235 376 248 478 304"/>
      <path class="water-line" d="M218 248 C320 182 420 176 500 220"/>
      <circle class="node heat" cx="${slug === "kitchen" ? 474 : 250}" cy="${slug === "kitchen" ? 303 : 247}" r="12"/>
      <circle class="node evidence" cx="382" cy="180" r="10"/>
      <circle class="node water" cx="504" cy="220" r="10"/>
    </svg>
  `;
}

function component(slug) {
  const item = twin.components[slug] || twin.components.boiler;
  return shell(`
    ${twinCanvas(`
      <div class="stage-title compact-title">
        <a class="back-link" ${link("/explore")}>Explore</a>
        <span class="signal">Selected thing</span>
        <h1>${item.name}</h1>
      </div>
      <div class="component-grid">
        <div class="object-panel">
          ${componentObject(item.slug)}
          <div class="object-caption">
            <strong>${item.identity}</strong>
            <span>${item.location}</span>
          </div>
        </div>
        <div class="relation-panel">
          <h2>Connected to</h2>
          ${relationshipMap(item)}
        </div>
        <div class="evidence-panel">
          <h2>Evidence</h2>
          <div class="thumb-grid">
            ${item.evidence.map((evidence, index) => `<div class="thumb"><span>${index + 1}</span><p>${evidence.split(".")[0]}</p></div>`).join("")}
          </div>
        </div>
      </div>
    `, { compact: true, dense: true })}
  `);
}

function componentObject(slug) {
  const isBoiler = slug === "boiler";
  return `
    <svg class="object-svg" viewBox="0 0 520 430" role="img">
      <ellipse cx="260" cy="372" rx="156" ry="22" fill="#6f8088" opacity=".14"/>
      ${isBoiler ? `
        <rect x="162" y="72" width="196" height="250" rx="24" fill="#f8fbfc" stroke="#25343d" stroke-width="2"/>
        <rect x="188" y="112" width="144" height="54" rx="10" fill="#dfeaec"/>
        <circle cx="220" cy="220" r="28" fill="#edf5f7" stroke="#51636e"/>
        <path class="heat-line" d="M210 330 V386 M260 330 V386 M310 330 V386"/>
        <path class="water-line" d="M358 194 C416 212 430 258 380 294"/>
      ` : `
        <rect x="124" y="154" width="272" height="122" rx="24" fill="#f8fbfc" stroke="#25343d" stroke-width="2"/>
        <path d="M156 170 V260 M198 170 V260 M240 170 V260 M282 170 V260 M324 170 V260 M366 170 V260" stroke="#7b8d95" stroke-width="5" stroke-linecap="round"/>
        <path class="heat-line" d="M110 294 C210 348 312 348 412 294"/>
      `}
      <circle class="node evidence" cx="374" cy="112" r="10"/>
      <circle class="node heat" cx="184" cy="334" r="10"/>
    </svg>
  `;
}

function relationshipMap(item) {
  return `
    <svg class="relationship-map" viewBox="0 0 560 320" role="img">
      <circle class="rel-core" cx="280" cy="160" r="58"/>
      <text x="280" y="166" text-anchor="middle">${item.name}</text>
      ${item.relationships.map((rel, index) => {
        const points = [[108,76], [452,76], [100,244], [460,244]];
        const [x, y] = points[index % points.length];
        return `
          <path class="rel-line" d="M280 160 L${x} ${y}"/>
          <circle class="rel-node" cx="${x}" cy="${y}" r="42"/>
          <text x="${x}" y="${y + 4}" text-anchor="middle">${rel}</text>
        `;
      }).join("")}
    </svg>
  `;
}

const diagramTypes = ["cycle", "water", "heat", "layers", "air", "fabric", "pipe", "pressure"];

function understanding(slug) {
  const selected = slug ? twin.understanding.find((item) => item.slug === slug) : twin.understanding[0];
  return shell(`
    ${twinCanvas(`
      <div class="stage-title compact-title">
        <span class="signal">Relationship lens</span>
        <h1>${selected.title}</h1>
      </div>
      <div class="explanation-grid">
        ${twin.understanding.map((item, index) => `
          <a class="explain-card ${selected.slug === item.slug ? "selected" : ""}" ${link(`/understanding/${item.slug}`)}>
            ${miniDiagram(diagramTypes[index])}
            <strong>${item.title}</strong>
            <span>${item.body.split(".")[0]}</span>
          </a>
        `).join("")}
      </div>
    `, { compact: true })}
  `);
}

function miniDiagram(type) {
  const diagrams = {
    cycle: `<circle class="node heat" cx="90" cy="70" r="16"/><path class="heat-line" d="M90 70 C140 24 206 42 220 104 C174 146 118 132 90 70"/>`,
    water: `<path class="water-line" d="M54 130 C120 48 196 58 254 92"/><circle class="node water" cx="54" cy="130" r="12"/><circle class="node water" cx="254" cy="92" r="12"/>`,
    heat: `<path class="heat-line" d="M48 122 C110 76 186 76 250 122"/><path class="evidence-line" d="M64 154 H238"/>`,
    layers: `<path class="zone zone-loft" d="M54 70 H250 V104 H54 Z"/><path class="zone zone-hall" d="M54 116 H250 V150 H54 Z"/><path class="heat-line" d="M76 166 C116 124 188 118 228 84"/>`,
    air: `<path class="evidence-line" d="M54 100 C100 54 152 142 204 88 C226 66 244 70 260 84"/><circle class="node evidence" cx="204" cy="88" r="10"/>`,
    fabric: `<path class="room-plane" d="M62 62 H238 L260 92 V170 H84 L62 142 Z"/><path class="water-line" d="M84 142 H260"/>`,
    pipe: `<path class="water-line" d="M52 152 C102 80 190 80 250 134"/><path class="heat-line" d="M70 178 C130 132 188 134 238 172"/>`,
    pressure: `<path class="water-line" d="M60 170 V72 H240"/><circle class="node water" cx="60" cy="170" r="12"/><circle class="node evidence" cx="240" cy="72" r="12"/>`
  };
  return `<svg class="mini-diagram" viewBox="0 0 310 210" role="img">${diagrams[type]}</svg>`;
}

function conversation() {
  return shell(`
    <section class="conversation-stage">
      <div class="context-model">
        ${twinModel({ interactive: true, compact: true })}
        <div class="context-chips">
          <span>Kitchen</span><span>Rear extension</span><span>Radiator evidence</span>
        </div>
      </div>
      <div class="chat-panel">
        <div class="stage-title compact-title">
          <span class="signal">Conversation</span>
          <h1>Ask the Twin.</h1>
        </div>
        ${twin.conversation.map((turn) => `
          <div class="chat-turn">
            <div class="bubble user">${turn.question}</div>
            <div class="bubble twin">${turn.answer.split(".").slice(0, 2).join(".")}.</div>
            <div class="evidence-chips"><span>survey note</span><span>photo</span><span>room link</span></div>
          </div>
        `).join("")}
        <form class="composer">
          <input aria-label="Message" placeholder="Ask about a room or pattern..." />
          <button type="button">Ask</button>
        </form>
      </div>
    </section>
  `);
}

function timeline() {
  return shell(`
    ${twinCanvas(`
      <div class="stage-title compact-title">
        <span class="signal">Time lens</span>
        <h1>Changes appear on the same house.</h1>
      </div>
      <div class="time-river">
        ${twin.timeline.map((event, index) => `
          <article class="time-node type-${index % 3}">
            <span>${event.year}</span>
            <strong>${event.title}</strong>
            <i>${index % 3 === 0 ? "fabric" : index % 3 === 1 ? "evidence" : "twin"}</i>
          </article>
        `).join("")}
      </div>
    `, { compact: true })}
  `);
}

function documents() {
  return shell(`
    ${twinCanvas(`
      <div class="stage-title compact-title">
        <span class="signal">Evidence library</span>
        <h1>Every file lands on the model.</h1>
      </div>
      <div class="evidence-wall">
        ${twin.documents.map((doc, index) => `
          <article class="evidence-tile type-${index % 4}">
            <div class="tile-preview">
              <span>${doc.type}</span>
              ${evidenceIcon(index)}
            </div>
            <strong>${doc.title}</strong>
            <small>${index % 2 === 0 ? "Linked to Utility" : "Linked to Kitchen"}</small>
          </article>
        `).join("")}
      </div>
    `, { compact: true })}
  `);
}

function evidenceIcon(index) {
  const icons = [
    `<path d="M54 138 H174 V64 H54 Z M74 88 H154 M74 112 H134" />`,
    `<rect x="58" y="58" width="112" height="92" rx="10"/><circle cx="90" cy="92" r="16"/><path d="M68 140 L112 112 L158 140"/>`,
    `<path d="M58 152 V54 H164 V152 Z M78 80 H144 M78 106 H144 M78 132 H122"/>`,
    `<path d="M58 144 L108 58 L164 144 Z M108 92 V120 M108 134 V136"/>`
  ];
  return `<svg viewBox="0 0 220 190" role="img">${icons[index % icons.length]}</svg>`;
}

function notFound() {
  return shell(`
    <section class="home-stage">
      <div class="stage-title">
        <span class="signal">Prototype route</span>
        <h1>This part of the Twin is still forming.</h1>
        <a class="primary-action" ${link("/home")}>Return home</a>
      </div>
      ${twinModel({ interactive: true })}
    </section>
  `);
}

function viewFor(path) {
  if (path === "/landing") return landing();
  if (path === "/home") return home();
  if (path === "/explore") return explore();
  if (path.startsWith("/rooms/")) return room(path.split("/").pop());
  if (path.startsWith("/components/")) return component(path.split("/").pop());
  if (path === "/understanding") return understanding();
  if (path.startsWith("/understanding/")) return understanding(path.split("/").pop());
  if (path === "/conversation") return conversation();
  if (path === "/timeline") return timeline();
  if (path === "/documents") return documents();
  return notFound();
}

function render() {
  app.classList.remove("ready");
  app.innerHTML = viewFor(route());
  requestAnimationFrame(() => app.classList.add("ready"));
}

render();
