export const twin = {
  property: {
    name: "My Home",
    address: "27 Ashcombe Road, Bath",
    createdAt: "28 June 2026",
    type: "1930s semi-detached",
    rooms: 9,
    components: 47,
    evidence: 186,
    confidence: 87,
    summary:
      "A newly formed Digital Twin assembled from a guided survey, room observations, photographs, document scans, and homeowner context."
  },
  discoveries: [
    "The boiler appears to serve both central heating and stored hot water.",
    "Kitchen heat loss is likely influenced by the rear extension and exposed pipe routes.",
    "Loft insulation is visible above the main roof, but coverage near the eaves remains uncertain.",
    "The upstairs radiator circuit appears to branch from pipework visible in the utility cupboard."
  ],
  needsReview: [
    "Confirm boiler model plate from a clearer photo.",
    "Resolve whether bathroom extractor vents through roof tile or soffit.",
    "Identify stopcock location from survey notes."
  ],
  rooms: [
    {
      slug: "kitchen",
      name: "Kitchen",
      role: "Rear extension, cooking, high heat variation",
      confidence: 82,
      evidence: 34,
      unknowns: 3,
      components: ["Column radiator", "Extractor", "External wall", "Under-sink pipework"],
      insight: "The kitchen is the most behaviourally distinct room because it combines newer fabric, more glazing, and exposed service routes."
    },
    {
      slug: "utility",
      name: "Utility",
      role: "Heating plant and services",
      confidence: 91,
      evidence: 42,
      unknowns: 2,
      components: ["Boiler", "Hot water cylinder", "Programmer", "Gas meter"],
      insight: "Most heating relationships are anchored here, which makes it the Digital Twin's strongest evidence area."
    },
    {
      slug: "loft",
      name: "Loft",
      role: "Insulation, ventilation, roof structure",
      confidence: 76,
      evidence: 23,
      unknowns: 5,
      components: ["Loft insulation", "Cold water tank", "Roof vents", "Cable routes"],
      insight: "The loft explains several upstairs temperature differences, but edge coverage is still uncertain."
    },
    {
      slug: "bathroom",
      name: "Bathroom",
      role: "Moisture, extraction, hot water demand",
      confidence: 79,
      evidence: 21,
      unknowns: 4,
      components: ["Extractor fan", "Towel radiator", "Mixer shower", "Waste pipe"],
      insight: "The bathroom links ventilation, hot water delivery, and condensation patterns."
    },
    {
      slug: "hall",
      name: "Hall",
      role: "Circulation and thermostat context",
      confidence: 84,
      evidence: 19,
      unknowns: 2,
      components: ["Room thermostat", "Front door", "Stairwell", "Hall radiator"],
      insight: "The hall acts as the control point for heating behaviour across both floors."
    }
  ],
  components: {
    boiler: {
      slug: "boiler",
      name: "Boiler",
      identity: "Worcester Bosch Greenstar 30i, likely installed 2017",
      location: "Utility cupboard, north wall",
      confidence: 88,
      evidence: [
        "Survey photo IMG_1842 shows the casing and visible pressure gauge.",
        "Installer label photographed inside the utility cupboard references 2017 service contact.",
        "Pipe route sketch links boiler flow and return to the upstairs landing void.",
        "Homeowner note says hot water and heating are controlled from the same programmer."
      ],
      relationships: ["Hot water cylinder", "Hall thermostat", "Kitchen radiator", "Bathroom towel radiator"],
      explanation:
        "The boiler is the heat source for the home. The Twin understands it through where it is observed, how pipework leaves the cupboard, which controls are nearby, and which rooms respond when heating is active.",
      timeline: ["2017: installer label suggests replacement", "2024: invoice references annual service", "2026: Digital Twin survey captured location and pipe evidence"],
      documents: ["Boiler service invoice", "Survey report", "Utility cupboard photos", "Manufacturer manual"]
    },
    radiator: {
      slug: "radiator",
      name: "Kitchen radiator",
      identity: "Double column radiator below rear glazing",
      location: "Kitchen, garden wall",
      confidence: 81,
      evidence: [
        "Room photo shows radiator position beneath the rear window.",
        "Thermal note records slower morning warm-up than the hall.",
        "Pipework disappears into extension floor void."
      ],
      relationships: ["Boiler", "Rear extension", "External wall", "Hall thermostat"],
      explanation:
        "This radiator sits in the room with the greatest fabric uncertainty. Its behaviour is understood by comparing observed radiator placement with room geometry, glazing, and heating control location.",
      timeline: ["2009: rear extension completed", "2026: Digital Twin survey noted slower heat response"],
      documents: ["Extension plans", "Kitchen survey photos", "Heating notes"]
    }
  },
  understanding: [
    {
      slug: "boiler-cycle",
      title: "Why does my boiler cycle?",
      body:
        "The Twin connects boiler activity to thermostat position, radiator demand, stored hot water calls, and observed pipe routes. Cycling is described as a relationship between demand and heat movement, not as a fault verdict."
    },
    {
      slug: "hot-water",
      title: "How hot water reaches my taps",
      body:
        "The evidence places the boiler and cylinder in the utility, then traces likely pipe routes toward the bathroom and kitchen. The explanation stays close to what was observed."
    },
    {
      slug: "heat-movement",
      title: "How heat moves around my home",
      body:
        "Rooms warm differently because controls, radiator size, building fabric, and air movement do not line up perfectly. The Twin makes those relationships visible."
    },
    {
      slug: "upstairs",
      title: "Why upstairs warms differently",
      body:
        "Loft insulation, stairwell air movement, and branch pipe routes explain why upstairs can feel separate from the ground floor heating pattern."
    },
    {
      slug: "ventilation",
      title: "Ventilation",
      body:
        "Extractor fans, window habits, roof vents, and moisture-producing rooms are treated as one connected system of air movement."
    },
    {
      slug: "building-fabric",
      title: "Building fabric",
      body:
        "Walls, roof, floors, extensions, and glazing form the backdrop for every comfort pattern the Twin explains."
    },
    {
      slug: "pipework",
      title: "Pipework",
      body:
        "Visible pipe routes become anchors. Hidden routes are represented as confidence-weighted assumptions until future evidence improves them."
    },
    {
      slug: "water-pressure",
      title: "Water pressure",
      body:
        "Pressure is explained through supply entry, cylinder position, valves, and outlet observations captured during survey."
    }
  ],
  timeline: [
    { year: "1934", title: "Original house built", detail: "Brick semi-detached home with suspended timber ground floor." },
    { year: "2009", title: "Rear extension completed", detail: "Kitchen enlarged with roof lights and wider garden glazing." },
    { year: "2017", title: "Boiler installed", detail: "Installer label and service invoice support the date." },
    { year: "2021", title: "Loft insulation topped up", detail: "Homeowner note and loft photographs show newer mineral wool above joists." },
    { year: "2026", title: "Digital Twin created", detail: "Survey, evidence pack, photos, and documents were assembled into a first model." },
    { year: "Future", title: "Twin evolves", detail: "New surveys and evidence can clarify unknowns without rewriting the home's history." }
  ],
  documents: [
    { type: "Evidence Pack", title: "Digital Twin Evidence Pack", detail: "186 observations linked to rooms, systems, and components." },
    { type: "Survey", title: "June 2026 Guided Survey", detail: "Room-by-room notes, confidence levels, and unresolved unknowns." },
    { type: "Photos", title: "Utility cupboard photos", detail: "Boiler, cylinder, pipe routes, programmer, and labels." },
    { type: "Certificate", title: "Gas service certificate", detail: "Annual service record captured from homeowner upload." },
    { type: "Manual", title: "Boiler user manual", detail: "Reference document associated with the observed boiler identity." },
    { type: "Plans", title: "Rear extension plan", detail: "Architectural plan used to understand kitchen geometry." }
  ],
  conversation: [
    {
      question: "Why is the kitchen colder?",
      answer:
        "The Twin sees three pieces of evidence pointing in the same direction: the kitchen is in the rear extension, the radiator sits beneath the garden glazing, and survey notes say it warms more slowly than the hall. That means the room's behaviour is being explained through fabric and heat distribution, not through a generic assumption."
    },
    {
      question: "What do we know about the boiler?",
      answer:
        "It is observed in the utility cupboard on the north wall. Photos show the casing, gauge, nearby programmer, and pipe exits. The model identity is high confidence but not absolute because the plate photo is partially blurred."
    },
    {
      question: "Why does upstairs warm differently?",
      answer:
        "The Twin connects loft insulation evidence, stairwell air movement, and visible pipe routes in the utility cupboard. It can explain the pattern, while still marking eaves insulation and hidden pipe branches as uncertain."
    }
  ]
};

