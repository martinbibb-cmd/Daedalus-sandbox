# Codex Prompt — Daedalus Place Twin Visual Prototype v0.1

Use the following prompt in Codex from the `Daedalus-sandbox` repository.

---

You are working in the Daedalus Sandbox repository.

## Read first

Read these files completely before making changes:

- `docs/DAEDALUS_VISUAL_LANGUAGE_v0.1.md`
- `docs/DAEDALUS_PLACE_AND_HUMAN_INTERACTION_v0.1.md`
- `docs/SANDBOX_VISUAL_TARGET.md`
- `docs/MAIN_SCREEN_MOCKUPS_PLAN_v0.1.md` if present
- the current Sandbox README and existing visual prototype code

Also inspect the current application, its routes, assets, tests and build commands before deciding what to preserve.

## Goal

Create a high-fidelity Sandbox visual prototype that proves the Daedalus spatial design language over one shared multi-storey Place Twin.

The prototype must demonstrate three projections over the same recognisable place:

1. Wi-Fi / cellular coverage;
2. heating / thermal behaviour;
3. Human Interaction.

Human Interaction must support more than wheelchairs. Include profile examples for:

- manual wheelchair;
- crutches;
- stroller or wagon;
- low vision or blind navigation;
- a combined family/equipment profile.

## Non-negotiable visual direction

The place is the interface.

The recognisable 3D or convincingly spatial Place Twin must dominate the viewport. The UI is secondary.

Target feeling:

- CAD/BIM engineering workstation;
- calm architectural visualisation;
- premium and technical;
- spatial before textual;
- evidence-led.

Do not produce:

- dashboards made from cards;
- skewed rectangles or triangles presented as 3D floors;
- fake isometric floor-plan stacks;
- random lines not grounded in routes or geometry;
- detached node graphs or flowcharts;
- black gaming-HUD layouts;
- neon cyan/orange/purple product themes;
- separate branded apps for each system;
- placeholder controls;
- untraceable UI-owned facts.

## Shared Place Twin

Use one consistent multi-storey place with:

- recognisable storeys;
- rooms;
- walls with thickness;
- doors and openings;
- stairs;
- at least one lift or ramp dependency;
- external entrance/path context;
- furniture or obstacles relevant to navigation;
- plant/services in credible physical locations;
- vertical risers or routes between storeys.

All three projections must use the same geometry, camera language, materials, lighting, navigation and inspector structure.

If an existing real RoomPlan or 3D asset is available in the repository, prefer it. Do not infer or stitch unrelated scans without a declared shared coordinate transform.

If no suitable 3D asset exists, create the minimum credible spatial model necessary for the prototype using the repository's existing rendering stack. Do not fake depth by skewing 2D rectangles.

## Base visual language

Use a calm, materially readable architectural palette:

- warm off-white plaster;
- stone/concrete greys;
- muted timber;
- restrained metal and glass;
- subtle environmental lighting;
- charcoal only where needed for UI contrast.

System colour is an overlay, not the application theme.

Use restrained semantic colour:

- selected object: one consistent Daedalus accent;
- heating flow: muted warm coral/vermilion;
- heating return: restrained cool blue;
- Wi-Fi/cellular: one continuous analytical scale;
- traversable Human Interaction route: restrained teal/blue;
- constrained/detour: amber;
- blocked/conflict: red;
- unknown/evidence needed: neutral grey or pattern;
- inferred: ghosted, broken or reduced-opacity treatment;
- proposed and simulated states visually distinct from Current.

Do not invent a rainbow heatmap.

## Workspace anatomy

The Place Twin should occupy roughly 70–85% of useful screen area.

Implement:

- compact top bar for place identity, Authoritative Twin state/version and active projection;
- compact layer/spatial rail;
- contextual right inspector that changes with direct selection;
- timeline only when demonstrating real or mocked Run behaviour over time;
- direct spatial selection as the primary navigation method;
- storey isolation or sectional view that preserves vertical context;
- normal orbit/pan/zoom gestures rather than decorative buttons.

Every visible control must change selection, navigation, rendered information, profile, evidence view or simulated state.

## Projection 1 — Wi-Fi / cellular

Show:

