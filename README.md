# Daedalus Sandbox

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

## Relationship to production repositories

Nothing here is authoritative. Nothing here changes production architecture or contracts. No code, data shape, UI pattern, or workflow should be copied into production without deliberate implementation work later.

Treat this as the Apple Keynote demo before building the operating system: useful for direction, storytelling, and product judgement, not as a source of implementation truth.

## Prototype structure

- `/landing` shows the moment after a property has been created.
- `/home` introduces the Digital Twin overview.
- `/explore` provides an interactive house model.
- `/rooms/:room` shows room-level observations, confidence, evidence, and unknowns.
- `/components/:component` explains components such as the boiler through identity, location, evidence, relationships, documents, and timeline.
- `/understanding` explains home behaviour through evidence-led cards.
- `/conversation` demonstrates Digital Twin answers grounded in observed evidence.
- `/timeline` shows the evolving history of the home.
- `/documents` presents documents as evidence attached to the Twin.

## Editing

The app uses plain ES modules and CSS:

- `src/data.js` contains the mocked Digital Twin.
- `src/app.js` contains route rendering and reusable UI fragments.
- `src/styles.css` contains the visual system and responsive layout.
- `server.mjs` is a tiny static server with SPA fallback.
