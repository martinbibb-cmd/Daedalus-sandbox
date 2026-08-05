# Daedalus Sandbox

Daedalus Sandbox is a disposable product prototype. It is not an architectural authority and its implementation must not be copied directly into Main.

Its current purpose is to demonstrate the intended Daedalus Main design language:

1. Open `#/main`.
2. See the Place as a wireframe graphic Twin, not as a dashboard.
3. Select graph-backed rooms, routes and components through the graphic.
4. Inspect customer-readable image/label overlays attached to graph items at real XYZ locations.
5. Review ambiguities as multiple-choice questions, not free-text forms.
6. Create an editable clone of the current Twin and apply graph/spatial edits without mutating reality.
7. Play mocked system behaviour through visible property overlays.
8. Discard the editable clone and return to unchanged current reality.

All data and visuals are mocked. The point is design understanding, not production architecture.

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
- `#/tighten` - Tighten Import, temporary ambiguity resolution for imported evidence.
- `#/clone` - Clone & Edit, editable branch and comparison.
- `#/run` - Operate Twin, mocked time-based system behaviour.
- `#/capture-demo` - separate Capture interaction demo
- `#/build-plan` - read-only published projection pinned to its authoritative Contracts commit

Older links such as `#/home`, `#/command`, `#/reasoning`, and `#/scenarios` enter `#/main`.

## Visual Sandbox Role

This PWA is now the place to test whether the product *feels* like Daedalus before the real Main implementation commits to a visual direction.

The current `#/main` screen is intentionally spatial-first:

- the Living Dollhouse dominates the page;
- the projection is seeded from a sanitized Capture v2 RoomPlan session summary;
- rooms, routes, components and evidence markers appear in one Place workspace;
- heating, water, electrical, network, human interaction and evidence are layer filters over the same Twin;
- selecting a component changes the inspector without leaving the property context.
- the visible graphic is built from graph-backed components/routes on a wireframe, with labels/images for customer understanding;
- every graph-backed component and comment annotation has an explicit XYZ location in the fixture;
- operational playback uses graph relationships to light routes and affected components on the dollhouse;
- clone edits alter graph items at their preserved spatial anchors without editing current reality.

The fixture is a visual projection, not production geometry stitching. It should be judged as a design-intent smoke test, not as a replacement for Main's authoritative renderer.

## Product Rules Demonstrated

- The Twin is the noun; Clone/Edit and Operate are verbs applied to it.
- The graph is internal implementation. The user sees a graphic Twin of the Place, system, room, route, surface or component.
- Graph-derived consequences must be projected back onto the Place/system graphic.
- Review & Complete is temporary ambiguity resolution for a fresh import, not a permanent workspace.
- Ambiguities should become bounded questions with explicit choices and outcomes.
- Zoom is contextual selection and drill-down through the graphic Twin.
- Explain is contextual to the selected object or behaviour.
- Clone/Edit preserves authoritative reality and never mutates it.
- Clone/Edit operations alter graph items and preserve their spatial anchors unless the edit explicitly moves them.
- Operate explains behaviour and bottlenecks over time; it does not recommend a product.
- A visible node-and-edge graph is not a normal product view.
- Visible controls must change data, navigation, selection, rendered information, simulation state, or a contextual explanation.

## Visual Target

The intended visual direction is documented in `docs/SANDBOX_VISUAL_TARGET.md`.

In short: Sandbox should evolve toward a CAD/BIM-style living Place Twin where WiFi, heating and human interaction are projections over the same captured geometry. Tighten and Clone/Edit must become spatial/CAD-like tools, not text workflows.

## Production Boundary

Nothing here changes the Constitution, Capture architecture, Contracts schemas, Platform storage, authentication, or real Main implementation.

Production ownership remains:

- Capture owns capture UI and evidence collection.
- Main owns reasoning, explanation, editable Twin clones and behaviour playback.
- Contracts owns shared schemas.
- Platform owns hosted services and shared infrastructure.
- Sandbox owns disposable UX experiments.

## Files

- `src/data.js` contains mocked Twin, evidence, ambiguity-review, editable clone and playback data.
- `src/data.js` also contains the sanitized spatial fixture used by the visual dollhouse smoke test.
- `src/model.js` contains pure state transitions used by tests.
- `src/app.js` renders the disposable prototype.
- `src/styles.css` contains the visual system.
- `tests/model.test.js` covers the important state guarantees.
- `server.mjs` is a tiny static server with SPA fallback.
