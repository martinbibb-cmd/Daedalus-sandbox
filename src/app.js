import { navItems, twin } from "./data.js";

const app = document.querySelector("#app");

function route() {
  return window.location.pathname === "/" ? "/landing" : window.location.pathname;
}

function navigate(path) {
  history.pushState({}, "", path);
  render();
}

window.addEventListener("popstate", render);

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-link]");
  if (!link) return;
  event.preventDefault();
  navigate(link.getAttribute("href"));
});

function shell(content, options = {}) {
  const current = route();
  const showNav = options.nav !== false;
  return `
    <div class="app-shell">
      ${showNav ? `
      <aside class="sidebar">
        <a class="brand" href="/home" data-link>
          <span class="brand-mark"></span>
          <span>Daedalus</span>
        </a>
        <nav>
          ${navItems.map(([label, href]) => `
            <a href="${href}" data-link class="${current.startsWith(href) ? "active" : ""}">${label}</a>
          `).join("")}
        </nav>
        <div class="twin-chip">
          <strong>${twin.property.name}</strong>
          <span>${twin.property.confidence}% twin confidence</span>
        </div>
      </aside>` : ""}
      <main class="page ${showNav ? "" : "full"}">${content}</main>
    </div>
  `;
}

function stat(label, value) {
  return `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`;
}

function confidence(value) {
  return `
    <div class="confidence">
      <div><span>Confidence</span><strong>${value}%</strong></div>
      <div class="meter"><i style="width:${value}%"></i></div>
    </div>
  `;
}

function houseArt(interactive = false) {
  const rooms = [
    ["Kitchen", "kitchen", 62, 66],
    ["Utility", "utility", 40, 62],
    ["Loft", "loft", 50, 23],
    ["Bathroom", "bathroom", 70, 42],
    ["Hall", "hall", 31, 44]
  ];

  return `
    <div class="house-art ${interactive ? "interactive" : ""}" aria-label="Digital Twin house illustration">
      <svg viewBox="0 0 900 620" role="img">
        <defs>
          <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/>
            <stop offset="1" stop-color="#dfe8ef" stop-opacity=".52"/>
          </linearGradient>
          <filter id="soft">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#51616d" flood-opacity=".16"/>
          </filter>
        </defs>
        <path d="M138 289 L450 82 L763 289" fill="none" stroke="#1d2a33" stroke-width="3"/>
        <path d="M206 288 H696 V534 H206 Z" fill="url(#glass)" stroke="#22323e" stroke-width="2" filter="url(#soft)"/>
        <path d="M266 288 V534 M450 184 V534 M614 288 V534 M206 407 H696" stroke="#7f8c94" stroke-width="1.4" opacity=".72"/>
        <path d="M283 330 H382 V388 H283 Z M510 326 H585 V387 H510 Z M634 432 H673 V534 H634 Z" fill="#f6fafc" stroke="#6c7a83"/>
        <path d="M322 248 C372 217 406 195 450 168 C496 196 535 220 584 248" fill="none" stroke="#8c9aa2" stroke-width="1.2" stroke-dasharray="7 8"/>
        <path d="M266 476 C337 442 404 442 450 476 C503 516 574 510 640 470" fill="none" stroke="#5f7888" stroke-width="2" opacity=".7"/>
        <circle cx="421" cy="456" r="7" fill="#27343c"/><circle cx="651" cy="347" r="7" fill="#27343c"/><circle cx="512" cy="239" r="7" fill="#27343c"/>
      </svg>
      ${rooms.map(([name, slug, left, top]) => `
        <a class="room-pin" href="/rooms/${slug}" data-link style="left:${left}%;top:${top}%">
          <span></span>${name}
        </a>
      `).join("")}
    </div>
  `;
}

function landing() {
  return shell(`
    <section class="landing">
      <div class="success-pill">Property created successfully</div>
      <div class="landing-grid">
        <div class="hero-copy">
          <p class="eyebrow">${twin.property.createdAt}</p>
          <h1>${twin.property.name}</h1>
          <p class="lede">${twin.property.summary}</p>
          <div class="stats-row">
            ${stat("rooms understood", twin.property.rooms)}
            ${stat("observed components", twin.property.components)}
            ${stat("evidence items", twin.property.evidence)}
          </div>
          <a class="primary-action" href="/home" data-link>Continue into the Twin</a>
        </div>
        ${houseArt(false)}
      </div>
    </section>
  `, { nav: false });
}

