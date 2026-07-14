# Daedalus Sandbox

Daedalus Sandbox is a disposable product prototype.

Its primary purpose is a proof of concept for Daedalus Main:

- imported Capture Package review
- provenance-first Evidence Twin
- confirmed, candidate, unknown and conflicting evidence
- command-facing status
- scenario and explanation lenses

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
- `#/twin`
- `#/reasoning`
- `#/scenarios`
- `#/capture-demo`

`#/home` and `#/command` redirect to the current Main proof-of-concept entry point for older links.

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
