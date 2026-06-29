import { captureReview, heatPumpProjection, navItems, twin } from "./data.js";

const app = document.querySelector("#app");

const layers = [
  {
    id: "house",
    label: "House",
    route: "/explore",
    summary: "Physical reality: rooms, structure, insulation, orientation, fabric."
  },
  {
    id: "systems",
    label: "Systems",
    route: "/components/boiler",
    summary: "Functional reality: heating, hot water, ventilation, electrical, water."
  },
  {
    id: "home",
    label: "Home",
    route: "/understanding",
    summary: "Lived reality: people, routines, comfort needs, priorities, plans."
  }
];

const manifestoPrinciples = [
  ["Capture", "Seen, not solved"],
  ["Main", "Assembles understanding"],
  ["Daedalus", "Explains reality"]
];

const roomPins = [
  ["Kitchen", "kitchen", 69, 64],
  ["Utility", "utility", 43, 65],
  ["Loft", "loft", 50, 28],
  ["Bathroom", "bathroom", 70, 45],
  ["Hall", "hall", 32, 46]
];

const projectionState = {
  flowTemperature: 55,
  selectedRoom: "kitchen",
  tilt: false,
  zoom: 1,
  layers: {
    rooms: true,
    services: true,
    evidence: false
  }
};

const captureState = {
  selectedObject: "cylinder",
  tilt: false,
  zoom: 1,
  layers: {
    objects: true,
    services: true,
    evidence: true
  },
  statuses: {}
};

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
  const preset = event.target.closest("[data-flow-preset]");
  if (preset) {
    projectionState.flowTemperature = Number(preset.dataset.flowPreset);
    render();
    return;
  }

  const projectionRoom = event.target.closest("[data-projection-room]");
  if (projectionRoom) {
    projectionState.selectedRoom = projectionRoom.dataset.projectionRoom;
    render();
    return;
  }

  const tiltMode = event.target.closest("[data-spatial-tilt]");
  if (tiltMode) {
    const targetState = route() === "/capture-review" ? captureState : projectionState;
    targetState.tilt = !targetState.tilt;
    render();
    return;
  }

  const zoomControl = event.target.closest("[data-spatial-zoom]");
  if (zoomControl) {
    const targetState = route() === "/capture-review" ? captureState : projectionState;
    const direction = Number(zoomControl.dataset.spatialZoom);
    targetState.zoom = Math.max(0.82, Math.min(1.34, targetState.zoom + direction * 0.12));
    render();
    return;
  }

  const layerControl = event.target.closest("[data-spatial-layer]");
  if (layerControl) {
    const targetState = route() === "/capture-review" ? captureState : projectionState;
    const layer = layerControl.dataset.spatialLayer;
    targetState.layers[layer] = !targetState.layers[layer];
    render();
    return;
  }

  const reviewObject = event.target.closest("[data-review-object]");
  if (reviewObject) {
    captureState.selectedObject = reviewObject.dataset.reviewObject;
    render();
    return;
  }

  const reviewAction = event.target.closest("[data-review-action]");
  if (reviewAction) {
    captureState.statuses[captureState.selectedObject] = reviewAction.dataset.reviewAction;
    render();
    return;
  }

  const target = event.target.closest("[data-link]");
  if (!target) return;
  event.preventDefault();
  navigate(target.dataset.route);
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-flow-slider]")) {
    projectionState.flowTemperature = Number(event.target.value);
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const projectionRoom = event.target.closest("[data-projection-room]");
  const reviewObject = event.target.closest("[data-review-object]");
  if (!projectionRoom && !reviewObject) return;
  event.preventDefault();
  if (projectionRoom) projectionState.selectedRoom = projectionRoom.dataset.projectionRoom;
  if (reviewObject) captureState.selectedObject = reviewObject.dataset.reviewObject;
  render();
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
          <a class="brand" ${link("/home")}><span class="brand-mark"></span><span>Daedalus</span></a>
          <nav>
            ${navItems.map(([label, href]) => `<a ${link(href)} class="${current.startsWith(href) ? "active" : ""}">${label}</a>`).join("")}
          </nav>
          <div class="sidebar-model">
            <strong>House + Systems + Home</strong>
            <span>${twin.property.evidence} observations connected</span>
          </div>
        </aside>
      ` : ""}
      <main class="page ${showNav ? "" : "full"} ${options.flush ? "flush" : ""}">${content}</main>
    </div>
  `;
}