export const heatPumpProjection = {
  presets: [
    { label: "Current boiler 70°C", value: 70 },
    { label: "Transitional 55°C", value: 55 },
    { label: "Heat pump target 45°C", value: 45 },
    { label: "Low-temp ideal 40°C", value: 40 }
  ],
  rooms: [
    {
      slug: "kitchen",
      name: "Kitchen",
      demand: 1620,
      baseOutput: 1780,
      x: 624,
      y: 468,
      marker: "column radiator",
      change:
        "As flow temperature lowers, the same radiator gives out less heat. The rear extension glazing means this room is affected earlier than the hall."
    },
    {
      slug: "utility",
      name: "Utility",
      demand: 760,
      baseOutput: 1120,
      x: 414,
      y: 470,
      marker: "panel radiator",
      change:
        "This compact service room has a smaller modelled demand, so the existing emitter remains sufficient across more of the slider range."
    },
    {
      slug: "loft",
      name: "Loft room",
      demand: 1180,
      baseOutput: 1260,
      x: 500,
      y: 218,
      marker: "low profile radiator",
      change:
        "Lower flow temperature reduces available output. Loft fabric uncertainty makes the status more sensitive in this mocked example."
    },
    {
      slug: "bathroom",
      name: "Bathroom",
      demand: 920,
      baseOutput: 980,
      x: 658,
      y: 344,
      marker: "towel emitter",
      change:
        "At lower flow temperature the towel emitter delivers less heat, so the room becomes marginal before it becomes undersized."
    },
    {
      slug: "hall",
      name: "Hall",
      demand: 1040,
      baseOutput: 1420,
      x: 322,
      y: 340,
      marker: "hall radiator",
      change:
        "The hall has a central position and modelled demand below its current emitter output, so it changes state later in the projection."
    }
  ]
};

export const navItems = [
  ["Home", "/home"],
  ["Explore", "/explore"],
  ["Heat pump projection", "/heat-pump-projection"],
  ["Understanding", "/understanding"],
  ["Conversation", "/conversation"],
  ["Timeline", "/timeline"],
  ["Documents", "/documents"]
];
