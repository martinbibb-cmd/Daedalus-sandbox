# Daedalus Visual Language v0.1

## Status

Sandbox-first visual direction for Daedalus Main and future Daedalus Places work.

This document defines how Daedalus should look and behave visually. It does not change the product constitution, evidence boundaries, Authoritative Twin model, or explanation-only boundary.

## Prime visual rule

**The place is the interface.**

A recognisable spatial Twin must dominate the workspace. Interface chrome, lists, cards, inspectors and controls are secondary and contextual.

Daedalus should feel closer to a CAD/BIM engineering workstation than an administration dashboard.

## Core visual character

- calm;
- architectural;
- premium but not decorative;
- technical without becoming schematic;
- evidence-led;
- spatial before textual;
- neutral until a state or system needs emphasis.

Do not use generic dashboard aesthetics, gaming HUD treatments, neon palettes, fake isometric geometry, or trade-specific branded screens.

## Spatial hierarchy

The graphic Twin should occupy approximately 70–85% of the useful workspace.

The normal view is a true perspective or orthographic dollhouse, sectional building, room model, captured-property model, site model, or component close-up.

The spatial model must preserve:

- storeys and vertical relationships;
- wall thickness, openings, doors and thresholds;
- stairs, lifts, ramps and shafts;
- rooms and circulation space;
- external paths and site context where relevant;
- components in their physical locations;
- routes through and between storeys;
- evidence attached to real locations.

Do not represent a multi-storey place as unrelated flat floor plans, stacked skewed rectangles, sloping polygons, or floating room boxes.

## Camera and navigation

Normal spatial interaction should use direct manipulation:

- drag background to orbit;
- secondary drag or gesture to pan;
- scroll or pinch to zoom;
- select an object, surface, room, route or location directly;
- use contextual drill-down to move from place to system to component to fact to evidence;
- isolate a storey while preserving its relationship to vertical routes and the rest of the place;
- use sectional cuts or exploded storeys only when they reveal materially useful information.

Zoom is contextual traversal, not a decorative global button row.

## One Twin, many projections

Heating, water, electrical, communications, accessibility, environmental conditions, evidence and proposed state are projections over one shared Twin.

They must share:

- the same geometry;
- the same camera and lighting;
- the same interface structure;
- the same typography;
- the same evidence and uncertainty language;
- the same selection behaviour.

A layer may highlight different facts, routes, surfaces or conditions. It must not turn the product into a separately branded application.

## Base material palette

The place should remain materially recognisable.

Preferred base character:

- warm off-white plaster and painted surfaces;
- soft stone and concrete greys;
- muted natural timber;
- restrained metal and glass;
- desaturated roof and external materials;
- subtle environmental lighting;
- charcoal used sparingly for contrast and controls.

Avoid pure-black voids that reduce the property to outlines. Avoid dominant green, neon cyan, electric purple, bright orange or other system-wide colour treatments.

## Semantic colour language

Colour communicates state or a selected system, not product identity.

Exact tokens remain to be approved. The semantic structure is:

- selected/focused object: one consistent Daedalus selection accent;
- observed/confirmed: restrained positive or neutral-confirmed treatment;
- inferred: reduced opacity, broken edge, soft pattern or ghosted treatment;
- unknown/evidence needed: neutral grey, hatching or explicit uncertainty marker;
- candidate: restrained blue or violet semantic marker;
- warning/constraint: amber;
- blocked/conflict/unsafe state: red;
- proposed: visually distinct from Current without overwriting it;
- simulated: visually distinct from observed, inferred, confirmed and proposed.

System overlays should be limited and spatially clipped:

- heating flow: muted warm coral or vermilion;
- heating return: restrained cool blue;
- Wi-Fi/cellular: a continuous analytical field rather than marketing circles or rainbow bands;
- traversable human route: restrained teal or blue;
- constraint or detour: amber;
- blocked route: red;
- unknown route: grey/patterned.

## Typography

No brand typeface is yet frozen.

Prototype rules:

- use a neutral, highly legible technical sans-serif;
- prefer sentence case;
- avoid futuristic, condensed or mission-control display fonts;
- use tabular numerals for dimensions, signal readings, temperatures, distances and times;
- maintain a small, disciplined set of weights and sizes;
- keep labels readable against complex spatial content.

Inter or the platform system font is acceptable for Sandbox prototypes until a brand typeface is approved.

## Interface anatomy

### Top bar

May contain:

- place identity;
- Authoritative Twin version;
- Current or Proposed state;
- active projection/layer;
- search;
- unresolved evidence count;
- public/private or operational-state indicator where relevant.

### Spatial/layer rail

A compact rail may expose projections such as:

- House / Place;
- Heating;
- Water;
- Electrical;
- Communications;
- Human Interaction;
- Environmental Conditions;
- Evidence.

The rail must not dominate the canvas.

### Contextual inspector

The inspector opens or changes because something spatial is selected.

It may show:

- identity;
- observed, inferred, confirmed, unknown, proposed or simulated state;
- measurements;
- relationships;
- evidence;
- provenance;
- uncertainty;
- contributor or origin;
- contextual Explain, Refine, What If or Run actions.

### Timeline

A timeline appears only when real or simulated behaviour progresses through time. Do not show a permanent fake timeline.

## Evidence and uncertainty

Evidence must remain attached to the object, route, surface or location it supports.

Use:

- spatial evidence pins;
- image labels;
- selected evidence previews;
- ghosted inferred routes;
- patterned unknown volumes or surfaces;
- visible confidence/state markers;
- contributor/origin labels where relevant.

The graphic may simplify presentation but must not invent alignment, geometry, route continuity or certainty.

## Prohibited visual patterns

Do not produce:

- skewed rectangles or triangles presented as 3D floors;
- random lines that do not follow grounded routes;
- floating room boxes;
- detached system schematics as the normal interface;
- separate colour-branded dashboards for each trade;
- node-and-edge graphs as routine user screens;
- panels that visually outweigh the Twin;
- placeholder controls with no real behaviour;
- generic admin dashboards;
- rainbow heatmaps where one restrained analytical scale will do;
- UI-owned truth that is not traceable to the Twin.

## Approval rule

Any future Figma mock-up must first demonstrate:

1. a recognisable multi-storey place;
2. a credible spatial camera and sectional treatment;
3. one shared visual language across projections;
4. evidence and uncertainty attached in place;
5. the Twin remaining dominant over interface chrome.

If those conditions are not met, stop before polishing secondary UI.