function twinModel({ focus = "all", interactive = true, compact = false } = {}) {
  const showHouse = focus === "all" || focus === "house";
  const showSystems = focus === "all" || focus === "systems";
  const showHome = focus === "all" || focus === "home";
  return `
    <div class="twin-model ${compact ? "compact" : ""} focus-${focus}">
      <svg viewBox="0 0 980 660" role="img" aria-label="Digital Twin: House, Systems, Home">
        <defs>
          <linearGradient id="shellGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff" stop-opacity=".92"/>
            <stop offset="1" stop-color="#dce9ed" stop-opacity=".82"/>
          </linearGradient>
          <filter id="softShadow"><feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#293844" flood-opacity=".16"/></filter>
          <filter id="softGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        <ellipse cx="500" cy="586" rx="350" ry="42" fill="#72848c" opacity=".16"/>

        <g class="layer house-layer ${showHouse ? "is-on" : "is-dim"}">
          <path d="M174 280 L500 78 L826 280" fill="none" stroke="#22313a" stroke-width="5" stroke-linecap="round"/>
          <path d="M232 280 H764 V536 H232 Z" fill="url(#shellGrad)" stroke="#22313a" stroke-width="2" filter="url(#softShadow)"/>
          <path d="M232 406 H764 M338 280 V536 M500 172 V536 M656 280 V536" stroke="#7b8b93" stroke-width="1.5" opacity=".64"/>
          <path class="zone zone-kitchen" d="M500 406 H764 V536 H500 Z"/>
          <path class="zone zone-utility" d="M338 406 H500 V536 H338 Z"/>
          <path class="zone zone-hall" d="M232 280 H500 V406 H232 Z"/>
          <path class="zone zone-bath" d="M500 280 H764 V406 H500 Z"/>
          <path class="zone zone-loft" d="M326 230 L500 124 L674 230 Z"/>
          <path class="fabric-line" d="M246 292 H748 M246 520 H748 M352 292 V520 M640 292 V520"/>
          <path class="orientation" d="M142 472 L188 426 L234 472 M188 426 V536"/>
        </g>

        <g class="layer systems-layer ${showSystems ? "is-on" : "is-dim"}">
          <path class="heat-line" d="M414 474 C470 430 574 436 662 492"/>
          <path class="heat-line thin" d="M414 474 C440 382 502 344 602 340"/>
          <path class="water-line" d="M414 456 C508 350 610 320 690 296"/>
          <path class="air-line" d="M640 212 C710 240 730 322 684 386"/>
          <path class="electric-line" d="M282 344 C388 282 522 260 688 330"/>
          <circle class="system-node heat" cx="414" cy="474" r="11"/>
          <circle class="system-node heat" cx="662" cy="492" r="10"/>
          <circle class="system-node water" cx="690" cy="296" r="10"/>
          <circle class="system-node air" cx="684" cy="386" r="10"/>
          <circle class="system-node electric" cx="282" cy="344" r="10"/>
        </g>

        <g class="layer home-layer ${showHome ? "is-on" : "is-dim"}">
          <path class="routine-line" d="M302 348 C360 286 462 294 516 366 C574 444 646 432 708 388"/>
          <circle class="person-node" cx="302" cy="348" r="17"/>
          <circle class="person-node child" cx="708" cy="388" r="15"/>
          <circle class="comfort-node" cx="642" cy="498" r="15"/>
          <circle class="future-node" cx="514" cy="214" r="14"/>
          <path class="context-link" d="M302 348 L414 474 M708 388 L662 492 M514 214 L640 212"/>
        </g>

        <g class="layer interaction-layer ${focus === "all" ? "is-on" : "is-dim"}">
          <path class="because-line" d="M514 214 C556 300 610 386 642 498"/>
          <path class="because-line" d="M302 348 C380 414 478 460 662 492"/>
        </g>
      </svg>

      ${roomPins.map(([label, slug, left, top]) => `
        <a class="model-label ${focus === "home" ? "soft" : ""}" ${interactive ? link(`/rooms/${slug}`) : ""} style="left:${left}%;top:${top}%">
          <span></span>${label}
        </a>
      `).join("")}

      <div class="layer-switcher">
        ${layers.map((layer) => `<a ${link(layer.route)} class="${focus === layer.id ? "active" : ""}"><i class="${layer.id}-dot"></i>${layer.label}</a>`).join("")}
      </div>
    </div>
  `;
}

