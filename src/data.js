export const property = {
  id: "property-haven",
  name: "Haven",
  address: "Hundred Lane, Lymington, SO41 5RG",
  type: "Detached house",
  lastSync: "Today 18:45"
};

export const authoritativeTwin = {
  id: "twin-haven-current-v1",
  label: "Authoritative Twin",
  authority: "current",
  version: 1,
  dimensions: {
    house: {
      summary: "Four captured rooms with strong kitchen and hall geometry.",
      facts: ["4 bounded rooms", "Kitchen and hall geometry strong", "Utility classification candidate"]
    },
    system: {
      summary: "Heating system observed with boiler, primary pipework and basic controls.",
      facts: ["Heat source observed", "Primary pipework candidate 22 mm", "Controls evidence incomplete"]
    },
    home: {
      summary: "Occupancy, usage and performance context still needs transcript evidence.",
      facts: ["Usage unknown", "Comfort priorities unknown", "Performance complaints not imported"]
    }
  },
  nodes: {
    property: {
      id: "property",
      type: "property",
      name: "Haven",
      status: "authoritative reality",
      summary: "Combined House, System and Home Twin for the property."
    },
    heating: {
      id: "heating",
      type: "system",
      name: "Heating system",
      status: "observed with unresolved controls evidence",
      summary: "Gas boiler feeding primary pipework, controls and emitter branches.",
      facts: [
        { label: "Heat loss evidence", value: "18 kW candidate design load", state: "candidate" },
        { label: "Primary pipework", value: "22 mm candidate trunk", state: "candidate" },
        { label: "Controls", value: "basic programmer observed, zoning unknown", state: "unknown" }
      ],
      children: ["boiler", "primary-pipework", "controls", "heat-loss"]
    },
    boiler: {
      id: "boiler",
      type: "component",
      name: "Existing gas boiler",
      status: "confirmed observed component",
      outputKw: 24,
      summary: "Observed heat source connected to the heating primary circuit.",
      facts: [
        { label: "Declared output", value: "24 kW", state: "declared" },
        { label: "Photo evidence", value: "boiler-photo-001", state: "confirmed" },
        { label: "RoomPlan context", value: "kitchen wall geometry", state: "observed" }
      ],
      children: ["boiler-evidence"]
    },
    "primary-pipework": {
      id: "primary-pipework",
      type: "relationship",
      name: "Primary pipework",
      status: "candidate constraint",
      summary: "Candidate 22 mm primary pipework may limit useful delivered output.",
      facts: [{ label: "Pipework size", value: "22 mm candidate", state: "candidate" }]
    },
    controls: {
      id: "controls",
      type: "relationship",
      name: "Controls",
      status: "uncertain",
      summary: "Controls and zoning are not sufficiently evidenced.",
      facts: [{ label: "Zoning", value: "unknown", state: "unknown" }]
    },
    "heat-loss": {
      id: "heat-loss",
      type: "analysis",
      name: "Heat-loss relationship",
      status: "candidate analysis",
      summary: "Current heat-loss evidence does not change when boiler output is changed.",
      facts: [{ label: "Candidate heat loss", value: "18 kW", state: "candidate" }]
    },
    "boiler-evidence": {
      id: "boiler-evidence",
      type: "evidence",
      name: "Boiler evidence",
      status: "structured provenance",
      summary: "Evidence supporting the current boiler facts.",
      evidence: [
        {
          kind: "observation",
          title: "Surveyor observed wall-hung boiler",
          state: "confirmed",
          provenance: "Capture photo bundle, Room 1"
        },
        {
          kind: "manual measurement",
          title: "Approximate installation height",
          state: "candidate",
          provenance: "ARKit proposed-position measurement"
        },
        {
          kind: "captured geometry",
          title: "Kitchen wall and surrounding surfaces",
          state: "observed",
          provenance: "RoomPlan CapturedRoom artifact"
        },
        {
          kind: "photo reference",
          title: "photo-evidence-2026-07-10T18-01-10.315Z.jpg",
          state: "confirmed",
          provenance: "Capture handoff bundle"
        },
        {
          kind: "declared information",
          title: "Nominal 24 kW existing output",
          state: "declared",
          provenance: "surveyor-declared candidate fact"
        },
        {
          kind: "conflict",
          title: "Controls evidence is incomplete",
          state: "unknown",
          provenance: "no transcript answer imported yet"
        }
      ]
    }
  }
};

