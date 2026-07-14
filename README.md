# Daedalus Sandbox

Daedalus Sandbox is a disposable product prototype. It is not an architectural authority and its implementation must not be copied directly into Main.

Its current purpose is to demonstrate one coherent Daedalus Main interaction:

1. Open `#/main`.
2. Inspect the current authoritative combined Twin.
3. Select the heating system.
4. Select the boiler.
5. Drill down to boiler evidence.
6. Explain the selected boiler.
7. Create a What If copy of the current Twin.
8. Change boiler output from 24 kW to 35 kW.
9. See consequences propagate to primary pipework, controls and heat-loss context.
10. Run the proposed system through a visible timeline.
11. See the bottleneck occur.
12. Discard the proposed Twin and return to unchanged current reality.

All data is mocked. The point is visible behaviour, not production architecture.

## Live Demo

https://martinbibb-cmd.github.io/Daedalus-sandbox/

## Run Locally

```bash
npm run dev
```

Open `http://localhost:5174`.

## Test

```bash
npm test
```

## Routes

- `#/main` - primary Main proof-of-concept entry point
- `#/tighten` - temporary import review
- `#/what-if` - proposed Twin branch and comparison
- `#/run` - mocked time-based system behaviour
- `#/capture-demo` - separate Capture interaction demo

Older links such as `#/home`, `#/command`, `#/reasoning`, and `#/scenarios` enter `#/main`.

## Product Rules Demonstrated

- The Twin is the noun; What If and Run are verbs applied to it.
- The graph is internal implementation. The user sees a graphic Twin of the house, system, room or component.
- Graph-derived consequences must be projected back onto the house/system graphic.
- Tighten is temporary review for a fresh import, not a permanent workspace.
- Zoom is contextual selection and drill-down through the graphic Twin.
- Explain is contextual to the selected object or behaviour.
- What If clones authoritative reality and never mutates it.
- Run explains behaviour and bottlenecks over time; it does not recommend a product.
- A visible node-and-edge graph is not a normal product view.
- Visible controls must change data, navigation, selection, rendered information, simulation state, or a contextual explanation.

## Production Boundary

Nothing here changes the Constitution, Capture architecture, Contracts schemas, Platform storage, authentication, or real Main implementation.

Production ownership remains:

- Capture owns capture UI and evidence collection.
- Main owns reasoning, explanation, What If branches and Run behaviour.
- Contracts owns shared schemas.
- Platform owns hosted services and shared infrastructure.
- Sandbox owns disposable UX experiments.

## Files

- `src/data.js` contains mocked Twin, evidence, Tighten, What If and Run data.
- `src/model.js` contains pure state transitions used by tests.
- `src/app.js` renders the disposable prototype.
- `src/styles.css` contains the visual system.
- `tests/model.test.js` covers the important state guarantees.
- `server.mjs` is a tiny static server with SPA fallback.