function lensLayout(focus, content, options = {}) {
  return `
    <section class="lens-layout ${options.wide ? "wide" : ""}">
      <div class="persistent-twin">${twinModel({ focus, compact: true })}</div>
      <div class="lens-panel">${content}</div>
    </section>
  `;
}

function layerCard(layer) {
  return `
    <a class="layer-card ${layer.id}" ${link(layer.route)}>
      <div class="layer-orb"><i></i></div>
      <strong>${layer.label}</strong>
      <span>${layer.summary}</span>
    </a>
  `;
}

function landing() {
  return shell(`
    <section class="opening">
      <div class="opening-copy">
        <span class="signal">Reality First</span>
        <h1>Your home is made of three things.</h1>
        <p>Daedalus is a Digital Twin designed to understand the House, the Systems and the Home together.</p>
      </div>
      <div class="three-layer-stage">
        <div class="layer-stack">
          ${layers.map(layerCard).join("")}
          <svg class="layer-links" viewBox="0 0 900 420" aria-hidden="true">
            <path d="M250 126 C402 40 520 40 664 126"/>
            <path d="M250 294 C402 380 520 380 664 294"/>
            <path d="M226 160 C164 214 164 250 226 284"/>
            <path d="M690 160 C752 214 752 250 690 284"/>
          </svg>
        </div>
      </div>
      <div class="manifesto-band">
        ${manifestoPrinciples.map(([label, value]) => `<span><strong>${label}</strong>${value}</span>`).join("")}
      </div>
      <a class="primary-action" ${link("/home")}>Enter the model</a>
    </section>
  `, { nav: false });
}

function home() {
  return shell(`
    <section class="home-canvas">
      <div class="canvas-title">
        <span class="signal">The Digital Twin owns the truth</span>
        <h1>House, Systems and Home interacting.</h1>
      </div>
      <div class="hero-twin">
        ${twinModel({ focus: "all" })}
        <div class="interaction-callout callout-a"><span>House</span><strong>Bedroom layout + loft fabric</strong></div>
        <div class="interaction-callout callout-b"><span>Systems</span><strong>Radiators + controls + hot water</strong></div>
        <div class="interaction-callout callout-c"><span>Home</span><strong>Sleep routines + comfort needs</strong></div>
      </div>
      <div class="scenario-strip">
        <a ${link("/understanding/upstairs")}><span>Observe reality</span><strong>Unknowns remain visible until evidence changes them.</strong></a>
        <a ${link("/components/boiler")}><span>Model reality</span><strong>If boiler output changed, Daedalus shows what would be affected.</strong></a>
        <a ${link("/heat-pump-projection")}><span>Spatial projection</span><strong>Adjust the plan and watch rooms, emitters and pipework respond.</strong></a>
        <a ${link("/capture-review")}><span>Capture review</span><strong>Proofread the property by checking objects on the spatial Twin.</strong></a>
        <a ${link("/conversation")}><span>Explain reality</span><strong>Answers stay tied to the same Digital Twin.</strong></a>
      </div>
    </section>
  `);
}

function explore() {
  return shell(lensLayout("house", `
    <div class="lens-title">
      <span class="signal">House layer</span>
      <h1>The physical building.</h1>
    </div>
    <div class="house-map">
      <svg viewBox="0 0 720 520" role="img" aria-label="House layer map">
        <path class="plan-shell" d="M82 94 H548 L642 188 V438 H176 L82 344 Z"/>
        <a ${link("/rooms/loft")}><path class="zone zone-loft" d="M176 120 H462 L526 184 H240 Z"/></a>
        <a ${link("/rooms/hall")}><path class="zone zone-hall" d="M140 218 H316 V390 H140 Z"/></a>
        <a ${link("/rooms/utility")}><path class="zone zone-utility" d="M316 218 H438 V390 H316 Z"/></a>
        <a ${link("/rooms/kitchen")}><path class="zone zone-kitchen" d="M438 218 H604 V438 H438 Z"/></a>
        <a ${link("/rooms/bathroom")}><path class="zone zone-bath" d="M316 390 H438 V438 H316 Z"/></a>
        <path class="fabric-line" d="M124 184 H560 M124 438 H604 M604 220 V438"/>
        <circle class="window-node" cx="594" cy="286" r="12"/>
        <circle class="window-node" cx="516" cy="436" r="12"/>
        <circle class="insulation-node" cx="348" cy="150" r="12"/>
        <text x="470" y="330">Kitchen</text><text x="335" y="312">Utility</text><text x="178" y="312">Hall</text><text x="328" y="424">Bath</text><text x="276" y="158">Loft</text>
      </svg>
    </div>
    <div class="visual-chips">
      <span>Rooms</span><span>Fabric</span><span>Insulation</span><span>Windows</span><span>Orientation</span><a ${link("/heat-pump-projection")}>Heat pump projection</a><a ${link("/capture-review")}>Capture review</a>
    </div>
  `));
}