export const spatialFixture = {
  source: "Capture v2 RoomPlan session summary, 2026-07-10T09:38:24.242Z",
  captureId: "daedalus-roomplan-session-2026-07-10T09-38-24.242Z",
  note: "Design-intent fixture: graph-backed components projected onto one wireframe Place view with customer-readable labels. This is not production RoomPlan stitching.",
  rooms: [
    {
      id: "room-1",
      label: "Room 1",
      role: "Kitchen / plant area",
      path: "M96 92 L366 92 L366 292 L96 292 Z",
      artifacts: 3,
      confidence: "strong"
    },
    {
      id: "room-2",
      label: "Room 2",
      role: "Hall / circulation",
      path: "M366 92 L644 92 L644 292 L366 292 Z",
      artifacts: 1,
      confidence: "observed"
    },
    {
      id: "room-3",
      label: "Room 3",
      role: "Living space",
      path: "M96 292 L366 292 L366 532 L96 532 Z",
      artifacts: 2,
      confidence: "observed"
    },
    {
      id: "room-4",
      label: "Room 4",
      role: "Utility / service edge",
      path: "M366 292 L644 292 L644 532 L366 532 Z",
      artifacts: 2,
      confidence: "observed"
    }
  ],
  layers: [
    { id: "all", label: "All" },
    { id: "heating", label: "Heat" },
    { id: "water", label: "Water" },
    { id: "electrical", label: "Power" },
    { id: "network", label: "Network" },
    { id: "access", label: "Access" },
    { id: "evidence", label: "Evidence" }
  ],
  components: [
    {
      id: "boiler",
      label: "Boiler",
      domain: "heating",
      roomId: "room-1",
      x: 300,
      y: 170,
      position: { x: 3.4, y: 1.55, z: 0.12, unit: "m", reference: "room-1 wall-local" },
      state: "observed",
      confidence: "confirmed",
      summary: "Observed wall-hung heat source attached to RoomPlan and photo evidence.",
      evidence: ["RoomPlan CapturedRoom", "photo evidence", "surveyor observation"]
    },
    {
      id: "emitter",
      label: "Emitter",
      domain: "heating",
      roomId: "room-3",
      x: 210,
      y: 438,
      position: { x: 1.3, y: 0.62, z: 0.09, unit: "m", reference: "room-3 wall-local" },
      state: "candidate",
      confidence: "candidate",
      summary: "Emitter position captured as specialist heating evidence.",
      evidence: ["semantic tag", "photo evidence"]
    },
    {
      id: "tap",
      label: "Tap",
      domain: "water",
      roomId: "room-1",
      x: 158,
      y: 235,
      position: { x: 0.9, y: 0.94, z: 0.62, unit: "m", reference: "room-1 worktop-local" },
      state: "observed",
      confidence: "observed",
      summary: "Water outlet connected to the wider hot/cold water evidence layer.",
      evidence: ["photo evidence", "component tag"]
    },
    {
      id: "socket",
      label: "Socket",
      domain: "electrical",
      roomId: "room-1",
      x: 326,
      y: 246,
      position: { x: 3.9, y: 1.05, z: 0.05, unit: "m", reference: "room-1 wall-local" },
      state: "observed",
      confidence: "observed",
      summary: "Electrical accessory captured spatially; circuit relationship remains unknown.",
      evidence: ["semantic tag", "photo evidence"]
    },
    {
      id: "consumer-unit",
      label: "Consumer unit",
      domain: "electrical",
      roomId: "room-2",
      x: 568,
      y: 170,
      position: { x: 2.1, y: 1.65, z: 0.12, unit: "m", reference: "room-2 wall-local" },
      state: "candidate",
      confidence: "candidate",
      summary: "Candidate electrical supply component. Circuit claims are not authoritative yet.",
      evidence: ["surveyor statement"]
    },
    {
      id: "router",
      label: "Router",
      domain: "network",
      roomId: "room-3",
      x: 310,
      y: 474,
      position: { x: 2.8, y: 0.35, z: 0.48, unit: "m", reference: "room-3 shelf-local" },
      state: "observed",
      confidence: "observed",
      summary: "Network equipment location captured as part of the broader property twin.",
      evidence: ["photo evidence", "network tag"]
    },
    {
      id: "broadband-entry",
      label: "Broadband entry",
      domain: "network",
      roomId: "room-2",
      x: 604,
      y: 142,
      position: { x: 2.6, y: 1.9, z: 0.03, unit: "m", reference: "room-2 external-wall-local" },
      state: "candidate",
      confidence: "candidate",
      summary: "Candidate communications entry point. Route is shown as a candidate relationship, not an observed cable run.",
      evidence: ["network tag", "surveyor statement"]
    },
    {
      id: "doorway",
      label: "Doorway",
      domain: "access",
      roomId: "room-2",
      x: 644,
      y: 292,
      position: { x: 3.1, y: 0, z: 0, unit: "m", reference: "room-2 opening-local" },
      state: "observed",
      confidence: "observed",
      summary: "Access opening and circulation constraint attached to the spatial model.",
      evidence: ["RoomPlan opening", "access tag"]
    },
    {
      id: "threshold",
      label: "Threshold",
      domain: "access",
      roomId: "room-3",
      x: 96,
      y: 500,
      position: { x: 0, y: 0.02, z: 0, unit: "m", reference: "room-3 floor-local" },
      state: "unknown",
      confidence: "needs measurement",
      summary: "Access detail needs refinement before it can become authoritative.",
      evidence: ["manual follow-up required"]
    },
    {
      id: "point-cloud",
      label: "Detail patch",
      domain: "evidence",
      roomId: "room-1",
      x: 264,
      y: 126,
      position: { x: 2.8, y: 1.72, z: 0.68, unit: "m", reference: "room-1 detail-patch-local" },
      state: "observed",
      confidence: "observed",
      summary: "Small-area LiDAR patch supplements RoomPlan where detailed geometry matters.",
      evidence: ["ARKit point cloud session"]
    }
  ],
  comments: [
    {
      id: "comment-boiler-photo",
      targetId: "boiler",
      label: "photo",
      text: "Boiler image anchored to wall position.",
      x: 246,
      y: 120,
      position: { x: 3.4, y: 1.55, z: 0.12, unit: "m", reference: "boiler graph node" }
    },
    {
      id: "comment-route-candidate",
      targetId: "primary",
      label: "candidate route",
      text: "Pipe route is graph relationship evidence, not confirmed visible pipe.",
      x: 338,
      y: 344,
      position: { x: 2.6, y: 0.35, z: 0.08, unit: "m", reference: "primary relationship midpoint" }
    },
    {
      id: "comment-network-ont",
      targetId: "broadband-entry",
      label: "ONT?",
      text: "Broadband entry needs bounded review before fibre is asserted.",
      x: 628,
      y: 106,
      position: { x: 2.6, y: 1.9, z: 0.03, unit: "m", reference: "broadband entry graph node" }
    }
  ],
  routes: [
    {
      id: "primary",
      domain: "heating",
      label: "Primary heat route",
      d: "M300 170 L300 292 L300 438 L210 438",
      componentIds: ["boiler", "emitter"],
      evidenceState: "candidate route"
    },
    {
      id: "water",
      domain: "water",
      label: "Hot/cold water evidence route",
      d: "M158 235 L158 292 L300 292 L300 170",
      componentIds: ["tap", "boiler"],
      evidenceState: "observed endpoints, inferred link"
    },
    {
      id: "power",
      domain: "electrical",
      label: "Electrical circuit evidence route",
      d: "M568 170 L568 246 L326 246",
      componentIds: ["consumer-unit", "socket"],
      evidenceState: "candidate relationship"
    },
    {
      id: "network",
      domain: "network",
      label: "Broadband/network path",
      d: "M604 142 L604 474 L310 474",
      componentIds: ["broadband-entry", "router"],
      evidenceState: "candidate route corridor"
    },
    {
      id: "access",
      domain: "access",
      label: "Access route through captured spaces",
      d: "M644 292 L366 292 L366 500 L96 500",
      componentIds: ["doorway", "threshold"],
      evidenceState: "observed openings, threshold unresolved"
    }
  ]
};

