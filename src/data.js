export const property = {
  name: "Haven",
  address: "Hundred Lane, Lymington, SO41 5RG",
  status: "Ready for Capture",
  roomsCaptured: 4,
  evidenceItems: 38,
  proposedItems: 7,
  lastSync: "Today 18:45"
};

export const roomPlanSession = {
  id: "capture-flight-2026-07-14",
  state: "RoomPlan ready",
  rooms: ["Kitchen", "Hall", "Lounge", "Utility"],
  artifacts: ["CapturedRoom JSON", "Daedalus manifest", "RoomPlan index", "Session bundle"]
};

export const tagGroups = [
  {
    label: "Heat",
    icon: "heat",
    items: ["Gas", "Electric", "LPG", "Oil", "Heat Pump"]
  },
  {
    label: "Hot Water",
    icon: "drop",
    items: ["On demand", "Unvented", "Open vented", "Thermal store", "Community"]
  },
  {
    label: "Electrical",
    icon: "bolt",
    items: ["Consumer unit", "Isolator", "Loop test", "RCD", "Supply"]
  },
  {
    label: "Meters",
    icon: "meter",
    items: ["Gas meter", "Electric meter", "Water meter", "Heat meter"]
  },
  {
    label: "Emitter",
    icon: "thermometer",
    items: ["Radiator", "TRV", "UFH", "Fan coil"]
  },
  {
    label: "Note",
    icon: "note",
    items: ["Occupancy", "Usage", "Performance", "Access", "Risk"]
  }
];

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

export const stockItems = [
  {
    type: "Boiler",
    make: "Worcester Bosch",
    model: "Greenstar Ri ErP+ 9-24",
    dimensions: "390 x 600 x 270 mm",
    clearance: "5 mm side, 170 mm above, 200 mm below, 600 mm front"
  },
  {
    type: "Cylinder",
    make: "Generic",
    model: "Unvented 180 L",
    dimensions: "545 x 1500 mm",
    clearance: "Service access front"
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