function radiatorOutputAt(room, flowTemperature) {
  const factor = 0.34 + ((flowTemperature - 35) / 35) * 0.66;
  return Math.round(room.baseOutput * factor);
}

function outputRatio(room, flowTemperature) {
  return radiatorOutputAt(room, flowTemperature) / room.demand;
}

function projectionStatus(room, flowTemperature) {
  const ratio = outputRatio(room, flowTemperature);
  if (ratio >= 1) return "sufficient";
  if (ratio >= 0.82) return "marginal";
  return "undersized";
}

function scopAt(flowTemperature) {
  const value = 4.35 - ((flowTemperature - 35) / 35) * 1.75;
  return value.toFixed(1);
}

function heatPumpProjectionPage() {
  const flow = projectionState.flowTemperature;
  const rooms = heatPumpProjection.rooms.map((room) => projectionRoomState(room, flow));
  const selected = rooms.find((room) => room.slug === projectionState.selectedRoom) || rooms[0];

  return shell(`
    <section class="spatial-twin ${projectionState.tilt ? "tilted" : ""}" aria-label="Heat pump projection spatial Twin">
      <a class="projection-exit" ${link("/home")}>Daedalus</a>
      <div class="projection-name">
        <span>Heat pump projection</span>
        <strong>${flow}&deg;C</strong>
      </div>

      <div class="spatial-stage">
        ${spatialPlan({
          rooms,
          selectedSlug: selected.slug,
          mode: "projection",
          state: projectionState,
          flow
        })}
      </div>

      ${projectionObjectNote(selected, flow)}

      <div class="spatial-controls" aria-label="Spatial Twin controls">
        <span>Flow</span>
        <input id="flow-temperature" data-flow-slider type="range" min="35" max="70" step="1" value="${flow}" aria-valuemin="35" aria-valuemax="70" aria-valuenow="${flow}" aria-label="Flow temperature in degrees Celsius" />
        <output for="flow-temperature">${flow}&deg;C</output>
        <div class="temperature-stops">
          ${heatPumpProjection.presets.map((preset) => `<button type="button" data-flow-preset="${preset.value}" class="${preset.value === flow ? "active" : ""}" aria-label="Set flow temperature to ${preset.value} degrees Celsius">${preset.label}</button>`).join("")}
        </div>
        ${spatialToolButtons(projectionState, ["rooms", "services", "evidence"])}
      </div>
    </section>
  `, { nav: false, flush: true });
}

function projectionRoomState(room, flowTemperature) {
  const output = radiatorOutputAt(room, flowTemperature);
  const ratio = output / room.demand;
  return {
    ...room,
    output,
    ratio,
    status: projectionStatus(room, flowTemperature),
    heatScale: Math.max(0.24, Math.min(1.12, ratio)),
    lossScale: Math.max(0.35, Math.min(1.15, 1.12 - ratio / 2))
  };
}