export const replacementBoiler = {
  id: "boiler",
  type: "component",
  name: "Replacement boiler candidate",
  status: "clone edit",
  outputKw: 35,
  editedFrom: "Existing gas boiler",
  summary: "The clone edits the boiler graph item while retaining its spatial anchor and evidence boundary.",
  position: { x: 3.4, y: 1.55, z: 0.12, unit: "m", reference: "room-1 wall-local" },
  facts: [
    { label: "Proposed output", value: "35 kW", state: "proposed" },
    { label: "Spatial anchor", value: "same wall-local XYZ as current boiler", state: "preserved" },
    { label: "Authority", value: "clone only; current reality unchanged", state: "boundary" }
  ],
  children: ["boiler-evidence"]
};

export const importReviewItems = [
  {
    id: "confirmed-boiler",
    type: "confirmed",
    title: "Boiler photo attached",
    detail: "Observed heat-source photo is present and linked to RoomPlan context.",
    resolved: true
  },
  {
    id: "candidate-cylinder",
    type: "candidate",
    title: "Hot-water source ambiguity",
    question: "Your notes mention both a combination boiler and a cylinder. Which state should the Twin preserve?",
    detail: "This must resolve as a bounded choice. Do not promote both as confirmed truth.",
    resolved: false,
    resolutions: [
      {
        id: "combi-with-cylinder",
        label: "Combination boiler with cylinder",
        result: "Preserve both as a declared arrangement and ask which outlets are served on demand.",
        followUp: "Which taps/outlets are served on demand by the combination boiler?"
      },
      {
        id: "changed-boiler-type",
        label: "Changed boiler type",
        result: "Keep the cylinder unresolved and mark the boiler type as needing correction before promotion."
      },
      {
        id: "remove-cylinder",
        label: "Remove cylinder",
        result: "Reject the cylinder candidate and keep hot water as on-demand unless later evidence contradicts it."
      }
    ]
  },
  {
    id: "network-no-ont",
    type: "candidate",
    title: "Broadband route without ONT",
    question: "You tagged a communications route but no fibre ONT was captured. Please confirm this is not a fibre connection.",
    detail: "Networking evidence needs a clear boundary between broadband entry, router, ONT and inferred route.",
    resolved: false,
    resolutions: [
      {
        id: "not-fibre",
        label: "Not fibre",
        result: "Preserve the route as non-fibre communications evidence; do not create an ONT component."
      },
      {
        id: "ont-missing",
        label: "ONT missing from capture",
        result: "Create a follow-up for ONT location and keep the fibre connection unresolved."
      },
      {
        id: "route-mistagged",
        label: "Route was mistagged",
        result: "Reject the network route candidate and keep only observed router evidence."
      }
    ]
  },
  {
    id: "unknown-occupancy",
    type: "unknown",
    title: "Occupancy and usage missing",
    question: "No transcript answer exists for occupancy, usage or performance context. How should Main carry this into the Twin?",
    detail: "The Home layer must not invent usage facts. It can preserve unknowns or create a follow-up question.",
    resolved: false,
    resolutions: [
      {
        id: "ask-later",
        label: "Add follow-up",
        result: "Converted to a follow-up question for the next Capture or review session."
      },
      {
        id: "mark-unknown",
        label: "Keep unknown",
        result: "Preserved as explicit unknown; no usage fact will be promoted."
      }
    ]
  },
  {
    id: "conflict-boiler-space",
    type: "conflict",
    title: "Boiler clearance conflicts with cupboard geometry",
    question: "The proposed boiler clearance intersects captured cupboard geometry. Which evidence boundary should remain authoritative?",
    detail: "Proposed object evidence conflicts with captured wall/cupboard geometry.",
    resolved: false,
    resolutions: [
      {
        id: "flag-surveyor",
        label: "Flag review",
        result: "Conflict preserved and flagged for surveyor review before use."
      },
      {
        id: "prefer-roomplan",
        label: "Use RoomPlan geometry",
        result: "RoomPlan geometry retained as current reality; proposed object stays separate."
      }
    ]
  }
];

