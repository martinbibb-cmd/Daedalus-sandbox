# Daedalus Sandbox

## Reality First

Your home is made of three things.

- The House: the physical building.
- The Systems: the things that make the House work.
- The Home: the people and lived context.

Daedalus is a Digital Twin designed to understand all three.

Daedalus Sandbox is a product experience prototype. It is not production software and it is not an architectural reference.

The purpose of this repository is to explore what Daedalus Main might feel like immediately after a new Digital Twin has been created. The prototype is intentionally opinionated, visual, and interactive so it can be used in conversations with investors, customers, engineers, British Gas leadership, and manufacturers.

## Live demo

https://martinbibb-cmd.github.io/Daedalus-sandbox/

## Run locally

```bash
npm run dev
```

Open `http://localhost:5174`.

If PowerShell blocks `npm`, use:

```powershell
npm.cmd run dev
```

## Sandbox rules

This repository may fake APIs, hard-code data, invent transitions, use placeholder evidence, and experiment freely. The aim is to communicate the experience of exploring a home's knowledge.

This repository must not introduce or imply production decisions about contracts, architecture, storage, APIs, authentication, compliance, pricing, quoting, CRM, product rankings, or sales workflows.

The guiding product constraint is:

```text
Reality -> Analysis -> Explanation
```

## Spatial interaction intent

The navigable spatial Twin is the canvas. The user is not navigating pages; the user is navigating space.

The default view should be a surveyor-friendly top-down floor plan: spatially accurate, anchored to rooms, areas, objects, services, evidence, and uncertainty.

The enhanced view should be a raised 3D view over the same Twin: rotatable, tiltable, zoomable, able to isolate floors and layers, able to toggle services, able to show or hide object-attached evidence, and able to highlight uncertainty.

The Twin is not a picture of the house. The Twin is the place where interaction happens.

Daedalus should not use cutaway house views, side elevations, cartoon house illustrations, dashboard-first UI, or cards as the primary interface. Those views are misleading because they only work for simple two-up/two-down properties and fail for bungalows, flats, extensions, split levels, loft conversions, commercial properties, and irregular buildings.

Every feature is another projection of the Twin, not a detached page or summary surface.

The core product model is:

- The House: rooms, structure, insulation, windows, orientation, location, and fabric.
- The Systems: heating, hot water, ventilation, cooling, electrical, energy production, energy storage, and water.
- The Home: people, room use, routines, comfort needs, priorities, children, accessibility, pets, future plans, and what matters to the household.

Daedalus is different because it models how these three interact. The user should understand that visually before reading supporting copy.

Home, Explore, Rooms, Components, Understanding, Conversation, Timeline, and Documents should not feel like disconnected pages. They should feel like spatial review modes over the same Twin canvas.

Daedalus does not recommend what to do in this sandbox. It explains what a change would affect and why.

The heat pump projection lens is a mocked projection of the Twin only. The Twin canvas is the interface: changing flow temperature changes rooms, emitters, pipework, heat movement, and mocked SCOP values in the navigable spatial Twin. It is not production logic, a physics engine, or a decision workflow.

The Capture Review lens is mocked spatial proofreading. The question is "Have I got the property right?" and evidence appears from the selected object rather than as detached metadata.

The purpose is to observe reality, model reality, and explain reality. Human beings remain responsible for decisions.

## Relationship to production repositories

Nothing here is authoritative. Nothing here changes production architecture or contracts. No code, data shape, UI pattern, or workflow should be copied into production without deliberate implementation work later.

Treat this as the Apple Keynote demo before building the operating system: useful for direction, storytelling, and product judgement, not as a source of implementation truth.

## Prototype lenses

- `/landing` introduces House + Systems + Home as connected layers.
- `/home` shows all three layers interacting on the Twin canvas.
- `/explore` focuses the House layer.
- `/heat-pump-projection` opens a projection of the Twin for flow temperature, radiator sufficiency, pipework, heat movement, and mocked SCOP values.
- `/capture-review` shows Capture Review as spatial Twin proofreading with object-attached evidence and uncertainty.
- `/rooms/:room` selects a room while keeping the Twin visible.
- `/components/:component` focuses a system element and what it affects.
- `/understanding` explains behaviour through House + Systems + Home diagrams.
- `/conversation` keeps the Twin visible beside evidence-grounded answers.
- `/timeline` shows changes attached to the Twin.
- `/documents` shows object-attached evidence on the model, not a file list.

## Editing

The app uses plain ES modules and CSS:

- `src/data.js` contains the mocked Digital Twin.
- `src/app.js` contains route rendering and reusable UI fragments.
- `src/styles.css` contains the visual system and responsive layout.
- `server.mjs` is a tiny static server with SPA fallback.