function home() {
  return shell(`
    <section class="topline">
      <div>
        <p class="eyebrow">${twin.property.address}</p>
        <h1>Your home has become understandable.</h1>
        <p class="lede">${twin.property.type}. ${twin.property.summary}</p>
      </div>
      <div class="summary-card glass">${confidence(twin.property.confidence)}${stat("evidence items", twin.property.evidence)}</div>
    </section>
    <section class="panel-grid">
      <article class="wide panel">
        <h2>Things worth understanding</h2>
        <div class="understand-strip">
          ${twin.understanding.slice(0, 4).map(item => `<a href="/understanding/${item.slug}" data-link>${item.title}</a>`).join("")}
        </div>
      </article>
      <article class="panel">
        <h2>Recent discoveries</h2>
        <ul>${twin.discoveries.map(item => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="panel accent">
        <h2>Needs review</h2>
        <ul>${twin.needsReview.map(item => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="panel">
        <h2>Recent survey</h2>
        <p>June 2026 guided survey connected rooms, components, photos, documents, and homeowner observations into a first working Twin.</p>
        <a href="/documents" data-link>Open evidence</a>
      </article>
      <article class="panel">
        <h2>Timeline preview</h2>
        <p><strong>2026</strong> Digital Twin created from 186 linked observations.</p>
        <a href="/timeline" data-link>View history</a>
      </article>
      <article class="panel">
        <h2>Conversation preview</h2>
        <p>"Why is the kitchen colder?"</p>
        <a href="/conversation" data-link>Ask the Twin</a>
      </article>
      <article class="panel">
        <h2>Documents preview</h2>
        <p>Evidence Pack, survey report, certificates, manuals, invoices, plans.</p>
        <a href="/documents" data-link>Browse documents</a>
      </article>
    </section>
  `);
}

function explore() {
  return shell(`
    <section class="topline">
      <div>
        <p class="eyebrow">Explore</p>
        <h1>Move through the home by meaning, not menus.</h1>
        <p class="lede">Tap a room, system, or component. The Twin keeps evidence and uncertainty visible as you move.</p>
      </div>
    </section>
    <section class="explore-layout">
      ${houseArt(true)}
      <div class="panel system-list">
        <h2>Systems</h2>
        <a href="/components/boiler" data-link>Heating source</a>
        <a href="/understanding/hot-water" data-link>Hot water path</a>
        <a href="/understanding/ventilation" data-link>Ventilation</a>
        <a href="/understanding/building-fabric" data-link>Building fabric</a>
        <a href="/components/radiator" data-link>Kitchen radiator</a>
      </div>
    </section>
  `);
}

function room(slug) {
  const room = twin.rooms.find((item) => item.slug === slug) || twin.rooms[0];
  return shell(`
    <section class="detail-hero">
      <a class="back-link" href="/explore" data-link>Explore</a>
      <p class="eyebrow">Room</p>
      <h1>${room.name}</h1>
      <p class="lede">${room.insight}</p>
    </section>
    <section class="detail-grid">
      <article class="panel">${confidence(room.confidence)}${stat("evidence items", room.evidence)}${stat("unknowns", room.unknowns)}</article>
      <article class="panel wide">
        <h2>Observed components</h2>
        <div class="component-list">
          ${room.components.map(component => {
            const path = component.toLowerCase().includes("boiler") ? "/components/boiler" : component.toLowerCase().includes("radiator") ? "/components/radiator" : "/explore";
            return `<a href="${path}" data-link>${component}<span>${room.name}</span></a>`;
          }).join("")}
        </div>
      </article>
      <article class="panel wide">
        <h2>What remains unknown</h2>
        <p>The Twin keeps unresolved observations visible so future surveys can improve the model without pretending certainty.</p>
      </article>
    </section>
  `);
}

