export const property = {
  name: "Haven",
  address: "Hundred Lane, Lymington, SO41 5RG",
  type: "Detached house",
  period: "1900-1930",
  status: "Capture imported",
  roomsCaptured: 4,
  evidenceItems: 38,
  proposedItems: 7,
  unknowns: 5,
  lastSync: "Today 18:45"
};

export const mainModel = {
  summary:
    "Main receives a Capture Package, preserves provenance, separates confirmed evidence from candidates, and explains what the property evidence means.",
  facts: [
    ["Observed", "RoomPlan captured 4 bounded rooms"],
    ["Observed", "Boiler location recorded as proposed/declared evidence"],
    ["Candidate", "Kitchen appears to contain primary heating plant"],
    ["Unknown", "Cylinder type not confirmed"],
    ["Conflict", "One proposed appliance overlaps existing cupboard geometry"]
  ],
  commands: [
    {
      name: "House Command",
      state: "Ready",
      text: "Room geometry, openings and captured spaces are available for inspection."
    },
    {
      name: "Systems Command",
      state: "Candidate evidence",
      text: "Heat source, hot water and electrical observations are present but not confirmed truth."
    },
    {
      name: "Home Command",
      state: "Needs transcript",
      text: "Occupancy, usage and performance context are not yet complete."
    },
    {
      name: "Safety Command",
      state: "Watchlist",
      text: "Safety observations are preserved separately from recommendations."
    }
  ],
  questions: [
    "What do we know about the heating system?",
    "Which rooms are captured with enough evidence?",
    "What is still unknown before Main can reason confidently?",
    "Which proposed changes are not confirmed reality?"
  ],
  scenarios: [
    ["Replace boiler", "Uses proposed object evidence but does not treat it as installed."],
    ["Improve hot water", "Blocked until cylinder type and occupancy demand are known."],
    ["Review room evidence", "Shows geometry, photos and candidate observations by provenance."]
  ]
};

export const captureDemo = {
  sessionId: "capture-flight-2026-07-14",
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

export const measurements = [
  {
    group: "Water",
    accent: "cyan",
    tools: [
      { name: "Standing pressure", value: "3.4", unit: "bar", fields: ["Gauge", "Location", "Notes"] },
      { name: "Working pressure", value: "1.2", unit: "bar", fields: ["Flow l/min", "Gauge", "Location"] },
      { name: "Flow rate", value: "14.6", unit: "l/min", fields: ["Bucket & timer", "Outlet", "Notes"] }
    ]
  },
  {
    group: "Electrical",
    accent: "yellow",
    tools: [
      { name: "Loop test", value: "0.42", unit: "ohm", fields: ["Pass/fail", "Instrument", "Circuit"] },
      { name: "RCD", value: "Pass", unit: "", fields: ["Trip time", "Rating", "Instrument"] },
      { name: "Earth resistance", value: "<1", unit: "ohm", fields: ["Band", "Measured value", "Notes"] }
    ]
  }
];

export const handoff = {
  packageName: "current-property-package-v4",
  destination: "Daedalus Main",
  inventory: [
    ["RoomPlan artifacts", "4"],
    ["Photo evidence", "12"],
    ["Manual measurements", "8"],
    ["Proposed Reality", "7"],
    ["Unknowns", "5"]
  ]
};