function spatialPlan({ rooms, selectedSlug, mode, state, flow, reviewObjects = [] }) {
  const zoom = state.zoom.toFixed(2);
  const layerClass = [
    state.layers.rooms === false ? "hide-rooms" : "",
    state.layers.services === false ? "hide-services" : "",
    state.layers.evidence === false ? "hide-evidence" : "",
    state.layers.objects === false ? "hide-objects" : ""
  ].join(" ");

  return `
    <div class="spatial-model ${layerClass}" style="--zoom:${zoom}; --scop:${flow ? scopAt(flow) : 0};" aria-label="Top-down floor plan spatial Twin">
      <svg viewBox="0 0 960 640" role="img" aria-label="Top-down floor plan with rooms, objects and pipework">
        <defs>
          <filter id="planShadow"><feDropShadow dx="0" dy="26" stdDeviation="24" flood-color="#24343d" flood-opacity=".12"/></filter>
        </defs>
        <g class="plan-camera">
          <path class="site-boundary" d="M118 46 H844 V576 H118 Z" filter="url(#planShadow)"/>
          <g class="room-layer">
            ${rooms.map((room) => `<path class="plan-room ${room.status || ""} ${room.slug === selectedSlug ? "selected" : ""}" d="${room.zone}"/>`).join("")}
            <path class="plan-walls" d="M142 74 H820 V548 H142 Z M270 74 V548 M318 302 H820 M510 302 V548 M690 74 V302"/>
          </g>
          <g class="service-layer">
            <path class="service-spine" d="M318 402 H430 V188 M430 424 H612 M430 194 H720"/>
            ${rooms.map((room) => room.pipe ? `<path class="plan-pipe ${room.slug === selectedSlug ? "selected" : ""} ${room.status || ""}" d="${room.pipe}"/>` : "").join("")}
            ${mode === "projection" ? rooms.map((room) => `<path class="heat-loss ${room.slug === selectedSlug ? "selected" : ""} ${room.status}" d="${room.loss}" style="--loss:${room.lossScale}"/>`).join("") : ""}
          </g>
          <g class="object-layer">
            ${mode === "projection" ? rooms.map((room) => radiatorMarker(room, selectedSlug, flow)).join("") : reviewObjects.map((object) => reviewMarker(object, selectedSlug)).join("")}
          </g>
          <g class="evidence-layer">
            ${mode === "review" ? reviewObjects.map((object) => evidenceRay(object, selectedSlug)).join("") : `<text class="scop-chip" x="318" y="384">SCOP ${scopAt(flow)}</text>`}
          </g>
        </g>
      </svg>
    </div>
  `;
}

function radiatorMarker(room, selectedSlug, flow) {
  return `
    <g class="plan-radiator ${room.status} ${room.slug === selectedSlug ? "selected" : ""}" tabindex="0" role="button" data-projection-room="${room.slug}" aria-label="${room.name}: ${room.status} at ${flow} degrees Celsius" style="--heat:${room.heatScale}">
      <path class="radiator-body" d="${room.emitter}"/>
      <path class="radiator-fins" d="${radiatorFins(room)}"/>
      <circle class="plan-heat" cx="${room.x}" cy="${room.y}" r="${Math.round(22 + room.heatScale * 28)}"/>
      <text x="${room.x}" y="${room.y - 24}" text-anchor="middle">${room.status}</text>
    </g>
  `;
}

function radiatorFins(room) {
  const startX = room.x - 22;
  return [0, 14, 28, 42].map((offset) => `M${startX + offset} ${room.y - 12} v24`).join(" ");
}

function projectionObjectNote(room, flow) {
  const needOutput = room.status === "undersized" ? "would need more emitter output" : `${room.status} at this temperature`;
  return `
    <div class="object-whisper ${room.status}" style="left:${room.x / 9.6}%;top:${room.y / 6.4}%">
      <span>${room.name}</span>
      <strong>${room.output} W / ${room.demand} W</strong>
      <em>${needOutput}</em>
      <p>${room.note}</p>
    </div>
  `;
}

function spatialToolButtons(state, layers) {
  return `
    <button type="button" data-spatial-zoom="-1" aria-label="Zoom out">-</button>
    <button type="button" data-spatial-zoom="1" aria-label="Zoom in">+</button>
    <button type="button" class="${state.tilt ? "active" : ""}" data-spatial-tilt aria-pressed="${state.tilt}">Tilt</button>
    ${layers.map((layer) => `<button type="button" class="${state.layers[layer] ? "active" : ""}" data-spatial-layer="${layer}" aria-pressed="${state.layers[layer]}">${layer}</button>`).join("")}
  `;
}

