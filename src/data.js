export const property = {
  name: "Haven",
  address: "Hundred Lane, Lymington, SO41 5RG",
  type: "Detached house",
  period: "1900-1930",
  status: "Imported twin needs tightening",
  roomsCaptured: 4,
  evidenceItems: 38,
  proposedItems: 7,
  unknowns: 5,
  lastSync: "Today 18:45"
};

export const tightenItems = [
  ["Uncertain fact", "Cylinder type not confirmed", "Attach photo or mark unknown"],
  ["Contradiction", "Proposed boiler overlaps cupboard geometry", "Resolve before promotion"],
  ["Weak classification", "Kitchen plant room classification is candidate only", "Confirm room use"],
  ["Missing evidence", "Occupancy and usage transcript incomplete", "Ask Home questions"]
];

export const twinPages = [
  {
    name: "House",
    summary: "Fabric, rooms, geometry, openings and location.",
    facts: ["4 bounded rooms", "Kitchen and hall geometry strong", "Utility classification needs review"]
  },
  {
    name: "System",
    summary: "Equipment, distribution, controls and services.",
    facts: ["Heat source observed", "Hot water candidate unresolved", "Electrical evidence partial"]
  },
  {
    name: "Home",
    summary: "Occupancy, use, comfort, routines and behaviour.",
    facts: ["Usage not imported yet", "Performance context missing", "Comfort priorities unknown"]
  }
];

export const whatIf = {
  change: "Increase boiler output",
  affected: [
    ["Changed item", "Boiler output", "User altered capacity in proposed twin"],
    ["Directly affected", "Primary pipework", "May constrain delivery"],
    ["Limiting constraint", "Emitters", "Room output may not increase"],
    ["Uncertain", "Controls", "Evidence missing for zoning and modulation"],
    ["Additional work", "Hydraulic design", "May be required for proposed state"]
  ],
  shortcuts: ["Electrify heating", "Improve comfort", "Add cooling", "Change hot water", "Improve fabric", "Extension"]
};

export const runModel = [
  ["00:00", "Hall thermostat calls for heat"],
  ["00:03", "Boiler fires and primary flow rises"],
  ["00:08", "Kitchen emitter lags behind lounge"],
  ["00:14", "Flow bottleneck limits room response"],
  ["00:22", "Cylinder demand interrupts heating call"]
];

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