- router, ONT, mesh/AP nodes and backhaul in real locations;
- coverage clipped to the building and affected by walls/floors;
- vertical propagation between storeys;
- measured evidence points distinct from inferred coverage;
- weak/dead areas and uncertainty;
- a selected point inspector showing source, evidence, confidence and obstruction/path context;
- cellular as a selectable provider/band projection if the model supports it.

Avoid circular marketing range bubbles.

## Projection 2 — Heating / thermal

Show:

- heat source, cylinder if present, controls, emitters and credible routes;
- flow and return through the actual place;
- selected emitter highlighting its serving path;
- room hot/cold spots or modelled thermal surfaces;
- inferred or unknown routes visibly distinct;
- a grounded bottleneck or constraint attached to the component or route causing it;
- an optional short Run timeline only if the visual state actually changes over time.

Avoid detached Sankey or schematic diagrams as the normal view.

## Projection 3 — Human Interaction

Implement selectable capability profiles.

At minimum demonstrate:

- manual wheelchair;
- crutches;
- stroller/wagon;
- low vision or blind navigation;
- combined family/equipment profile.

Each profile must alter relevant parameters rather than merely changing a label.

Possible parameters:

- width/length envelope;
- turning radius;
- step or threshold tolerance;
- gradient/effort constraint;
- door-opening force;
- reach envelope;
- required rest distance;
- lighting/contrast requirement;
- noise/sensory avoidance;
- equipment dimensions.

Route outcomes:

- reachable;
- constrained;
- blocked;
- unknown;
- temporarily unavailable.

Show:

- route through the 3D place;
- extra distance compared with the direct route;
- narrowest verified clearance;
- first blocking object or condition;
- lift/ramp/stair dependency;
- hot, cold, noisy, dark, glare or poor-signal areas where relevant to the selected profile;
- evidence and uncertainty attached to the exact route location.

A blind/low-vision projection should consider perceivable route features such as contrast, lighting, tactile/edge cues, signage certainty and hazards. Do not reduce visual impairment to a dark screen filter.

A crutches profile should consider steps, hand support, door operation, distance, rest points, slippery surfaces and carrying limitations.

A stroller/wagon profile should consider width, turning, thresholds, lift dimensions, gradients and route detours.

## Public Place page concept

Include one public-facing prototype state for a venue badge page.

Opening question:

> What are you bringing, and what matters to you?

Allow a visitor to choose a profile/equipment and a destination, then show:

- route animation;
- total distance;
- extra distance versus direct route;
- constraints;
- environmental conditions;
- current operational changes;
- evidence/unknowns;
- share/save affordance.

Badge wording must communicate evidence-backed transparency, not universal suitability.

Suggested statement:

> This place publishes a transparent, evidence-backed Twin that visitors can test against their own needs and equipment.

## Data and truth boundaries

All prototype data may be mocked, but structure it so the UI never becomes the source of truth.

Each visible claim should carry or be able to expose:

- state: observed, inferred, confirmed, unknown, proposed or simulated;
- evidence reference;
- provenance/origin;
- confidence or uncertainty.

Do not implement product recommendations, venue rankings, suitability scoring, pricing or quoting.

## Implementation approach

1. Inspect the current stack and run existing tests/builds.
2. Write a brief implementation plan in the repository before coding.
3. Preserve useful existing infrastructure, but remove or replace rejected visual prototype code where necessary.
4. Build incrementally.
5. Add tests for state/layer/profile behaviour and current/proposed/unknown boundaries where practical.
6. Capture screenshots of each target state for review.
7. Document what is real, mocked, inferred and deferred.

## Required review outputs

Provide screenshots for:

1. shared default Place Twin;
2. Wi-Fi/cellular projection;
3. heating/thermal projection;
4. Human Interaction — wheelchair;
5. Human Interaction — crutches;
6. Human Interaction — stroller/wagon or family profile;
7. Human Interaction — low vision/blind route;
8. public Daedalus Place badge page.

Before claiming completion, explicitly verify:

- the place is recognisable;
- multi-storey relationships are real and visible;
- no screen resembles a generic dashboard;
- no fake 3D triangles/skewed floor cards remain;
- colour is restrained and semantic;
- the same Twin is used across projections;
- evidence and uncertainty remain visible;
- Human Interaction is not wheelchair-only.

Stop and report rather than inventing unsupported geometry, schemas, legal compliance claims or false evidence.

---