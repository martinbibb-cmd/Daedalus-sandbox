# Daedalus Sandbox

Daedalus Sandbox is a disposable product prototype.

Its primary purpose is a proof of concept for Daedalus Main:

- Tighten imported Capture Packages before they become authoritative
- present the living Twin as the default interface
- preserve House, System and Home as underlying twin pages
- clone the current Twin for What If changes
- Run systems over time to expose operation and bottlenecks
- use Zoom and Explain as verbs across the Twin, What If and Run views

It also includes a Capture demo lens because the current Capture interaction is useful to review alongside Main:

- Capture Command / property shell
- RoomPlan Capture Session
- semantic evidence tags
- Capture handoff bundle to Main

The sandbox is not production software and is not an architectural authority. It may hard-code data, fake state, and compress workflows so the current design direction can be reviewed quickly.

## Live demo

https://martinbibb-cmd.github.io/Daedalus-sandbox/

## Run locally

```bash
npm run dev
```

Open `http://localhost:5174`.

## Current Routes

- `#/main`
- `#/tighten`
- `#/twin`
- `#/what-if`
- `#/run`
- `#/capture-demo`

`#/home`, `#/main`, `#/command`, `#/reasoning`, and `#/scenarios` redirect to the current Twin entry point for older links.

## Sandbox Rules

Nothing here changes the Constitution, DESIGN_FREEZE_v3, contracts, production storage, authentication, or app architecture.

Production implementation remains owned by the real repositories:

- Capture owns capture UI and evidence collection.
- Main owns reasoning and explanation.
- Contracts owns shared schemas.
- Platform owns hosted services and shared infrastructure.

## Editing

The app uses plain ES modules and CSS:

- `src/data.js` contains mocked Main and Capture demo state.
- `src/app.js` contains route rendering and UI fragments.
- `src/styles.css` contains the visual system and responsive layout.
- `server.mjs` is a tiny static server with SPA fallback.