export const proposedBoilerConsequences = [
  {
    id: "boiler-edit",
    className: "changed",
    title: "Graph item edited",
    current: "Existing gas boiler",
    proposed: "Replacement boiler candidate",
    result: "The clone edits the boiler graph node while preserving the current Twin."
  },
  {
    id: "primary-pipework-limit",
    className: "constraint",
    title: "Primary pipework",
    current: "Candidate 22 mm",
    proposed: "Modelled as limiting useful delivered output.",
    result: "Increasing output may achieve nothing unless primary distribution also changes."
  },
  {
    id: "controls-limit",
    className: "constraint",
    title: "Controls",
    current: "Zoning unknown",
    proposed: "Control strategy limits useful modulation and room response.",
    result: "Controls evidence must be tightened before treating behaviour as reliable."
  },
  {
    id: "heat-loss-unchanged",
    className: "unchanged",
    title: "Heat-loss evidence",
    current: "18 kW candidate",
    proposed: "Unchanged",
    result: "A larger boiler does not alter the property heat-loss evidence."
  },
  {
    id: "additional-work",
    className: "work",
    title: "Additional work highlighted",
    current: "No current assertion",
    proposed: "Primary/controls work required for the proposed state to operate as described.",
    result: "This is a consequence, not a product recommendation."
  }
];