function captureReviewPage() {
  const objects = captureReview.objects.map((object) => ({
    ...object,
    status: captureState.statuses[object.slug] || object.status
  }));
  const selected = objects.find((object) => object.slug === captureState.selectedObject) || objects[0];
  const rooms = heatPumpProjection.rooms.map((room) => ({ ...room, status: "" }));

  return shell(`
    <section class="spatial-twin review ${captureState.tilt ? "tilted" : ""}" aria-label="Capture Review spatial Twin">
      <a class="projection-exit" ${link("/home")}>Daedalus</a>
      <div class="projection-name">
        <span>Capture review</span>
        <strong>${captureReview.question}</strong>
      </div>
      <div class="spatial-stage">
        ${spatialPlan({
          rooms,
          selectedSlug: selected.slug,
          mode: "review",
          state: captureState,
          reviewObjects: objects
        })}
      </div>
      ${reviewObjectNote(selected)}
      <div class="spatial-controls review-actions" aria-label="Capture review actions">
        ${["confirm", "correct", "leave unknown", "needs another look"].map((action) => `<button type="button" class="${selected.status === action ? "active" : ""}" data-review-action="${action}">${action}</button>`).join("")}
        ${spatialToolButtons(captureState, ["objects", "services", "evidence"])}
      </div>
    </section>
  `, { nav: false, flush: true });
}

function statusClass(status) {
  return status.replace(/\s+/g, "-");
}

function reviewMarker(object, selectedSlug) {
  return `
    <g class="review-object ${statusClass(object.status)} ${object.slug === selectedSlug ? "selected" : ""}" tabindex="0" role="button" data-review-object="${object.slug}" aria-label="${object.label}: ${object.status}">
      <circle cx="${object.x}" cy="${object.y}" r="18"/>
      <path d="${reviewIcon(object.type, object.x, object.y)}"/>
      <text x="${object.x}" y="${object.y + 38}" text-anchor="middle">${object.label}</text>
    </g>
  `;
}

function reviewIcon(type, x, y) {
  if (type === "heating") return `M${x - 8} ${y - 4} h16 M${x - 8} ${y + 4} h16`;
  if (type === "ventilation") return `M${x - 8} ${y} c8 -12 16 -12 16 0 c0 12 -8 12 -16 0`;
  if (type === "controls") return `M${x - 8} ${y - 8} h16 v16 h-16 Z`;
  return `M${x} ${y - 10} v20 M${x - 10} ${y} h20`;
}

function evidenceRay(object, selectedSlug) {
  return `
    <g class="evidence-ray ${object.slug === selectedSlug ? "selected" : ""}">
      <path d="M${object.x} ${object.y} C${object.x + 46} ${object.y - 58} ${object.x + 116} ${object.y - 54} ${object.x + 150} ${object.y - 88}"/>
      <text x="${object.x + 158}" y="${object.y - 86}">${object.evidenceType}</text>
    </g>
  `;
}

function reviewObjectNote(object) {
  return `
    <div class="object-whisper review-note ${statusClass(object.status)}" style="left:${object.x / 9.6}%;top:${object.y / 6.4}%">
      <span>${object.uncertainty} uncertainty</span>
      <strong>${object.label}</strong>
      <em>${object.status}</em>
      <p>${object.evidence}</p>
      <p>${object.transcript}</p>
    </div>
  `;
}
function room(slug) {
  const room = twin.rooms.find((item) => item.slug === slug) || twin.rooms[0];
  return shell(lensLayout("house", `
    <div class="lens-title">
      <a class="back-link" ${link("/explore")}>House layer</a>
      <span class="signal">Selected room</span>
      <h1>${room.name}</h1>
    </div>
    <div class="selected-thing">
      ${roomDiagram(room)}
      <div class="thing-facts">
        <span><strong>${room.confidence}%</strong> confidence</span>
        <span><strong>${room.evidence}</strong> evidence</span>
        <span><strong>${room.unknowns}</strong> unknowns</span>
      </div>
    </div>
    <div class="relationship-row">
      ${room.components.map(component => {
        const path = component.toLowerCase().includes("boiler") ? "/components/boiler" : component.toLowerCase().includes("radiator") ? "/components/radiator" : "/understanding";
        return `<a ${link(path)}><i></i>${component}</a>`;
      }).join("")}
    </div>
  `));
}

function roomDiagram(room) {
  return `
    <svg class="selected-svg" viewBox="0 0 620 380" role="img" aria-label="${room.name} model">
      <path class="room-plane" d="M86 78 H452 L538 160 V310 H172 L86 228 Z"/>
      <path class="fabric-line" d="M172 310 V160 L86 78 M172 160 H538 M330 78 V310"/>
      <path class="heat-line" d="M154 268 C252 208 382 222 486 282"/>
      <path class="water-line" d="M210 228 C308 154 418 154 510 202"/>
      <circle class="system-node heat" cx="${room.slug === "kitchen" ? 486 : 252}" cy="${room.slug === "kitchen" ? 282 : 208}" r="13"/>
      <circle class="window-node" cx="510" cy="202" r="12"/>
      <circle class="insulation-node" cx="330" cy="96" r="12"/>
    </svg>
  `;
}

