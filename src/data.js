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
  note: "Sanitized Sandbox projection from bounded RoomPlan room captures. It demonstrates the visual model; it is not the production stitching engine.",
  rooms: [
    {
      id: "room-1",
      label: "Room 1",
      role: "Kitchen / plant area",
      path: "M116 148 L382 112 L424 286 L160 328 Z",
      artifacts: 3,
      confidence: "strong"
    },
    {
      id: "room-2",
      label: "Room 2",
      role: "Hall / circulation",
      path: "M383 112 L625 148 L592 324 L424 286 Z",
      artifacts: 1,
      confidence: "observed"
    },
    {
      id: "room-3",
      label: "Room 3",
      role: "Living space",
      path: "M160 328 L424 286 L458 514 L118 536 Z",
      artifacts: 2,
      confidence: "observed"
    },
    {
      id: "room-4",
      label: "Room 4",
      role: "Utility / service edge",
      path: "M424 286 L592 324 L548 502 L458 514 Z",
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
      x: 278,
      y: 212,
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
      x: 236,
      y: 430,
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
      x: 205,
      y: 248,
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
      x: 334,
      y: 270,
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
      x: 520,
      y: 218,
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
      x: 348,
      y: 462,
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
      x: 570,
      y: 188,
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
      x: 604,
      y: 300,
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
      x: 150,
      y: 500,
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
      x: 300,
      y: 172,
      state: "observed",
      confidence: "observed",
      summary: "Small-area LiDAR patch supplements RoomPlan where detailed geometry matters.",
      evidence: ["ARKit point cloud session"]
    }
  ],
  routes: [
    {
      id: "primary",
      domain: "heating",
      label: "Primary heat route",
      d: "M278 212 L360 212 L360 286 L424 286 L424 430 L236 430",
      componentIds: ["boiler", "emitter"],
      evidenceState: "candidate route"
    },
    {
      id: "water",
      domain: "water",
      label: "Hot/cold water evidence route",
      d: "M205 248 L205 286 L278 286 L278 212",
      componentIds: ["tap", "boiler"],
      evidenceState: "observed endpoints, inferred link"
    },
    {
      id: "power",
      domain: "electrical",
      label: "Electrical circuit evidence route",
      d: "M520 218 L520 270 L334 270",
      componentIds: ["consumer-unit", "socket"],
      evidenceState: "candidate relationship"
    },
    {
      id: "network",
      domain: "network",
      label: "Broadband/network path",
      d: "M570 188 L570 360 L348 360 L348 462",
      componentIds: ["broadband-entry", "router"],
      evidenceState: "candidate route corridor"
    },
    {
      id: "access",
      domain: "access",
      label: "Access route through captured spaces",
      d: "M604 300 L520 300 L520 420 L150 420 L150 500",
      componentIds: ["doorway", "threshold"],
      evidenceState: "observed openings, threshold unresolved"
    }
  ]
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
    title: "Cylinder type candidate",
    detail: "Hot-water source classification needs surveyor confirmation or preservation as candidate.",
    resolved: false,
    resolutions: [
      {
        id: "confirm",
        label: "Confirm as cylinder",
        result: "Confirmed as cylinder evidence for promotion."
      },
      {
        id: "keep-candidate",
        label: "Keep candidate",
        result: "Preserved as candidate; it remains visible but is not promoted as confirmed truth."
      },
      {
        id: "reject",
        label: "Reject",
        result: "Rejected from promotion because the evidence is not sufficient."
      }
    ]
  },
  {
    id: "unknown-occupancy",
    type: "unknown",
    title: "Occupancy and usage missing",
    detail: "Home context is not complete until transcript questions are answered or marked unknown.",
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
    id: "boiler-output",
    className: "changed",
    title: "Boiler output",
    current: "24 kW",
    proposed: "35 kW",
    result: "Changed assumption in proposed Twin only."
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
    state: "Hall thermostat calls for heat.",
    active: "controls",
    bottleneck: null
  },
  {
    time: "00:03",
    title: "Boiler fires",
    state: "Proposed 35 kW boiler output is available at source.",
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
    active: "heat-loss",
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