export const runTimeline = [
  {
    time: "00:00",
    title: "Demand starts",
    state: "Heating demand starts in the current/proposed heating system.",
    active: "heating-demand",
    bottleneck: null
  },
  {
    time: "00:03",
    title: "Boiler fires",
    state: "The edited boiler node is active in the clone.",
    active: "boiler",
    bottleneck: null
  },
  {
    time: "00:08",
    title: "Primary flow rises",
    state: "Primary pipework begins carrying heat to the distribution circuit.",
    active: "primary-pipework",
    bottleneck: null
  },
  {
    time: "00:14",
    title: "Pipework constraint",
    state: "Candidate 22 mm primary pipework reaches the modelled useful delivery limit.",
    active: "primary-pipework",
    bottleneck: "primary-pipework"
  },
  {
    time: "00:22",
    title: "Useful output plateaus",
    state: "More boiler output is not translated into useful room response without related system changes.",
    active: "emitter-response",
    bottleneck: "controls"
  }
];

export const explanationText = {
  plain: {
    title: "Plain language",
    body: "The boiler is the current heat source. It connects to primary pipework and controls. The evidence supports its presence, but pipework size and controls remain partly uncertain."
  },
  technical: {
    title: "Technical detail",
    body: "The selected component is a heat-source node linked to primary-pipework, controls and heat-loss relationships. Its observed evidence is stronger than the controls evidence, so downstream conclusions remain candidate."
  },
  flow: {
    title: "Visual flow",
    body: "Demand -> controls -> boiler firing -> primary pipework -> emitters -> rooms. The candidate bottleneck is between boiler output and useful distribution."
  },
  evidence: {
    title: "Evidence trail",
    body: "Photo evidence and RoomPlan geometry support the boiler location. Declared output is surveyor-declared. Controls and occupancy evidence still need tightening."
  }
};

export const captureDemo = {
  rooms: ["Kitchen", "Hall", "Lounge", "Utility"],
  tagGroups: [
    { label: "Heat", icon: "heat", items: ["Gas", "Electric", "LPG", "Oil", "Heat Pump"] },
    { label: "Hot Water", icon: "drop", items: ["On demand", "Unvented", "Open vented", "Thermal store", "Community"] },
    { label: "Electrical", icon: "bolt", items: ["Consumer unit", "Isolator", "Loop test", "RCD", "Supply"] },
    { label: "Meters", icon: "meter", items: ["Gas meter", "Electric meter", "Water meter", "Heat meter"] },
    { label: "Emitter", icon: "thermometer", items: ["Radiator", "TRV", "UFH", "Fan coil"] },
    { label: "Note", icon: "note", items: ["Occupancy", "Usage", "Performance", "Access", "Risk"] }
  ]
};
