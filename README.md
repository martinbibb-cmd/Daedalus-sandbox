# Daedalus Sandbox

Daedalus Sandbox is a disposable product prototype.

It currently reflects the Capture v2 field workflow:

- Capture Command / property shell
- RoomPlan Capture Session
- semantic evidence tags
- external measurement tools
- Workspace / ARKit Proposed Reality
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

- `#/command`
- `#/roomplan`
- `#/tools`
- `#/workspace`
- `#/handoff`

`#/home` redirects to the current command view for older links.

## Sandbox Rules

Nothing here changes the Constitution, DESIGN_FREEZE_v3, contracts, production storage, authentication, or app architecture.

Production implementation remains owned by the real repositories:

- Capture owns capture UI and evidence collection.
- Main owns reasoning and explanation.
- Contracts owns shared schemas.
- Platform owns hosted services and shared infrastructure.

## Editing

The app uses plain ES modules and CSS:

- `src/data.js` contains mocked Capture state.
- `src/app.js` contains route rendering and UI fragments.
- `src/styles.css` contains the visual system and responsive layout.
- `server.mjs` is a tiny static server with SPA fallback.