function component(slug) {
  const item = twin.components[slug] || twin.components.boiler;
  return shell(`
    <section class="detail-hero">
      <a class="back-link" href="/explore" data-link>Explore</a>
      <p class="eyebrow">Component</p>
      <h1>${item.name}</h1>
      <p class="lede">${item.explanation}</p>
    </section>
    <section class="detail-grid">
      <article class="panel">
        <h2>Identity</h2>
        <p>${item.identity}</p>
        <p><strong>Observed location</strong><br>${item.location}</p>
        ${confidence(item.confidence)}
      </article>
      <article class="panel wide">
        <h2>Evidence</h2>
        <ul>${item.evidence.map(evidence => `<li>${evidence}</li>`).join("")}</ul>
      </article>
      <article class="panel">
        <h2>Relationships</h2>
        <div class="tag-cloud">${item.relationships.map(rel => `<span>${rel}</span>`).join("")}</div>
      </article>
      <article class="panel">
        <h2>Timeline</h2>
        <ul>${item.timeline.map(event => `<li>${event}</li>`).join("")}</ul>
      </article>
      <article class="panel wide">
        <h2>Documents and photos</h2>
        <div class="document-list">${item.documents.map(doc => `<a href="/documents" data-link>${doc}</a>`).join("")}</div>
      </article>
    </section>
  `);
}

function understanding(slug) {
  const selected = slug ? twin.understanding.find((item) => item.slug === slug) : null;
  return shell(`
    <section class="topline">
      <div>
        <p class="eyebrow">Understanding</p>
        <h1>${selected ? selected.title : "Explanations built from the home itself."}</h1>
        <p class="lede">${selected ? selected.body : "Each card explains behaviour by connecting observations, relationships, and confidence. No recommendations, rankings, pricing, or sales flows."}</p>
      </div>
    </section>
    <section class="card-grid">
      ${twin.understanding.map(item => `
        <a class="knowledge-card ${selected?.slug === item.slug ? "selected" : ""}" href="/understanding/${item.slug}" data-link>
          <span>Explanation</span>
          <h2>${item.title}</h2>
          <p>${item.body}</p>
        </a>
      `).join("")}
    </section>
  `);
}

function conversation() {
  return shell(`
    <section class="conversation-page">
      <div class="chat-header">
        <p class="eyebrow">Conversation</p>
        <h1>Ask the Digital Twin.</h1>
        <p class="lede">Responses cite observed evidence and uncertainty. They explain the home rather than selling a fix.</p>
      </div>
      <div class="chat-window">
        ${twin.conversation.map(turn => `
          <div class="bubble user">${turn.question}</div>
          <div class="bubble twin">${turn.answer}</div>
        `).join("")}
        <form class="composer">
          <input aria-label="Message" placeholder="Ask about a room, component, or pattern..." />
          <button type="button">Ask</button>
        </form>
      </div>
    </section>
  `);
}

function timeline() {
  return shell(`
    <section class="topline">
      <div>
        <p class="eyebrow">Timeline</p>
        <h1>The home has a history the Twin can carry forward.</h1>
        <p class="lede">Events are evidence-linked and confidence-aware, from original fabric through future surveys.</p>
      </div>
    </section>
    <section class="timeline">
      ${twin.timeline.map(event => `
        <article>
          <time>${event.year}</time>
          <div><h2>${event.title}</h2><p>${event.detail}</p></div>
        </article>
      `).join("")}
    </section>
  `);
}

function documents() {
  return shell(`
    <section class="topline">
      <div>
        <p class="eyebrow">Documents</p>
        <h1>Evidence, not files in a folder.</h1>
        <p class="lede">Documents become part of the Twin when they explain rooms, systems, components, and dates.</p>
      </div>
    </section>
    <section class="document-grid">
      ${twin.documents.map(doc => `
        <article class="doc-card">
          <span>${doc.type}</span>
          <h2>${doc.title}</h2>
          <p>${doc.detail}</p>
        </article>
      `).join("")}
    </section>
  `);
}

function notFound() {
  return shell(`
    <section class="topline">
      <div>
        <p class="eyebrow">Prototype route</p>
        <h1>This part of the Twin is still being shaped.</h1>
        <p class="lede">Return to the home overview or explore the current rooms and components.</p>
        <a class="primary-action" href="/home" data-link>Go home</a>
      </div>
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