function component(slug) {
  const item = twin.components[slug] || twin.components.boiler;
  return shell(lensLayout("systems", `
    <div class="lens-title">
      <a class="back-link" ${link("/explore")}>Systems layer</a>
      <span class="signal">Selected system element</span>
      <h1>${item.name}</h1>
    </div>
    <div class="component-focus">
      ${componentObject(item.slug)}
      ${relationshipMap(item)}
    </div>
    <div class="change-effect">
      <span>Change effect model</span>
      <strong>If ${item.name.toLowerCase()} output changed, Daedalus can show which parts of the House, Systems and Home would be affected and why.</strong>
    </div>
    <div class="evidence-rail">
      ${item.evidence.map((evidence, index) => `<span><i>${index + 1}</i>${evidence.split(".")[0]}</span>`).join("")}
    </div>
  `, { wide: true }));
}

function componentObject(slug) {
  const isBoiler = slug === "boiler";
  return `
    <svg class="component-svg" viewBox="0 0 520 390" role="img" aria-label="${isBoiler ? "Boiler" : "Radiator"} object">
      <ellipse cx="260" cy="340" rx="150" ry="22" fill="#637883" opacity=".14"/>
      ${isBoiler ? `
        <rect x="160" y="58" width="200" height="248" rx="24" fill="#f9fcfd" stroke="#24343d" stroke-width="2"/>
        <rect x="188" y="102" width="144" height="52" rx="10" fill="#dfeaec"/>
        <circle cx="222" cy="210" r="28" fill="#edf5f7" stroke="#52636e"/>
        <path class="heat-line" d="M206 312 V366 M260 312 V366 M314 312 V366"/>
        <path class="water-line" d="M360 184 C414 204 426 248 382 282"/>
      ` : `
        <rect x="120" y="142" width="280" height="120" rx="24" fill="#f9fcfd" stroke="#24343d" stroke-width="2"/>
        <path d="M154 160 V246 M196 160 V246 M238 160 V246 M280 160 V246 M322 160 V246 M364 160 V246" stroke="#768a94" stroke-width="5" stroke-linecap="round"/>
        <path class="heat-line" d="M112 286 C208 336 316 336 412 286"/>
      `}
      <circle class="system-node heat" cx="184" cy="316" r="10"/>
      <circle class="evidence-node" cx="374" cy="104" r="10"/>
    </svg>
  `;
}

function relationshipMap(item) {
  return `
    <svg class="relationship-svg" viewBox="0 0 540 390" role="img" aria-label="Relationship map">
      <circle class="rel-core" cx="270" cy="194" r="60"/>
      <text x="270" y="200" text-anchor="middle">${item.name}</text>
      ${item.relationships.map((rel, index) => {
        const points = [[104,96], [436,96], [104,292], [436,292]];
        const [x, y] = points[index % points.length];
        return `<path class="rel-line" d="M270 194 L${x} ${y}"/><circle class="rel-node" cx="${x}" cy="${y}" r="44"/><text x="${x}" y="${y + 5}" text-anchor="middle">${rel}</text>`;
      }).join("")}
    </svg>
  `;
}

const explainCards = [
  ["upstairs", "Upstairs comfort", "layout + fabric + radiator sizing + bedroom routines"],
  ["hot-water", "Hot water path", "boiler + cylinder + pipe routes + bathroom demand"],
  ["heat-movement", "Heat movement", "controls + rooms + insulation + occupancy"],
  ["ventilation", "Ventilation", "extractors + windows + moisture routines"]
];

function understanding(slug) {
  const selected = explainCards.find((card) => card[0] === slug) || explainCards[0];
  return shell(lensLayout("all", `
    <div class="lens-title">
      <span class="signal">Why this happens</span>
      <h1>${selected[1]}</h1>
    </div>
    <div class="why-diagram">
      ${whyDiagram(selected[0])}
    </div>
    <div class="scenario-explanation">
      <span>Interaction</span>
      <strong>${selected[2]}</strong>
    </div>
    <div class="explain-strip">
      ${explainCards.map((card) => `<a class="${selected[0] === card[0] ? "active" : ""}" ${link(`/understanding/${card[0]}`)}>${card[1]}</a>`).join("")}
    </div>
  `));
}

