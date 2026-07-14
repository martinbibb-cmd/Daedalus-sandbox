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
    resolved: false
  },
  {
    id: "unknown-occupancy",
    type: "unknown",
    title: "Occupancy and usage missing",
    detail: "Home context is not complete until transcript questions are answered or marked unknown.",
    resolved: false
  },
  {
    id: "conflict-boiler-space",
    type: "conflict",
    title: "Boiler clearance conflicts with cupboard geometry",
    detail: "Proposed object evidence conflicts with captured wall/cupboard geometry.",
    resolved: false
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
