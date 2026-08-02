# Sandbox Visual Target

Daedalus Sandbox exists to test visual intent before Main implementation. It is disposable and must not become architectural authority.

## Target Feeling

The intended Main experience is a CAD/BIM-style living Place Twin:

- a recognisable dollhouse, captured-property model, public-building model, external route model or broader Place model fills the workspace;
- rooms, surfaces, routes and components are spatially meaningful;
- system overlays are clipped to captured geometry;
- the user inspects the Place by selecting real locations, surfaces, routes and objects;
- evidence, certainty and warnings attach to the object, route or surface they describe.

The UI should feel closer to an engineering workstation than an admin dashboard.

## Visual Projections

Sandbox should prove several projections over the same Place geometry.

### WiFi Twin

Show:

- router, access points, ONT/modem and switches in their real positions;
- wired and wireless backhaul routes;
- observed signal points;
- inferred coverage as heat-map overlays clipped to rooms;
- dead zones and obstructions attached to the relevant spatial areas.

Do not show WiFi as generic cards or a network graph.

### Heating Twin

Show:

- boiler, cylinder, pump, emitters, controls and primary routes in the house;
- flow and return routes as routed paths, not straight lines between nodes;
- active heat movement during playback;
- room temperatures and component states as overlays;
- bottlenecks highlighted in place.

Do not play unrelated systems in sequence. Heating playback must remain a coherent heating-system operation.

### Human Interaction Twin

Show:

- door clear widths;
- turning spaces;
- reach spaces;
- transfer spaces;
- thresholds, steps and constrained routes;
- navigation route through the captured geometry.

Human Interaction must not appear as a wheelchair, person or object charging through walls. Routes must respect room boundaries, openings, obstacles and profile-specific equipment constraints.

Human Interaction profiles may include wheelchair, stroller, luggage, reduced reach, low vision, family group or emergency evacuation contexts. Accessibility is one use case, not the whole layer.

## Routing Rule

Routes are part of the spatial model. They must not be straight lines between unrelated graph nodes unless that is the observed physical route.

Acceptable route sources include:

- observed pipe/cable/path evidence;
- manually tightened CAD-like route edits;
- RoomPlan wall/door/opening geometry;
- explicitly marked inferred route corridors.

Every route must carry:

- domain;
- source/evidence state;
- graph relationship;
- spatial path;
- uncertainty;
- contributor or origin where applicable.

## Tighten Must Be CAD-Like

Tighten is not a text review page.

When direct evidence is missing or ambiguous, Tighten should let the user correct the twin while looking at the relevant geometry.

Examples:

- draw or adjust an inferred pipe route;
- select which wall a route follows;
- mark an ONT as missing or add its location;
- choose between combination boiler, stored hot water, or unresolved hot-water source;
- move a component to the correct surface;
- attach a manual or transcript-derived fact to the correct room/component;
- mark a doorway, threshold or access constraint.

Ambiguities should appear as bounded questions with clear choices. If a manual spatial edit is needed, the question should open the relevant CAD-like tool.

## Clone Must Be CAD-Like

An editable clone should allow graph items to be added, removed, moved, resized, reclassified or reconnected within the Place model.

Examples:

- edit a boiler graph item while preserving its wall-local XYZ anchor;
- move an edited boiler on the selected wall plane;
- edit an emitter and show affected rooms/routes;
- add a router and inspect expected coverage consequences;
- widen a doorway in the editable clone and show route/access consequences.

The current Twin must remain unchanged. The editable clone records explicit graph/spatial changes.

## Graph Rule

The graph is implementation, not the normal interface.

Graphics are built from graph-backed components and relationships, but the user sees:

- dollhouse geometry;
- routes;
- surfaces;
- component icons/models;
- image labels;
- evidence callouts;
- animated overlays.

A raw graph can exist only as deep technical inspection.

## Sandbox Acceptance Criteria

The next useful Sandbox visual tranche should demonstrate:

1. One stable captured-Place/dollhouse view.
2. Three projections over the same geometry: WiFi, Heating and Human Interaction.
3. Routed paths that respect geometry instead of straight-line shortcuts.
4. A Heating playback that operates as one connected system.
5. A Tighten ambiguity that opens a spatial edit or bounded choice.
6. A Clone operation that edits or moves a graph item on the property.
7. Evidence and comments with real XYZ locations.
8. No fake behaviour presented as authoritative truth.