function whyDiagram(type) {
  return `
    <svg viewBox="0 0 700 420" role="img" aria-label="House Systems Home interaction diagram">
      <circle class="big-node house" cx="150" cy="210" r="72"/><text x="150" y="216" text-anchor="middle">House</text>
      <circle class="big-node systems" cx="350" cy="130" r="72"/><text x="350" y="136" text-anchor="middle">Systems</text>
      <circle class="big-node home" cx="550" cy="210" r="72"/><text x="550" y="216" text-anchor="middle">Home</text>
      <path class="because-line" d="M218 188 C260 132 286 122 278 130"/>
      <path class="because-line" d="M422 130 C468 136 502 162 488 178"/>
      <path class="because-line" d="M478 244 C370 330 276 316 220 244"/>
      <circle class="effect-node" cx="350" cy="314" r="52"/><text x="350" y="309" text-anchor="middle">${type === "hot-water" ? "delivery" : type === "ventilation" ? "air" : "comfort"}</text><text x="350" y="330" text-anchor="middle">pattern</text>
      <path class="effect-line" d="M150 282 L350 314 L550 282 M350 202 V262"/>
    </svg>
  `;
}

function conversation() {
  return shell(`
    <section class="conversation-canvas">
      <div class="persistent-twin">${twinModel({ focus: "all", compact: true })}</div>
      <div class="conversation-lens">
        <div class="lens-title">
          <span class="signal">Talk to the model</span>
          <h1>Ask why, not what to buy.</h1>
        </div>
        ${twin.conversation.map((turn) => `
          <div class="chat-turn">
            <div class="bubble user">${turn.question}</div>
            <div class="bubble twin">${turn.answer.split(".").slice(0, 2).join(".")}.</div>
            <div class="evidence-chips"><span>House</span><span>Systems</span><span>Home context</span></div>
          </div>
        `).join("")}
        <form class="composer">
          <input aria-label="Message" placeholder="Ask about a room, system or comfort pattern..." />
          <button type="button">Ask</button>
        </form>
      </div>
    </section>
  `);
}

function timeline() {
  return shell(lensLayout("all", `
    <div class="lens-title">
      <span class="signal">Twin history</span>
      <h1>Changes attach to the model.</h1>
    </div>
    <div class="timeline-model">
      ${twin.timeline.map((event, index) => `
        <article class="time-node type-${index % 3}">
          <span>${event.year}</span>
          <strong>${event.title}</strong>
          <i>${index % 3 === 0 ? "House" : index % 3 === 1 ? "Evidence" : "Systems"}</i>
        </article>
      `).join("")}
    </div>
  `));
}

function documents() {
  return shell(lensLayout("all", `
    <div class="lens-title">
      <span class="signal">Evidence attached to the Twin</span>
      <h1>Documents explain parts of the model.</h1>
    </div>
    <div class="evidence-map">
      ${twin.documents.map((doc, index) => `
        <article class="evidence-tile">
          ${evidenceIcon(index)}
          <strong>${doc.title}</strong>
          <span>${index % 3 === 0 ? "House" : index % 3 === 1 ? "Systems" : "Home"} evidence</span>
        </article>
      `).join("")}
    </div>
  `));
}

function evidenceIcon(index) {
  const icons = [
    `<path d="M54 138 H174 V64 H54 Z M74 88 H154 M74 112 H134"/>`,
    `<rect x="58" y="58" width="112" height="92" rx="10"/><circle cx="90" cy="92" r="16"/><path d="M68 140 L112 112 L158 140"/>`,
    `<path d="M58 152 V54 H164 V152 Z M78 80 H144 M78 106 H144 M78 132 H122"/>`
  ];
  return `<svg viewBox="0 0 220 184" role="img">${icons[index % icons.length]}</svg>`;
}

function notFound() {
  return shell(`
    <section class="home-canvas">
      <div class="canvas-title"><span class="signal">Prototype route</span><h1>This lens is not built yet.</h1></div>
      ${twinModel({ focus: "all" })}
      <a class="primary-action" ${link("/home")}>Return to the Twin</a>
    </section>
  `);
}

function viewFor(path) {
  if (path === "/landing") return landing();
  if (path === "/home") return home();
  if (path === "/explore") return explore();
  if (path === "/heat-pump-projection") return heatPumpProjectionPage();
  if (path === "/capture-review") return captureReviewPage();
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
