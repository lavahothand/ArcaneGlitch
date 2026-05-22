const app = document.querySelector("#app");
const startRunButton = document.querySelector("#start-run");
const runeRain = document.querySelector("#rune-rain");
const backgroundMusic = new Audio("sound/Moonglass Relay (Menu Uplink Mix).mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.42;

const DEBUG_GAME = true;
const debugEvents = [];
const metadata = window.arcaneMetadata || {};

window.arcaneDebugEvents = debugEvents;

function gameLog(eventName, details = {}) {
  if (!DEBUG_GAME) {
    return;
  }

  const event = {
    sequence: debugEvents.length + 1,
    at: new Date().toISOString(),
    event: eventName,
    details,
  };

  debugEvents.push(event);

  if (debugEvents.length > 250) {
    debugEvents.shift();
  }

  console.debug(`[ArcaneGlitch #${event.sequence}] ${eventName}`, details);
}

function gameError(eventName, details = {}) {
  const event = {
    sequence: debugEvents.length + 1,
    at: new Date().toISOString(),
    event: eventName,
    details,
  };

  debugEvents.push(event);
  console.error(`[ArcaneGlitch #${event.sequence}] ${eventName}`, details);
}

window.addEventListener("error", (event) => {
  gameError("window.error", {
    message: event.message,
    source: event.filename,
    line: event.lineno,
    column: event.colno,
    stack: event.error?.stack,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  gameError("window.unhandledrejection", {
    reason: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
  });
});

window.addEventListener("pagehide", (event) => {
  gameLog("pagehide", { persisted: event.persisted, eventsCaptured: debugEvents.length });
});

const runeSymbols = [
  "transparent/Mind_1.png",
  "transparent/Mind_2.png",
  "transparent/Mind_3.png",
  "transparent/Surge_1.png",
  "transparent/Surge_2.png",
  "transparent/Surge_3.png",
  "transparent/Void_1.png",
  "transparent/Void_2.png",
  "transparent/Void_3.png",
  "transparent/Life_1.png",
  "transparent/Life_2.png",
  "transparent/Life_3.png",
];

const defaultCharacterToken = "characters/encantra_character_stand.png";
const glitchSpawnToken = "pixel art/glitchspawn_1_px.png";

const enemies = metadata.glitchspawn || {
  voidRaider: {
    id: "voidRaider",
    name: "Void Raider",
    image: glitchSpawnToken,
    xpValue: 25,
    behavior: "hyperAggressive",
    stats: {
      integrity: 4,
      physicalDefense: 0,
      arcaneDefense: 0,
      power: 1,
      accuracy: 0.4,
    },
  },
  surgeCrawler: {
    id: "surgeCrawler",
    name: "Surge Crawler",
    image: glitchSpawnToken,
    xpValue: 30,
    behavior: "aggressive",
    stats: {
      integrity: 3,
      physicalDefense: 0,
      arcaneDefense: 0,
      power: 3,
      accuracy: 0.45,
    },
  },
  mindPhantom: {
    id: "mindPhantom",
    name: "Mind Phantom",
    image: glitchSpawnToken,
    xpValue: 40,
    behavior: "neutral",
    stats: {
      integrity: 5,
      physicalDefense: 0,
      arcaneDefense: 1,
      power: 1,
      accuracy: 0.4,
    },
  },
};

const startingStats = {
  cache: 4,
  exec: 1,
  integrity: 10,
  maxIntegrity: 10,
  move: 2,
};

const startingProgression = {
  level: 1,
  xp: 0,
  xpToNextLevel: 50,
  pendingRewards: 0,
};

const worldMapImage = "map/map_without_nodes.png";
const worldMapCoordinateSpace = {
  width: 650,
  height: 1220,
};

const worldZones = [
  {
    id: "cindera",
    name: "Cindera",
    element: "Surge",
    accent: "#BA7517",
    dark: "#633806",
    light: "#FAEEDA",
    nodes: [
      ["start", "The Foundry Floor", 160, 40, "start"],
      ["n1", "Smelting Pits", 90, 120, "combat"],
      ["n2", "Exhaust Vents", 230, 120, "combat"],
      ["n3", "The Furnace", 60, 210, "combat"],
      ["n4", "Market 1", 175, 200, "market"],
      ["n5", "Conveyor Fields", 275, 210, "combat"],
      ["n6", "Coal Run", 40, 295, "combat"],
      ["n7", "Slag Heap", 130, 295, "combat"],
      ["n8", "The Grinder", 215, 295, "combat"],
      ["n9", "Pressure Valve", 295, 295, "combat"],
      ["n10", "Market 2", 55, 375, "market"],
      ["n11", "Coolant Pipes", 155, 375, "combat"],
      ["n12", "Spark Yard", 240, 375, "combat"],
      ["n13", "Engine Core", 310, 375, "combat"],
      ["n14", "Meltdown Row", 90, 455, "combat"],
      ["n15", "Market 3", 185, 455, "market"],
      ["n16", "Red Line", 275, 455, "combat"],
      ["boss", "Cindera Rift", 185, 530, "boss"],
    ],
    edges: [
      ["start", "n1"],
      ["start", "n2"],
      ["n1", "n3"],
      ["n1", "n4"],
      ["n2", "n4"],
      ["n2", "n5"],
      ["n3", "n6"],
      ["n3", "n7"],
      ["n4", "n7"],
      ["n4", "n8"],
      ["n5", "n8"],
      ["n5", "n9"],
      ["n6", "n10"],
      ["n7", "n11"],
      ["n8", "n11"],
      ["n8", "n12"],
      ["n9", "n12"],
      ["n9", "n13"],
      ["n10", "n14"],
      ["n11", "n15"],
      ["n12", "n15"],
      ["n13", "n16"],
      ["n14", "boss"],
      ["n15", "boss"],
      ["n16", "boss"],
    ],
  },
  {
    id: "conclave",
    name: "The Conclave",
    element: "Mind",
    accent: "#534AB7",
    dark: "#26215C",
    light: "#EEEDFE",
    nodes: [
      ["start", "Registry Hall", 490, 34, "start"],
      ["n1", "Processing Ward", 490, 108, "combat"],
      ["n2", "The Archives", 415, 188, "combat"],
      ["n3", "Holding Block", 555, 188, "combat"],
      ["n4", "Market 1", 415, 262, "market"],
      ["n5", "Interrogation Wing", 555, 262, "combat"],
      ["n6", "Council Chambers", 435, 336, "combat"],
      ["n7", "Black Site Annex", 555, 336, "combat"],
      ["n8", "The Vault", 390, 410, "combat"],
      ["n9", "Signals Office", 490, 410, "combat"],
      ["n10", "Market 2", 580, 410, "market"],
      ["n11", "Deep Records", 425, 470, "combat"],
      ["n12", "Suppression Engine", 555, 470, "combat"],
      ["boss", "Conclave Rift", 490, 535, "boss"],
    ],
    edges: [
      ["start", "n1"],
      ["n1", "n2"],
      ["n1", "n3"],
      ["n2", "n4"],
      ["n3", "n5"],
      ["n4", "n6"],
      ["n5", "n6"],
      ["n5", "n7"],
      ["n6", "n8"],
      ["n6", "n9"],
      ["n7", "n9"],
      ["n7", "n10"],
      ["n8", "n11"],
      ["n9", "n11"],
      ["n9", "n12"],
      ["n10", "n12"],
      ["n11", "boss"],
      ["n12", "boss"],
    ],
  },
  {
    id: "parcel7",
    name: "Parcel 7",
    element: "Void",
    accent: "#5F5E5A",
    dark: "#2C2C2A",
    light: "#F1EFE8",
    nodes: [
      ["start", "Summit Gate", 160, 640, "start"],
      ["n1", "Ore Trail", 95, 720, "combat"],
      ["n2", "The Ridge", 235, 720, "combat"],
      ["n3", "Shaft One", 75, 805, "combat"],
      ["n4", "Collapsed Pass", 220, 805, "combat"],
      ["n5", "Market 1", 55, 890, "market"],
      ["n6", "The Dark Vein", 155, 878, "combat"],
      ["n7", "Sinkhole Fields", 265, 878, "combat"],
      ["n8", "Cavern Depths", 115, 960, "combat"],
      ["n9", "Forgotten Shaft", 245, 960, "combat"],
      ["n10", "Pressurized Chamber", 95, 1040, "combat"],
      ["n11", "Glitch Seam", 215, 1040, "combat"],
      ["n12", "Dead End Cache", 310, 1040, "combat"],
      ["n13", "Market 2", 160, 1115, "market"],
      ["boss", "Parcel 7 Rift", 160, 1185, "boss"],
    ],
    edges: [
      ["start", "n1"],
      ["start", "n2"],
      ["n1", "n3"],
      ["n2", "n4"],
      ["n3", "n5"],
      ["n3", "n6"],
      ["n4", "n7"],
      ["n6", "n8"],
      ["n6", "n9"],
      ["n7", "n9"],
      ["n8", "n10"],
      ["n9", "n11"],
      ["n9", "n12"],
      ["n10", "n13"],
      ["n11", "n13"],
      ["n13", "boss"],
    ],
  },
  {
    id: "sestra",
    name: "Sestra Jungle",
    element: "Life",
    accent: "#3B6D11",
    dark: "#173404",
    light: "#EAF3DE",
    nodes: [
      ["start", "Canopy Gate", 490, 640, "start"],
      ["n1", "Rootway", 395, 725, "combat"],
      ["n2", "Farm Rows", 490, 725, "combat"],
      ["n3", "Outer Shrine", 590, 725, "combat"],
      ["n4", "Undergrowth", 370, 810, "combat"],
      ["n5", "Market 1", 470, 810, "market"],
      ["n6", "Temple Steps", 580, 810, "combat"],
      ["n7", "The Bog", 345, 895, "combat"],
      ["n8", "Spore Field", 435, 895, "combat"],
      ["n9", "Seed Vault", 510, 895, "combat"],
      ["n10", "Acolyte Halls", 590, 895, "combat"],
      ["n11", "The Reliquary", 640, 895, "combat"],
      ["n12", "Market 2", 370, 975, "market"],
      ["n13", "Canopy Bridge", 455, 975, "combat"],
      ["n14", "Root Network", 535, 975, "combat"],
      ["n15", "Grand Sanctum", 610, 975, "combat"],
      ["n16", "The Overgrowth", 415, 1050, "combat"],
      ["n17", "Market 3", 500, 1050, "market"],
      ["n18", "Seed Chamber", 585, 1050, "combat"],
      ["boss", "Sestra Rift", 500, 1120, "boss"],
    ],
    edges: [
      ["start", "n1"],
      ["start", "n2"],
      ["start", "n3"],
      ["n1", "n4"],
      ["n2", "n5"],
      ["n3", "n6"],
      ["n4", "n7"],
      ["n4", "n8"],
      ["n5", "n8"],
      ["n5", "n9"],
      ["n6", "n9"],
      ["n6", "n10"],
      ["n6", "n11"],
      ["n7", "n12"],
      ["n8", "n13"],
      ["n9", "n13"],
      ["n9", "n14"],
      ["n10", "n14"],
      ["n10", "n15"],
      ["n11", "n15"],
      ["n12", "n16"],
      ["n13", "n16"],
      ["n13", "n17"],
      ["n14", "n17"],
      ["n15", "n18"],
      ["n16", "boss"],
      ["n17", "boss"],
      ["n18", "boss"],
    ],
  },
];

function getWorldNodeTier(node) {
  if (node.type === "start") {
    return 1;
  }

  if (node.type === "boss") {
    return 6;
  }

  const zoneTop = node.y < 620 ? 40 : 640;
  return Math.max(2, Math.min(5, Math.ceil((node.y - zoneTop) / 125) + 1));
}

const zoneSigilElements = {
  cindera: "surge",
  conclave: "mind",
  parcel7: "void",
  sestra: "life",
};
const sigilElementIds = ["void", "life", "surge", "mind"];
const sigilRarityLabels = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
};

function getWorldNodeSigilProfile(node) {
  const zoneElement = zoneSigilElements[node.zoneId] || "surge";
  const tier = getWorldNodeTier(node);
  const otherElements = sigilElementIds.filter((element) => element !== zoneElement);

  if (tier === 1) {
    return {
      elements: [
        { element: zoneElement, chance: 85 },
        ...otherElements.map((element) => ({ element, chance: 5 })),
      ],
      rarities: [
        { face: 1, chance: 100 },
        { face: 2, chance: 0 },
        { face: 3, chance: 0 },
      ],
    };
  }

  const routeCommonChance = node.type === "boss" ? 35 : Math.max(45, 65 - tier * 4);
  const routeUncommonChance = Math.min(30, 8 + tier * 3);
  const routeRareChance = node.type === "boss" ? 12 : Math.max(0, tier - 2) * 2;
  const primaryElementChance = node.type === "boss" ? 55 : Math.max(55, 85 - tier * 5);
  const secondaryChance = Math.floor((100 - primaryElementChance) / otherElements.length);
  const elementWeights = [{ element: zoneElement, chance: primaryElementChance }];
  let assignedChance = primaryElementChance;

  otherElements.forEach((element, index) => {
    const chance = index === otherElements.length - 1 ? 100 - assignedChance : secondaryChance;
    elementWeights.push({ element, chance });
    assignedChance += chance;
  });

  return {
    elements: elementWeights,
    rarities: [
      { face: 1, chance: Math.max(0, 100 - routeUncommonChance - routeRareChance) },
      { face: 2, chance: routeUncommonChance },
      { face: 3, chance: routeRareChance },
    ],
  };
}

function rollWeightedEntry(weights = [], fallback) {
  const totalChance = weights.reduce((total, entry) => total + Math.max(0, entry.chance || 0), 0);
  let roll = Math.random() * (totalChance || 100);

  for (const entry of weights) {
    roll -= Math.max(0, entry.chance || 0);

    if (roll <= 0) {
      return entry;
    }
  }

  return weights[weights.length - 1] || fallback;
}

function rollSigilFromProfile(sigilProfile = {}) {
  const elementEntry = rollWeightedEntry(
    sigilProfile.elements || [],
    { element: sigilElementIds[Math.floor(Math.random() * sigilElementIds.length)], chance: 100 }
  );
  const rarityEntry = rollWeightedEntry(sigilProfile.rarities || [], { face: 1, chance: 100 });

  return { element: elementEntry.element, face: rarityEntry.face || 1 };
}

function renderSigilSpawnRates(node) {
  const sigilProfile = node.sigilProfile || { elements: [], rarities: [] };

  return `
    <div class="world-sigil-rates" id="level-sigil-rates" aria-label="Sigil spawn chances">
      ${sigilProfile.elements
        .map((entry) => {
          const die = getDieById(entry.element);

          return `
            <span class="world-sigil-rate" style="--die-accent: ${die?.accent || "#f6f8ff"}">
              ${die ? `<img src="${die.files[1]}" alt="">` : ""}
              <span>${die?.name || entry.element}</span>
              <b>${entry.chance}%</b>
            </span>
          `;
        })
        .join("")}
      ${sigilProfile.rarities
        .map((entry) => `
          <span class="world-sigil-rate rarity-rate">
            <span>${sigilRarityLabels[entry.face || 1]}</span>
            <b>${entry.chance}%</b>
          </span>
        `)
        .join("")}
    </div>
  `;
}

function buildWorldLevelNodes() {
  return worldZones.flatMap((zone) => {
    const zoneNodes = zone.nodes.map(([localId, label, x, y, type]) => {
      const node = {
        id: `${zone.id}-${localId}`,
        localId,
        zoneId: zone.id,
        zoneName: zone.name,
        element: zone.element,
        label,
        x,
        y,
        type,
        accent: zone.accent,
        dark: zone.dark,
        light: zone.light,
      };

      return {
        ...node,
        tier: getWorldNodeTier(node),
        sigilProfile: getWorldNodeSigilProfile(node),
        unlocks: zone.edges.filter(([from]) => from === localId).map(([, to]) => `${zone.id}-${to}`),
      };
    });

    return zoneNodes;
  });
}

const levelNodes = buildWorldLevelNodes();
const startingUnlockedNodes = levelNodes.filter((node) => node.type === "start").map((node) => node.id);

const startingMapState = {
  selectedNode: startingUnlockedNodes[0],
  completedNodes: [],
  unlockedNodes: [...startingUnlockedNodes],
};

const programs = metadata.programs || {
  teleport: {
    id: "teleport",
    name: "BLINK",
    element: "void",
    requirement: [{ element: "void", face: 1 }],
    summary: "Move 2 spaces in a straight line.",
    details: "Teleport exactly 2 hex spaces in a single straight-line direction.",
    cooldown: 0,
    effect: {
      type: "blinkStraight",
      distance: 2,
    },
  },
  spark: {
    id: "spark",
    name: "SPARK",
    element: "surge",
    requirement: [{ element: "surge", face: 1 }],
    summary: "Deal 2 AD to an adjacent enemy.",
    details: "Surge program. Spend one common Surge symbol to deal 2 arcane damage to an adjacent enemy.",
    cooldown: 1,
    effect: {
      type: "damageAdjacent",
      amount: 2,
      damageType: "arcane",
    },
  },
  rebuild: {
    id: "rebuild",
    name: "REBUILD",
    element: "life",
    requirement: [{ element: "life", face: 1 }],
    summary: "Heal 1 Integrity.",
    details: "Life program. Spend one common Life symbol to restore 1 Integrity.",
    cooldown: 0,
    effect: {
      type: "healIntegrity",
      amount: 1,
    },
  },
  focus: {
    id: "focus",
    name: "FOCUS",
    element: "mind",
    requirement: [{ element: "mind", face: 1 }],
    summary: "Gain 1 temporary Execution next turn.",
    details: "Spend one common Mind symbol to gain 1 temporary Execution on your next turn.",
    cooldown: 1,
    effect: {
      type: "nextTurnExec",
      amount: 1,
    },
  },
};

const artifacts = metadata.artifacts || [
  {
    id: "memoryShard",
    name: "Memory Shard",
    stat: "exec",
    amount: 1,
    label: "EXECUTIONS +1",
  },
  {
    id: "cacheCore",
    name: "Cache Core",
    stat: "cache",
    amount: 1,
    label: "CACHE +1",
  },
  {
    id: "phaseSpur",
    name: "Phase Spur",
    stat: "move",
    amount: 1,
    label: "Actions +1",
  },
  {
    id: "integrityLattice",
    name: "Integrity Lattice",
    stat: "maxIntegrity",
    amount: 1,
    label: "Max Integrity +1",
  },
];

function getRandomOptions(items, count) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

// Die positions 1-3 are always common, positions 4-5 are uncommon, and position 6 is rare.
const dieFaces = [1, 1, 1, 2, 2, 3];
const customDieFaceCount = 6;
const startingCustomFaceLimit = 3;
const baseSightRange = 2;
const baseProgramIds = ["teleport", "spark", "rebuild", "focus"];
const dice = [
  {
    id: "void",
    name: "Void",
    accent: "#c5b7ff",
    files: {
      1: "pixel art/void1_px_large.png",
      2: "pixel art/void2_px_large.png",
      3: "pixel art/void3_px_large.png",
    },
  },
  {
    id: "life",
    name: "Life",
    accent: "#8dffb4",
    files: {
      1: "pixel art/life1_px_large.png",
      2: "pixel art/life2_px_large.png",
      3: "pixel art/life3_px_large.png",
    },
  },
  {
    id: "surge",
    name: "Surge",
    accent: "#ff4fd8",
    files: {
      1: "pixel art/surge1_px_large.png",
      2: "pixel art/surge2_px_large.png",
      3: "pixel art/surge3_px_large.png",
    },
  },
  {
    id: "mind",
    name: "Mind",
    accent: "#b06cff",
    files: {
      1: "pixel art/mind1_px_large.png",
      2: "pixel art/mind2_px_large.png",
      3: "pixel art/mind3_px_large.png",
    },
  },
];

const characters = [
  {
    id: "arax",
    name: "Arax",
    portrait: "characters/Arax_profile_img_px.jpg",
    nameImage: "characters/arax_name.png",
    bio: "Arax is a rogue loner, vigilante, and no one knows about his real past. His realm of origin was a mining district in the mountains called Parcel 7. If you look for his home town you will not find it - it was the first realm consumed entirely by a Glitch Rift event.",
    token: "characters/arax_character.png",
    programs: ["teleport"],
    startingDie: "void",
  },
  {
    id: "dextritus",
    name: "Dextritus",
    portrait: "characters/Dextritus_profile_img_px.jpg",
    nameImage: "characters/dextritus_name.png",
    bio: "Dextritus was raised in a Seed temple - one of the religious institutions that venerates the Seed as a deity and teaches that the Seed's choices are sacred. When his Sigilant ability manifested at thirteen, the temple elders did not report him. They trained him in secret, incorporating his Sigil-casting into their existing ritual practices. He left the temple at age eighteen and joined the underground society to share his medical knowledge with others in need.",
    token: "characters/dextritus_character.png",
    programs: ["rebuild"],
    startingDie: "life",
  },
  {
    id: "encantra",
    name: "Encantra",
    portrait: "characters/encantra_profile_img_px.jpg",
    nameImage: "characters/encantra_name.png",
    bio: "Encantra grew up in the slums of Cindera - a smoke-filled industrial sector where Sigilants were registered and used for labor. She slipped her collar at fifteen, went underground, and spent the next nine years running illegal Sigil-casting circuits.",
    token: "characters/encantra_character_stand.png",
    programs: ["spark"],
    startingDie: "surge",
  },
  {
    id: "jin-ra",
    name: "Jin-Ra",
    portrait: "characters/Jin-Ra_profile_img_px.jpg",
    nameImage: "characters/jin-ra_name.png",
    bio: "Jin-Ra was identified and registered at age seven - a boy genius. Rather than collaring him, the grand-council saw him as a weapon. He spent his formative years in a facility that called itself a school and functioned as a lab. He discovered more about the simulation than any researchers before him. He was never allowed to leave unsupervised.",
    token: "characters/jinra_character.png",
    programs: ["focus"],
    startingDie: "mind",
  },
];

const roomDirections = [
  { q: 1, r: 0, exitClass: "exit-east" },
  { q: 1, r: 1, exitClass: "exit-south-east" },
  { q: 0, r: 1, exitClass: "exit-south-west" },
  { q: -1, r: 0, exitClass: "exit-west" },
  { q: -1, r: -1, exitClass: "exit-north-west" },
  { q: 0, r: -1, exitClass: "exit-north-east" },
];

const roomTileAssets = {
  basic: "hex_basic.png",
  cache: "hex_blank_cache.png",
  haven: "hexes/haven_hex_active.png",
  havenInactive: "hexes/haven_hex_deactive.png",
  powerHub: "hex_blank_powerhub.png",
  powerHubOff: "hex_blank_powerhub_off.png",
  rift: "hexes/rift_hex.png",
  hidden: "hex_hidden.png",
};

const cinderaBasicTileAssets = [
  "hexes/cindera_hex_basic1.png",
  "hexes/cindera_hex_basic2.png",
  "hexes/cindera_hex_basic3.png",
  "hexes/cindera_hex_basic4.png",
];

const jungleBasicTileAssets = [
  "hexes/jungle_hex_basic1.png",
  "hexes/jungle_hex_basic2.png",
  "hexes/jungle_hex_basic3.png",
  "hexes/jungle_hex_basic4.png",
];

const conclaveBasicTileAssets = [
  "hexes/conclave_hex_basic1.png",
  "hexes/conclave_hex_basic2.png",
  "hexes/conclave_hex_basic3.png",
  "hexes/conclave_hex_basic4.png",
];

const parcel7BasicTileAssets = [
  "hexes/parcel7_hex_basic1.png",
  "hexes/parcel7_hex_basic2.png",
  "hexes/parcel7_hex_basic3.png",
  "hexes/parcel7_hex_basic4.png",
];

let runeRainTimer;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnFallingRune() {
  if (!runeRain) {
    return;
  }

  const rune = document.createElement("img");
  const symbol = runeSymbols[Math.floor(Math.random() * runeSymbols.length)];

  rune.className = "falling-rune";
  rune.src = symbol;
  rune.alt = "";
  rune.style.setProperty("--x", `${randomBetween(-4, 100)}vw`);
  rune.style.setProperty("--size", `${randomBetween(24, 68)}px`);
  rune.style.setProperty("--duration", `${randomBetween(5.5, 12)}s`);
  rune.style.setProperty("--drift", `${randomBetween(-70, 70)}px`);
  rune.style.setProperty("--rotation", `${randomBetween(-18, 18)}deg`);
  rune.style.setProperty("--spin", `${randomBetween(-70, 70)}deg`);
  rune.style.setProperty("--alpha", randomBetween(0.2, 0.64).toFixed(2));

  rune.addEventListener("animationend", () => rune.remove());
  runeRain.appendChild(rune);
}

function startRuneRain() {
  for (let i = 0; i < 18; i += 1) {
    window.setTimeout(spawnFallingRune, i * 140);
  }

  runeRainTimer = window.setInterval(spawnFallingRune, 260);
}

function startBackgroundMusic() {
  if (!backgroundMusic.paused) {
    return;
  }

  backgroundMusic.play().catch(() => {
    gameLog("audio.autoplayBlocked");
    document.addEventListener("pointerdown", startBackgroundMusic, { once: true });
    document.addEventListener("keydown", startBackgroundMusic, { once: true });
  });
}

function tileKey(q, r) {
  return `${q},${r}`;
}

function getNeighborCoords(tile) {
  return roomDirections.map((direction) => ({
    q: tile.q + direction.q,
    r: tile.r + direction.r,
  }));
}

function buildEnemyRoster(count) {
  const pattern = ["voidRaider", "surgeCrawler", "mindPhantom", "surgeCrawler", "voidRaider"];

  return Array.from({ length: count }, (_, index) => pattern[index % pattern.length]);
}

function getRoomConfigForTier(tier) {
  const normalizedTier = Math.max(1, tier);

  if (normalizedTier === 1) {
    return { tier, tileCount: 30, threadCount: 1, sigilCount: 1, enemyTypes: ["voidRaider"] };
  }

  if (normalizedTier === 2) {
    return { tier, tileCount: 48, threadCount: 2, sigilCount: 1, enemyTypes: buildEnemyRoster(2) };
  }

  if (normalizedTier === 3) {
    return { tier, tileCount: 60, threadCount: 2, sigilCount: 2, enemyTypes: buildEnemyRoster(3) };
  }

  if (normalizedTier === 4) {
    return { tier, tileCount: 72, threadCount: 3, sigilCount: 3, enemyTypes: buildEnemyRoster(4) };
  }

  if (normalizedTier === 5) {
    return { tier, tileCount: 84, threadCount: 4, sigilCount: 3, enemyTypes: buildEnemyRoster(5) };
  }

  if (normalizedTier === 6) {
    return { tier, tileCount: 96, threadCount: 4, sigilCount: 4, enemyTypes: buildEnemyRoster(6) };
  }

  return {
    tier,
    tileCount: Math.min(120, 96 + (normalizedTier - 6) * 8),
    threadCount: Math.min(6, 4 + Math.floor((normalizedTier - 5) / 2)),
    sigilCount: Math.min(5, 4 + Math.floor((normalizedTier - 6) / 2)),
    enemyTypes: buildEnemyRoster(Math.min(9, normalizedTier)),
  };
}

function getRandomFromPool(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function applyRoomTileTheme(roomTiles, levelNode) {
  const zoneBasicTileAssets = {
    cindera: cinderaBasicTileAssets,
    conclave: conclaveBasicTileAssets,
    parcel7: parcel7BasicTileAssets,
    sestra: jungleBasicTileAssets,
  };
  const basicTileAssetPool = zoneBasicTileAssets[levelNode.zoneId] || null;

  if (!basicTileAssetPool) {
    return;
  }

  roomTiles.forEach((tile) => {
    if (tile.type === "basic") {
      tile.asset = getRandomFromPool(basicTileAssetPool);
    }
  });
}

function getRoomTileImage(tile, isRevealed) {
  if (!isRevealed) {
    return roomTileAssets.hidden;
  }

  return tile.asset || roomTileAssets[tile.type] || roomTileAssets.basic;
}

function generateRoomTiles(roomConfig = getRoomConfigForTier(1), levelNode = null) {
  const tileCount = roomConfig.tileCount;
  const tiles = [{ id: "tile-0", q: 0, r: 0, type: "basic" }];
  const occupied = new Set([tileKey(0, 0)]);

  while (tiles.length < tileCount) {
    const anchor = tiles[Math.floor(Math.random() * tiles.length)];
    const candidates = getNeighborCoords(anchor).filter((coord) => !occupied.has(tileKey(coord.q, coord.r)));

    if (!candidates.length) {
      continue;
    }

    const next = candidates[Math.floor(Math.random() * candidates.length)];
    const isStartingTile = next.q === 0 && next.r === 0;

    tiles.push({
      id: `tile-${tiles.length}`,
      q: next.q,
      r: next.r,
      type: isStartingTile ? "basic" : "basic",
    });
    occupied.add(tileKey(next.q, next.r));
  }

  const riftCandidates = tiles
    .filter((tile) => tile.id !== "tile-0")
    .filter((tile) =>
      getNeighborCoords(tile).some((coord) => !occupied.has(tileKey(coord.q, coord.r)))
    )
    .sort((a, b) => getHexDistance(b, tiles[0]) - getHexDistance(a, tiles[0]));
  const riftPool = riftCandidates.slice(0, Math.max(1, Math.ceil(riftCandidates.length / 2)));
  const riftTile = riftPool[Math.floor(Math.random() * riftPool.length)];

  riftTile.type = "rift";

  const threadCandidates = tiles
    .filter((tile) => tile.id !== "tile-0" && tile.id !== riftTile.id)
    .filter((tile) =>
      getNeighborCoords(tile).some((coord) => !occupied.has(tileKey(coord.q, coord.r)))
    )
    .sort((a, b) => getHexDistance(b, tiles[0]) - getHexDistance(a, tiles[0]));
  const threadPool = threadCandidates.length ? threadCandidates : tiles.filter((tile) => tile.id !== "tile-0" && tile.id !== riftTile.id);
  const threadTileIds = [];
  const shuffledThreadPool = [...threadPool].sort(() => Math.random() - 0.5);

  shuffledThreadPool.some((tile) => {
    if (threadTileIds.length >= roomConfig.threadCount) {
      return true;
    }

    threadTileIds.push(tile.id);
    return false;
  });
  const shouldSpawnCache = roomConfig.tier > 1;
  const cacheCandidates = shouldSpawnCache
    ? tiles.filter((tile) => tile.id !== "tile-0" && tile.id !== riftTile.id && !threadTileIds.includes(tile.id))
    : [];
  const cacheTile = cacheCandidates[Math.floor(Math.random() * cacheCandidates.length)];
  const artifactCandidates = shouldSpawnCache
    ? tiles.filter(
        (tile) =>
          tile.id !== "tile-0" &&
          tile.id !== riftTile.id &&
          tile.id !== cacheTile?.id &&
          !threadTileIds.includes(tile.id)
      )
    : [];
  const artifactTile = artifactCandidates[Math.floor(Math.random() * artifactCandidates.length)];

  if (cacheTile) {
    cacheTile.type = "cache";
  }

  const sigilCandidates = tiles.filter(
    (tile) =>
      tile.id !== "tile-0" &&
      tile.id !== riftTile.id &&
      tile.id !== cacheTile?.id &&
      tile.id !== artifactTile?.id &&
      !threadTileIds.includes(tile.id)
  );
  const sigilPickups = getRandomOptions(sigilCandidates, roomConfig.sigilCount || 0).map((tile) => ({
    tileId: tile.id,
    sigil: rollSigilFromProfile(levelNode?.sigilProfile || {}),
  }));

  const reservedTileIds = new Set([
    "tile-0",
    riftTile.id,
    ...threadTileIds,
    ...(cacheTile ? [cacheTile.id] : []),
    ...(artifactTile ? [artifactTile.id] : []),
    ...sigilPickups.map((pickup) => pickup.tileId),
  ]);
  const extraTileCandidates = tiles.filter((tile) => !reservedTileIds.has(tile.id));

  if (roomConfig.tier > 1) {
    const havenChecks = Math.max(1, Math.round(tileCount / 15));

    for (let index = 0; index < havenChecks; index += 1) {
      if (Math.random() >= 0.5) {
        continue;
      }

      const candidates = extraTileCandidates.filter((tile) => tile.type === "basic");
      const havenTile = candidates[Math.floor(Math.random() * candidates.length)];

      if (havenTile) {
        havenTile.type = "haven";
      }
    }

    const powerHubCandidates = extraTileCandidates.filter((tile) => tile.type === "basic");
    const powerHubTile = Math.random() < 0.5
      ? powerHubCandidates[Math.floor(Math.random() * powerHubCandidates.length)]
      : null;

    if (powerHubTile) {
      powerHubTile.type = "powerHub";
    }
  }

  return {
    tiles,
    riftTileId: riftTile.id,
    threadTileIds,
    cacheTileIds: cacheTile ? [cacheTile.id] : [],
    artifactTileIds: artifactTile ? [artifactTile.id] : [],
    sigilPickups,
  };
}

function getDieById(dieId) {
  return dice.find((item) => item.id === dieId);
}

function getSigilDefinition(element, face = 1) {
  const die = getDieById(element);

  return die
    ? {
        element: die.id,
        face,
        name: die.name,
        accent: die.accent,
        image: die.files[face],
      }
    : null;
}

function getLoadoutDieFaces(loadoutDie) {
  if (typeof loadoutDie === "string") {
    return dieFaces.map((face) => getSigilDefinition(loadoutDie, face));
  }

  return Array.from({ length: customDieFaceCount }, (_, index) => {
    const sigil = loadoutDie?.faces?.[index];
    return sigil ? getSigilDefinition(sigil.element, sigil.face || 1) : null;
  });
}

function getLoadoutDieLabel(loadoutDie, index = 0) {
  if (typeof loadoutDie === "string") {
    return getDieById(loadoutDie)?.name || `Die ${index + 1}`;
  }

  return loadoutDie?.name || `Custom Die ${index + 1}`;
}

function getLoadoutDieAccent(loadoutDie) {
  if (typeof loadoutDie === "string") {
    return getDieById(loadoutDie)?.accent || "#f6f8ff";
  }

  const firstSigil = getLoadoutDieFaces(loadoutDie).find(Boolean);
  return firstSigil?.accent || "#f6f8ff";
}

function getLoadoutDiePreviewSigil(loadoutDie) {
  return getLoadoutDieFaces(loadoutDie).find(Boolean);
}

function getCharacterLoadoutElements(character) {
  return new Set(
    (character.loadout || [])
      .flatMap((loadoutDie) => getLoadoutDieFaces(loadoutDie))
      .filter(Boolean)
      .map((sigil) => sigil.element)
  );
}

function createCustomDie(faces) {
  return {
    id: `crafted-${Date.now()}`,
    type: "custom",
    name: "Crafted Die",
    faces: Array.from({ length: customDieFaceCount }, (_, index) => {
      const sigil = faces[index];
      return sigil ? { element: sigil.element, face: sigil.face || 1 } : null;
    }),
  };
}

function createBlankDie() {
  return createCustomDie([]);
}

function getBlankDieFaceSlots(character) {
  return (character.loadout || []).flatMap((loadoutDie, dieIndex) => {
    if (typeof loadoutDie === "string" || loadoutDie?.type !== "custom") {
      return [];
    }

    return Array.from({ length: customDieFaceCount }, (_, faceIndex) =>
      loadoutDie.faces?.[faceIndex] ? null : { dieIndex, faceIndex }
    ).filter(Boolean);
  });
}

function addSigilToDieFace(character, sigil, dieIndex, faceIndex) {
  const loadoutDie = character.loadout?.[dieIndex];

  if (!loadoutDie || typeof loadoutDie === "string" || loadoutDie.type !== "custom") {
    return false;
  }

  loadoutDie.faces = Array.from({ length: customDieFaceCount }, (_, index) => loadoutDie.faces?.[index] || null);

  if (loadoutDie.faces[faceIndex]) {
    return false;
  }

  loadoutDie.faces[faceIndex] = { element: sigil.element, face: sigil.face || 1 };
  return true;
}

function getProgramById(programId) {
  return programs[programId];
}

function ensureProgramLibrary(character) {
  character.programLibrary = [...new Set([...(character.programLibrary || []), ...(character.programs || [])])];
  character.programs = (character.programs || []).filter((programId) => character.programLibrary.includes(programId));
  return character.programLibrary;
}

function rollDie(loadoutDie) {
  const faces = getLoadoutDieFaces(loadoutDie);
  const faceIndex = Math.floor(Math.random() * faces.length);
  const sigil = faces[faceIndex];

  return {
    faceIndex,
    sigil: sigil ? { element: sigil.element, face: sigil.face } : null,
  };
}

function renderProgramRequirement(program) {
  return program.requirement
    .map((requirement, index) => {
      const die = getDieById(requirement.element);

      return `
        <span class="program-symbol" style="--die-accent: ${die.accent}">
          <img src="${die.files[requirement.face]}" alt="${die.name} symbol ${requirement.face}">
          <span>${index + 1}</span>
        </span>
      `;
    })
    .join("");
}

function renderProgramRewardChoice(program, attributes = "", className = "") {
  const die = getDieById(program.element);

  return `
    <button class="secondary-action reward-choice program-reward-choice ${className}" type="button" ${attributes} style="--die-accent: ${die.accent}">
      <span class="program-reward-heading">
        <span class="program-reward-symbols" aria-hidden="true">
          ${renderProgramRequirement(program)}
        </span>
        <strong>${program.name}</strong>
      </span>
      <small>${program.summary}</small>
      <em>${program.details}</em>
    </button>
  `;
}

function canCastProgram(program, castSymbols, cooldownLockedProgramIds = new Set()) {
  if (cooldownLockedProgramIds.has(program.id)) {
    return false;
  }

  if (castSymbols === null) {
    return true;
  }

  const availableSymbols = castSymbols.filter((symbol) => !symbol.spent && !symbol.blank).map((symbol) => ({ ...symbol }));

  return program.requirement.every((requirement) => {
    const symbolIndex = availableSymbols.findIndex(
      (symbol) => symbol.element === requirement.element && symbol.face === requirement.face
    );

    if (symbolIndex < 0) {
      return false;
    }

    availableSymbols.splice(symbolIndex, 1);
    return true;
  });
}

function getPhysicalDamage(castSymbols) {
  const availableSymbols = Array.isArray(castSymbols) ? castSymbols.filter((symbol) => !symbol.spent && !symbol.blank) : [];

  if (!availableSymbols.length) {
    return 1;
  }

  const symbolCounts = availableSymbols.reduce((counts, symbol) => {
    const key = `${symbol.element}:${symbol.face}`;
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());
  const highestMatch = Math.max(...symbolCounts.values());

  return highestMatch >= 3 ? 5 : highestMatch === 2 ? 3 : 1;
}

function renderAllocatedSymbols(symbols) {
  if (!symbols?.length) {
    return "";
  }

  return `
    <div class="program-allocation" aria-label="Allocated symbols">
      ${symbols
        .map((symbol) => {
          const die = getDieById(symbol.element);

          return `
            <span class="allocated-die" style="--die-accent: ${die.accent}">
              <img src="${die.files[symbol.face]}" alt="${die.name} allocated symbol">
              <span>${symbol.slotIndex + 1}</span>
            </span>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSigilDieImage(symbol, label = "") {
  if (!symbol || symbol.blank) {
    return `
      <span class="blank-roll-face" aria-label="Blank face">
        <i></i>
      </span>
    `;
  }

  const die = getDieById(symbol.element);

  return `<img src="${die.files[symbol.face]}" alt="${die.name}${label ? ` ${label}` : ""}">`;
}

function renderPhysicalDamageProgram(castSymbols, allocatedSymbols = []) {
  const isAvailable = Array.isArray(castSymbols) && castSymbols.some((symbol) => !symbol.spent && !symbol.blank);
  const damage = getPhysicalDamage(castSymbols);

  return `
    <article class="program-card physical-damage ${isAvailable ? "" : "unavailable"}" data-program-id="physical-damage" style="--program-accent: #f6f8ff" tabindex="${isAvailable ? "0" : "-1"}" aria-disabled="${!isAvailable}">
      <div class="program-row">
        <strong>Physical Damage</strong>
        <div class="program-requirement">
          <span class="program-damage-value">
            ${damage}
          </span>
        </div>
      </div>
      ${renderAllocatedSymbols(allocatedSymbols)}
      <div class="program-tooltip">
        <strong>Physical Damage</strong>
        <span>Fallback Attack</span>
        <p>Spend any one rolled symbol to deal ${damage} physical damage to an adjacent enemy. Matching rolled symbols increase the damage.</p>
      </div>
    </article>
  `;
}

function renderPrograms(programIds, castSymbols = null, options = {}) {
  const cacheLimit = Number.isFinite(options.cacheLimit) ? options.cacheLimit : programIds.length;
  const cooldownLockedProgramIds = options.cooldownLockedProgramIds || new Set();
  const cooldowns = options.cooldowns || {};
  const renderedPrograms = programIds
    .map((programId) => {
      const program = getProgramById(programId);
      const die = getDieById(program.element);
      const isOnCooldown = cooldownLockedProgramIds.has(program.id);
      const cooldownRemaining = cooldowns[program.id] || 0;
      const cooldownText = isOnCooldown ? `Cooling Down (${cooldownRemaining})` : "Ready";
      const isAvailable = canCastProgram(program, castSymbols, cooldownLockedProgramIds);
      const allocatedSymbols = options.allocations?.[program.id] || [];

      return `
        <article class="program-card ${isAvailable ? "" : "unavailable"}" data-program-id="${program.id}" style="--program-accent: ${die.accent}" tabindex="${isAvailable ? "0" : "-1"}" aria-disabled="${!isAvailable}">
          <div class="program-row">
            <strong>${program.name}</strong>
            <div class="program-requirement">
              ${renderProgramRequirement(program)}
            </div>
          </div>
          <p class="program-status ${isOnCooldown ? "cooling" : "ready"}">Status: ${cooldownText}</p>
          ${renderAllocatedSymbols(allocatedSymbols)}
          <div class="program-tooltip">
            <strong>${program.name}</strong>
            <span>${die.name} Program / Cooldown ${program.cooldown || 0}</span>
            <p>${program.details}</p>
          </div>
        </article>
      `;
    })
    .join("");
  const emptySlots = Array.from({ length: Math.max(0, cacheLimit - programIds.length) }, () => `
    <article class="program-card empty-program-slot" aria-disabled="true">
      <div class="program-row">
        <strong>Empty Cache</strong>
      </div>
      <div class="program-tooltip">
        <strong>Empty Cache</strong>
        <span>Open Program Slot</span>
        <p>This CACHE slot can hold a program gained from rewards.</p>
      </div>
    </article>
  `).join("");
  const physicalFallback =
    options.showPhysicalFallback && castSymbols !== null
      ? renderPhysicalDamageProgram(castSymbols, options.allocations?.["physical-damage"] || [])
      : "";

  return `${renderedPrograms}${emptySlots}${physicalFallback}`;
}

function renderSetupProgramPreview() {
  return baseProgramIds
    .map((programId) => {
      const program = getProgramById(programId);

      return `
        <article class="setup-program-card">
          <div class="program-row">
            <strong>${program.name}</strong>
            <div class="program-requirement">
              ${renderProgramRequirement(program)}
            </div>
          </div>
          <div class="program-tooltip">
            <strong>${program.name}</strong>
            <span>Base Program</span>
            <p>${program.details}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderRunDice(loadout) {
  return loadout
    .map((loadoutDie, index) => {
      const previewSigil = getLoadoutDiePreviewSigil(loadoutDie);
      const accent = getLoadoutDieAccent(loadoutDie);
      const label = getLoadoutDieLabel(loadoutDie, index);

      return `
        <div class="run-die" style="--die-accent: ${accent}">
          ${renderSigilDieImage(previewSigil, "die preview")}
          <span>Die ${index + 1}</span>
          <strong>${label}</strong>
        </div>
      `;
    })
    .join("");
}

function renderThreadTracker(collectedCount, totalCount) {
  return `
    <div class="thread-tracker" aria-label="Rift threads collected">
      <span>Rift Threads</span>
      <strong>${collectedCount}/${totalCount}</strong>
      <i aria-hidden="true"></i>
    </div>
  `;
}

function renderRollDieOptions(character, selectedRollSlots, castSymbols = null) {
  if (!Array.isArray(castSymbols) || !castSymbols.length) {
    return `<p class="roll-empty">First Sigil-Cast rolls all equipped dice.</p>`;
  }

  const symbolsBySlot = new Map(castSymbols.map((symbol) => [symbol.slotIndex, symbol]));

  return character.loadout
    .map((loadoutDie, index) => {
      const symbol = symbolsBySlot.get(index);

      if (!symbol || symbol.spent) {
        return "";
      }

      const accent = symbol.blank ? getLoadoutDieAccent(loadoutDie) : getDieById(symbol.element).accent;
      const label = getLoadoutDieLabel(loadoutDie, index);
      const isSelected = selectedRollSlots.includes(index);

      return `
        <button class="roll-die-option ${isSelected ? "selected" : ""}" type="button" data-roll-slot="${index}" style="--die-accent: ${accent}" aria-pressed="${isSelected}">
          ${renderSigilDieImage(symbol, "current result")}
          <span>Die ${index + 1}</span>
          <strong>${label}</strong>
        </button>
      `;
    })
    .join("");
}

function renderRollResultSlots(
  character,
  selectedRollSlots,
  results = [],
  spentResultIndices = new Set(),
  assignableResultIndices = new Set(),
  castSymbols = null
) {
  if (Array.isArray(castSymbols) && castSymbols.length) {
    const visibleSymbols = castSymbols.filter((symbol) => !symbol.spent);

    if (!visibleSymbols.length) {
      return `<p class="roll-empty">All rolled sigils have been assigned.</p>`;
    }

    return visibleSymbols
      .map((symbol) => {
        const die = symbol.blank ? null : getDieById(symbol.element);
        const rollingResultIndex = selectedRollSlots.indexOf(symbol.slotIndex);
        const rollingResult = rollingResultIndex >= 0 && results[rollingResultIndex] ? results[rollingResultIndex] : null;
        const displaySymbol = rollingResult
          ? rollingResult.sigil
            ? { element: rollingResult.sigil.element, face: rollingResult.sigil.face }
            : { blank: true }
          : symbol;
        const isAssignable = assignableResultIndices.has(symbol.resultIndex);

        return `
          <div class="roll-result ${isAssignable ? "assignable" : ""} ${displaySymbol.blank ? "blank-result" : ""}" data-result-index="${symbol.resultIndex}" style="--die-accent: ${displaySymbol.blank ? getLoadoutDieAccent(character.loadout[symbol.slotIndex]) : die.accent}">
            <span>Die ${symbol.slotIndex + 1}</span>
            ${renderSigilDieImage(displaySymbol, "result")}
            <strong>${displaySymbol.blank ? "Blank" : die.name}</strong>
          </div>
        `;
      })
      .join("");
  }

  if (!selectedRollSlots.length) {
    return "";
  }

  return selectedRollSlots
    .map((slotIndex, resultIndex) => {
      const rollResult = results[resultIndex] || null;
      const sigil = rollResult?.sigil ? { element: rollResult.sigil.element, face: rollResult.sigil.face } : { blank: true };
      const die = sigil.blank ? null : getDieById(sigil.element);

      return `
        <div class="roll-result ${sigil.blank ? "blank-result" : ""}" data-result-index="${resultIndex}" style="--die-accent: ${sigil.blank ? getLoadoutDieAccent(character.loadout[slotIndex]) : die.accent}">
          <span>Die ${slotIndex + 1}</span>
          ${renderSigilDieImage(sigil, "result")}
          <strong>${sigil.blank ? "Blank" : die.name}</strong>
        </div>
      `;
    })
    .join("");
}

function getCastSymbols(character, selectedRollSlots, results) {
  return selectedRollSlots.map((slotIndex, resultIndex) => ({
    resultIndex: slotIndex,
    slotIndex,
    element: results[resultIndex]?.sigil?.element || null,
    face: results[resultIndex]?.sigil?.face || null,
    faceIndex: results[resultIndex]?.faceIndex ?? null,
    blank: !results[resultIndex]?.sigil,
  }));
}

function findProgramAllocation(program, castSymbols) {
  if (!Array.isArray(castSymbols)) {
    return [];
  }

  const availableSymbols = castSymbols.filter((symbol) => !symbol.spent && !symbol.blank);

  return program.requirement.reduce((allocated, requirement) => {
    const symbol = availableSymbols.find(
      (item) =>
        !allocated.includes(item) &&
        item.element === requirement.element &&
        item.face === requirement.face
    );

    return symbol ? [...allocated, symbol] : allocated;
  }, []);
}

function findPhysicalAllocation(castSymbols) {
  const availableSymbols = Array.isArray(castSymbols) ? castSymbols.filter((symbol) => !symbol.spent && !symbol.blank) : [];

  if (!availableSymbols.length) {
    return [];
  }

  const groups = availableSymbols.reduce((grouped, symbol) => {
    const key = `${symbol.element}:${symbol.face}`;
    grouped.set(key, [...(grouped.get(key) || []), symbol]);
    return grouped;
  }, new Map());

  return [...groups.values()].sort((a, b) => b.length - a.length)[0];
}

function findPhysicalAllocationFromSymbol(castSymbols, selectedSymbol) {
  if (!selectedSymbol || selectedSymbol.blank) {
    return [];
  }

  return Array.isArray(castSymbols)
    ? castSymbols.filter(
        (symbol) =>
          !symbol.spent &&
          symbol.element === selectedSymbol.element &&
          symbol.face === selectedSymbol.face
      )
    : [];
}

function getPhysicalDamageFromAllocation(symbols) {
  const count = symbols?.length || 0;

  return count >= 3 ? 5 : count === 2 ? 3 : 1;
}

function markSymbolsSpent(castSymbols, symbolsToSpend) {
  const spendIndices = new Set(symbolsToSpend.map((symbol) => symbol.resultIndex));

  return castSymbols.map((symbol) => ({
    ...symbol,
    spent: symbol.spent || spendIndices.has(symbol.resultIndex),
  }));
}

function getExecutionStatusText(remaining) {
  return `EXECUTIONS (ROLLS) REMAINING: ${remaining}`;
}

function renderRunCharacter(character) {
  return `
    <div class="run-character">
      <img class="run-character-portrait" src="${character.portrait}" alt="${character.name}">
      <img class="run-character-name" src="${character.nameImage}" alt="${character.name}">
    </div>
  `;
}

function renderArtifactStrip(collectedArtifacts) {
  return `
    <div class="artifact-strip" aria-label="Collected artifacts">
      ${
        collectedArtifacts.length
          ? collectedArtifacts
              .map(
                (artifact) => `
            <span class="artifact-badge" tabindex="0" data-artifact-info="${artifact.name}: ${artifact.label}">
              ${artifact.name}
            </span>
          `
              )
              .join("")
          : `<span class="artifact-empty">No Artifacts</span>`
      }
    </div>
  `;
}

function renderCharacterStats(stats, temporaryExecutionBonus = 0) {
  const integrityPercent = Math.max(0, Math.min(100, (stats.integrity / stats.maxIntegrity) * 100));
  const executionBonus = Math.max(0, temporaryExecutionBonus);

  return `
    <dl class="stat-grid" id="character-stats" aria-label="Character stats">
      <div class="stat">
        <dt>Cache</dt>
        <dd>${stats.cache}</dd>
      </div>
      <div class="stat">
        <dt>Executions</dt>
        <dd>${stats.exec}${executionBonus ? `<span class="stat-temp-bonus">+${executionBonus}</span>` : ""}</dd>
      </div>
      <div class="stat integrity-stat">
        <dt>Integrity</dt>
        <dd>
          <span class="integrity-value"><span class="integrity-current">${stats.integrity}</span>/${stats.maxIntegrity}</span>
          <span class="integrity-bar" aria-hidden="true">
            <span style="width: ${integrityPercent}%"></span>
          </span>
        </dd>
      </div>
      <div class="stat">
        <dt>Actions</dt>
        <dd>${stats.move}</dd>
      </div>
    </dl>
  `;
}

function renderProgressionTracker(progression = startingProgression) {
  return `
    <dl class="progression-tracker" aria-label="Character progression">
      <div>
        <dt>Level</dt>
        <dd>${progression.level}</dd>
      </div>
      <div>
        <dt>XP</dt>
        <dd>${progression.xp}/${progression.xpToNextLevel}</dd>
      </div>
    </dl>
  `;
}

function addCharacterXp(character, amount) {
  if (!character.progression || amount <= 0) {
    return false;
  }

  let didLevelUp = false;
  character.progression.xp += amount;

  while (character.progression.xp >= character.progression.xpToNextLevel) {
    character.progression.xp -= character.progression.xpToNextLevel;
    character.progression.level += 1;
    character.progression.pendingRewards = (character.progression.pendingRewards || 0) + 1;
    character.progression.xpToNextLevel = getXpThresholdForLevel(character.progression.level);
    didLevelUp = true;
  }

  return didLevelUp;
}

function getXpThresholdForLevel(level) {
  const thresholds = {
    1: 50,
    2: 100,
    3: 150,
    4: 225,
    5: 340,
  };

  return thresholds[level] || Math.round(getXpThresholdForLevel(level - 1) * 1.5);
}

function ensureMapState(character) {
  if (!character.mapState) {
    character.mapState = {
      selectedNode: startingMapState.selectedNode,
      completedNodes: [...startingMapState.completedNodes],
      unlockedNodes: [...startingMapState.unlockedNodes],
    };
  }

  return character.mapState;
}

function completeLevelNode(character, nodeId) {
  const mapState = ensureMapState(character);
  const node = levelNodes.find((item) => item.id === nodeId);

  if (!mapState.completedNodes.includes(nodeId)) {
    mapState.completedNodes.push(nodeId);
  }

  (node?.unlocks || []).forEach((unlockedNodeId) => {
    if (!mapState.unlockedNodes.includes(unlockedNodeId)) {
      mapState.unlockedNodes.push(unlockedNodeId);
    }
  });

  mapState.selectedNode = node?.unlocks?.[0] || nodeId;
}

function renderEnemyInfo(enemy) {
  return `
    <article class="enemy-card" tabindex="0">
      <div class="enemy-row">
        <img class="enemy-thumb" src="${enemy.image}" alt="${enemy.name}">
        <strong>${enemy.name}</strong>
        <span>Power ${enemy.stats.power}</span>
      </div>
      <div class="enemy-tooltip">
        <img class="enemy-portrait" src="${enemy.image}" alt="${enemy.name}">
        <h3>${enemy.name}</h3>
        <dl class="enemy-stat-grid" aria-label="${enemy.name} stats">
          <div>
            <dt>Integrity</dt>
            <dd>${enemy.stats.integrity}</dd>
          </div>
          <div>
            <dt>Physical Defense</dt>
            <dd>${enemy.stats.physicalDefense}</dd>
          </div>
          <div>
            <dt>Arcane Defense</dt>
            <dd>${enemy.stats.arcaneDefense}</dd>
          </div>
          <div>
            <dt>Power</dt>
            <dd>${enemy.stats.power}</dd>
          </div>
          <div>
            <dt>Accuracy</dt>
            <dd>${Math.round((enemy.stats.accuracy ?? 0.4) * 100)}%</dd>
          </div>
          <div>
            <dt>XP Value</dt>
            <dd>${enemy.xpValue}</dd>
          </div>
        </dl>
      </div>
    </article>
  `;
}

function createEnemyInstance(enemyType, index, tileId, tier) {
  const baseEnemy = enemies[enemyType] || enemies.voidRaider;
  const normalizedTier = Math.max(1, tier);
  const integrityBonus = Math.max(0, Math.floor((normalizedTier - 2) * 1.5));
  const powerBonus = Math.max(0, Math.floor((normalizedTier - 2) / 2));
  const defenseBonus = Math.max(0, Math.floor((normalizedTier - 4) / 2));
  const xpBonus = Math.max(0, (normalizedTier - 1) * 5);

  return {
    ...baseEnemy,
    instanceId: `${baseEnemy.id}-${index}`,
    positionId: tileId,
    xpValue: baseEnemy.xpValue + xpBonus,
    behavior: baseEnemy.behavior || "neutral",
    stats: {
      ...baseEnemy.stats,
      integrity: (baseEnemy.stats.integrity ?? 1) + integrityBonus,
      physicalDefense: (baseEnemy.stats.physicalDefense ?? 0) + defenseBonus,
      arcaneDefense: (baseEnemy.stats.arcaneDefense ?? 0) + defenseBonus,
      power: (baseEnemy.stats.power ?? 1) + powerBonus,
      accuracy: Math.min(0.85, (baseEnemy.stats.accuracy ?? 0.4) + Math.max(0, normalizedTier - 1) * 0.05),
    },
  };
}

function getEnemyAtTile(activeEnemies, tileId) {
  return activeEnemies.find((enemy) => enemy.positionId === tileId && enemy.stats.integrity > 0);
}

function getOccupiedEnemyTileIds(activeEnemies) {
  return activeEnemies
    .filter((enemy) => enemy.positionId && enemy.stats.integrity > 0)
    .map((enemy) => enemy.positionId);
}

function getHexDistance(a, b) {
  const aq = a.q;
  const ar = a.r - a.q;
  const as = -aq - ar;
  const bq = b.q;
  const br = b.r - b.q;
  const bs = -bq - br;

  return (Math.abs(aq - bq) + Math.abs(ar - br) + Math.abs(as - bs)) / 2;
}

function getMovementPathToTile(roomTiles, positionId, targetTileId, maxSteps = 1, blockedTileIds = []) {
  const position = roomTiles.find((tile) => tile.id === positionId);
  const target = roomTiles.find((tile) => tile.id === targetTileId);
  const blocked = new Set(blockedTileIds.filter((tileId) => tileId && tileId !== targetTileId));

  if (!position || !target || targetTileId === positionId || blocked.has(targetTileId)) {
    return [];
  }

  const queue = [{ tileId: positionId, path: [] }];
  const visited = new Set([positionId]);

  while (queue.length) {
    const current = queue.shift();
    const currentTile = roomTiles.find((tile) => tile.id === current.tileId);

    if (!currentTile || current.path.length >= maxSteps) {
      continue;
    }

    const adjacentTiles = roomTiles.filter(
      (tile) => tile.id !== positionId && !blocked.has(tile.id) && getHexDistance(currentTile, tile) === 1
    );

    for (const tile of adjacentTiles) {
      if (visited.has(tile.id)) {
        continue;
      }

      const nextPath = [...current.path, tile.id];

      if (tile.id === targetTileId) {
        return nextPath;
      }

      visited.add(tile.id);
      queue.push({ tileId: tile.id, path: nextPath });
    }
  }

  return [];
}

function getReachableTileIds(roomTiles, positionId, maxSteps = 1, blockedTileIds = []) {
  return roomTiles
    .filter((tile) => tile.id !== positionId)
    .filter((tile) => getMovementPathToTile(roomTiles, positionId, tile.id, maxSteps, blockedTileIds).length)
    .map((tile) => tile.id);
}

function getLineTargetTileIds(roomTiles, positionId, distance, occupiedTileIds = [], options = {}) {
  const position = roomTiles.find((tile) => tile.id === positionId);
  const occupied = new Set(occupiedTileIds.filter(Boolean));

  if (!position) {
    return [];
  }

  return roomDirections
    .map((direction) => {
      const pathKeys = Array.from({ length: Math.max(0, distance - 1) }, (_, index) =>
        tileKey(position.q + direction.q * (index + 1), position.r + direction.r * (index + 1))
      );
      const targetQ = position.q + direction.q * distance;
      const targetR = position.r + direction.r * distance;
      const target = roomTiles.find((tile) => tile.q === targetQ && tile.r === targetR);
      const hasConnectedPath = pathKeys.every((pathKey) => roomTiles.some((tile) => tileKey(tile.q, tile.r) === pathKey));

      return hasConnectedPath && target && (options.allowOccupied || !occupied.has(target.id)) ? target.id : null;
    })
    .filter(Boolean);
}

function getBlinkTargetTileIds(roomTiles, positionId, occupiedTileIds = [], distance = 2) {
  return getLineTargetTileIds(roomTiles, positionId, distance, occupiedTileIds);
}

function getPushDestinationTileId(roomTiles, playerPositionId, enemyPositionId, occupiedTileIds = []) {
  const playerTile = roomTiles.find((tile) => tile.id === playerPositionId);
  const enemyTile = roomTiles.find((tile) => tile.id === enemyPositionId);

  if (!playerTile || !enemyTile || getHexDistance(playerTile, enemyTile) !== 1) {
    return null;
  }

  const targetQ = enemyTile.q + (enemyTile.q - playerTile.q);
  const targetR = enemyTile.r + (enemyTile.r - playerTile.r);
  const occupied = new Set(occupiedTileIds.filter((tileId) => tileId && tileId !== enemyPositionId));
  const destination = roomTiles.find((tile) => tile.q === targetQ && tile.r === targetR);

  return destination && !occupied.has(destination.id) && destination.id !== playerPositionId ? destination.id : null;
}

function getPushableEnemyTileIds(roomTiles, activeEnemies, playerPositionId) {
  const occupiedTileIds = getOccupiedEnemyTileIds(activeEnemies);

  return getAdjacentEnemyTileIds(roomTiles, activeEnemies, playerPositionId).filter((enemyTileId) =>
    Boolean(getPushDestinationTileId(roomTiles, playerPositionId, enemyTileId, occupiedTileIds))
  );
}

function getNextEnemyStepTowardPlayer(roomTiles, enemyPositionId, playerPositionId, occupiedTileIds = [], maxSteps = 1) {
  if (!enemyPositionId) {
    return enemyPositionId;
  }

  let currentPositionId = enemyPositionId;
  const playerTile = roomTiles.find((tile) => tile.id === playerPositionId);
  const occupied = new Set(occupiedTileIds.filter((tileId) => tileId && tileId !== enemyPositionId));

  for (let step = 0; step < maxSteps; step += 1) {
    const currentTile = roomTiles.find((tile) => tile.id === currentPositionId);

    if (!currentTile || !playerTile || getHexDistance(currentTile, playerTile) <= 1) {
      return currentPositionId;
    }

    const adjacentTiles = roomTiles.filter(
      (tile) =>
        tile.id !== playerPositionId &&
        !occupied.has(tile.id) &&
        getHexDistance(currentTile, tile) === 1
    );
    const bestStep = adjacentTiles.sort(
      (a, b) => getHexDistance(a, playerTile) - getHexDistance(b, playerTile)
    )[0];

    if (!bestStep) {
      return currentPositionId;
    }

    occupied.delete(currentPositionId);
    currentPositionId = bestStep.id;
    occupied.add(currentPositionId);
  }

  return currentPositionId;
}

function getRandomEnemyStep(roomTiles, enemyPositionId, playerPositionId, occupiedTileIds = []) {
  if (!enemyPositionId) {
    return enemyPositionId;
  }

  const currentTile = roomTiles.find((tile) => tile.id === enemyPositionId);

  if (!currentTile) {
    return enemyPositionId;
  }

  const occupied = new Set(occupiedTileIds.filter((tileId) => tileId && tileId !== enemyPositionId));
  const adjacentTiles = roomTiles.filter(
    (tile) =>
      tile.id !== playerPositionId &&
      !occupied.has(tile.id) &&
      getHexDistance(currentTile, tile) === 1
  );

  if (!adjacentTiles.length) {
    return enemyPositionId;
  }

  return adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)].id;
}

function getNextEnemyPosition(roomTiles, enemy, playerPositionId, occupiedTileIds = []) {
  const behavior = enemy.behavior || "neutral";

  if (behavior === "stationary") {
    return enemy.positionId;
  }

  if (behavior === "aggressive" && Math.random() >= 0.5) {
    return enemy.positionId;
  }

  if (behavior === "aggressive" || behavior === "hyperAggressive") {
    return getNextEnemyStepTowardPlayer(roomTiles, enemy.positionId, playerPositionId, occupiedTileIds, 1);
  }

  return getRandomEnemyStep(roomTiles, enemy.positionId, playerPositionId, occupiedTileIds);
}

function getAdjacentEnemyTileIds(roomTiles, activeEnemies, playerPositionId) {
  const playerTile = roomTiles.find((tile) => tile.id === playerPositionId);

  if (!playerTile) {
    return [];
  }

  return activeEnemies
    .filter((enemy) => enemy.positionId && enemy.stats.integrity > 0)
    .filter((enemy) => {
      const enemyTile = roomTiles.find((tile) => tile.id === enemy.positionId);
      return enemyTile && getHexDistance(enemyTile, playerTile) === 1;
    })
    .map((enemy) => enemy.positionId);
}

function isEnemyAdjacentToPlayer(roomTiles, enemy, playerPositionId) {
  return getAdjacentEnemyTileIds(roomTiles, [enemy], playerPositionId).length > 0;
}

function getRoomGridStyle(roomTiles) {
  const qs = roomTiles.map((tile) => tile.q);
  const rs = roomTiles.map((tile) => tile.r);
  const minQ = Math.min(...qs);
  const maxQ = Math.max(...qs);
  const minR = Math.min(...rs);
  const maxR = Math.max(...rs);

  return `--min-q: ${minQ}; --max-q: ${maxQ}; --min-r: ${minR}; --max-r: ${maxR};`;
}

function getVisibleTileIds(roomTiles, characterPositionId, sightRange = baseSightRange) {
  const characterTile = roomTiles.find((tile) => tile.id === characterPositionId);
  const range = Math.max(1, sightRange);

  return roomTiles
    .filter((tile) => tile.id === characterPositionId || getHexDistance(characterTile, tile) <= range)
    .map((tile) => tile.id);
}

function renderRoomTiles(
  roomTiles,
  character,
  characterPositionId,
  activeEnemies,
  reachableTileIds,
  visibleTileIds,
  exploredTileIds,
  targetableEnemyTileIds = [],
  riftThreadTileIds = [],
  collectedThreadTileIds = [],
  artifactTileIds = [],
  collectedArtifactTileIds = [],
  sigilPickups = [],
  collectedSigilTileIds = []
) {
  return roomTiles
    .map((tile) => {
      const hasCharacter = tile.id === characterPositionId;
      const enemyOnTile = getEnemyAtTile(activeEnemies, tile.id);
      const isReachable = reachableTileIds.includes(tile.id);
      const isVisible = visibleTileIds.includes(tile.id);
      const isExplored = exploredTileIds.includes(tile.id);
      const isTargetableEnemy = targetableEnemyTileIds.includes(tile.id);
      const hasRiftThread = riftThreadTileIds.includes(tile.id) && !collectedThreadTileIds.includes(tile.id);
      const hasArtifact = artifactTileIds.includes(tile.id) && !collectedArtifactTileIds.includes(tile.id);
      const sigilPickup = sigilPickups.find((pickup) => pickup.tileId === tile.id && !collectedSigilTileIds.includes(tile.id));
      const tileImage = getRoomTileImage(tile, isVisible || isExplored);
      const classes = [
        "room-tile",
        hasCharacter ? "occupied" : "",
        isReachable ? "reachable" : "",
        isTargetableEnemy ? "targetable-enemy" : "",
        isVisible ? "visible" : isExplored ? "explored" : "concealed",
        enemyOnTile && isVisible ? "threat-visible" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <button class="${classes}" type="button" data-tile-id="${tile.id}" style="--q: ${tile.q}; --r: ${tile.r}" aria-label="${tile.type} space">
          <img src="${tileImage}" alt="">
          ${
            hasRiftThread && isVisible
              ? `<span class="rift-thread" aria-hidden="true"></span>`
              : ""
          }
          ${
            hasArtifact && isVisible
              ? `<img class="artifact-pickup-token" src="artifact_1.png" alt="Artifact pickup">`
              : ""
          }
          ${
            sigilPickup && isVisible
              ? `<img class="floating-sigil-token" src="${getSigilDefinition(sigilPickup.sigil.element, sigilPickup.sigil.face)?.image}" alt="Floating sigil">`
              : ""
          }
          ${
            hasCharacter
              ? `<img class="character-token" src="${character.token || defaultCharacterToken}" alt="${character.name}">`
              : ""
          }
          ${
            enemyOnTile && isVisible
              ? `<img class="glitchspawn-token" data-enemy-id="${enemyOnTile.instanceId}" src="${enemyOnTile.image}" alt="${enemyOnTile.name}">`
              : ""
          }
        </button>
      `;
    })
    .join("");
}

function showInitialRoom(character, nodeId = startingMapState.selectedNode) {
  character.progression = character.progression || { ...startingProgression };
  character.stats.maxIntegrity = character.stats.maxIntegrity || character.stats.integrity;
  ensureProgramLibrary(character);
  const levelNode = levelNodes.find((node) => node.id === nodeId) || levelNodes[0];
  const roomConfig = getRoomConfigForTier(levelNode.tier);
  const room = generateRoomTiles(roomConfig, levelNode);
  const roomTiles = room.tiles;
  applyRoomTileTheme(roomTiles, levelNode);
  const riftTile = roomTiles.find((tile) => tile.id === room.riftTileId);
  const riftThreadTileIds = room.threadTileIds;
  const cacheTileIds = room.cacheTileIds || [];
  const artifactTileIds = room.artifactTileIds || [];
  const sigilPickups = room.sigilPickups || [];
  const collectedThreadTileIds = [];
  const collectedCacheTileIds = [];
  const collectedArtifactTileIds = [];
  const collectedSigilTileIds = [];
  const usedPowerHubTileIds = [];
  const enemySpawnCandidates = roomTiles
    .filter((tile) => tile.id !== "tile-0" && tile.id !== riftTile.id)
    .sort((a, b) => getHexDistance(a, riftTile) - getHexDistance(b, riftTile));
  const activeEnemies = roomConfig.enemyTypes.map((enemyType, index) => {
    const spawnTile = index === 0 ? riftTile : enemySpawnCandidates[index - 1] || riftTile;
    const enemy = createEnemyInstance(enemyType, index, spawnTile.id, levelNode.tier);

    if (levelNode.tier === 1) {
      enemy.behavior = "stationary";
      enemy.stats.integrity = 1;
    }

    return enemy;
  });
  let characterPositionId = roomTiles[0].id;
  const exploredTileIds = new Set(getVisibleTileIds(roomTiles, characterPositionId));
  let isMoveMode = false;
  let isPhysicalTargetMode = false;
  let isBlinkTargetMode = false;
  let pendingPhysicalDamage = 0;
  let turnNumber = 1;
  let actionPointsRemaining = character.stats.move;
  character.programCooldowns = character.programCooldowns || {};
  character.nextTurnExecBonus = character.nextTurnExecBonus || 0;
  let programCooldowns = character.programCooldowns;
  let cooldownLockedProgramIds = new Set();
  let temporaryExecutionBonusThisTurn = character.nextTurnExecBonus;
  let executionRollsRemaining = character.stats.exec + temporaryExecutionBonusThisTurn;
  character.nextTurnExecBonus = 0;
  cooldownLockedProgramIds = new Set(
    Object.entries(programCooldowns)
      .filter(([, remaining]) => remaining > 0)
      .map(([programId]) => programId)
  );
  Object.entries(programCooldowns).forEach(([programId, remaining]) => {
    const nextRemaining = Math.max(0, remaining - 1);

    if (nextRemaining > 0) {
      programCooldowns[programId] = nextRemaining;
    } else {
      delete programCooldowns[programId];
    }
  });
  let isLevelComplete = false;
  let isRunDefeated = false;
  let turnPhase = "player";
  let hasShownAllDerezzedNotice = activeEnemies.every((enemy) => !enemy.positionId || enemy.stats.integrity <= 0);

  app.innerHTML = `
    <section class="room-screen" aria-labelledby="room-title">
      <aside class="program-list" aria-label="Equipped programs">
        <div id="program-list-items">
          ${renderPrograms(character.programs, null, {
            cacheLimit: character.stats.cache,
            cooldownLockedProgramIds,
            cooldowns: programCooldowns,
          })}
        </div>
        <section class="runecast-panel inactive" id="runecast-panel" aria-label="Sigil-Casting dice">
          <header class="runecast-header">
            <p class="signal">Sigil-Casting</p>
            <span id="roll-status">${getExecutionStatusText(executionRollsRemaining)}</span>
          </header>
          <div class="roll-options" id="roll-options"></div>
          <div class="roll-results" id="roll-results"></div>
          <button class="primary-action roll-confirm" type="button" id="roll-confirm" disabled>Cast Sigils</button>
        </section>
      </aside>
      <aside class="enemy-info hidden" id="enemy-info" aria-live="polite">
        <p class="signal">Enemies</p>
        <div id="enemy-list"></div>
      </aside>

      <header class="room-hud">
        <div>
          <p class="signal" id="room-meta">${levelNode.zoneName} / ${levelNode.label} / Turn 1</p>
          <h2 id="room-title">${levelNode.label}</h2>
        </div>
      </header>

      <section class="room-play-area" aria-label="Run map">
        <div class="map-player-info">
          ${renderRunCharacter(character)}
          ${renderArtifactStrip(character.artifacts || [])}
          ${renderCharacterStats(character.stats, temporaryExecutionBonusThisTurn + character.nextTurnExecBonus)}
          ${renderProgressionTracker(character.progression)}
          ${renderThreadTracker(collectedThreadTileIds.length, riftThreadTileIds.length)}
        </div>

        <div class="room-stage" aria-label="Starting room with connected hex spaces">
          <div class="turn-phase-banner" id="turn-phase-banner" aria-live="polite">Player Turn</div>
          <div class="room-grid" id="room-grid" style="${getRoomGridStyle(roomTiles)}">
            ${renderRoomTiles(
              roomTiles,
              character,
              characterPositionId,
              activeEnemies,
              [],
              getVisibleTileIds(roomTiles, characterPositionId),
              [...exploredTileIds],
              [],
              riftThreadTileIds,
              collectedThreadTileIds,
              artifactTileIds,
              collectedArtifactTileIds,
              sigilPickups,
              collectedSigilTileIds
            )}
          </div>
        </div>
      </section>

      <footer class="room-footer">
        <p id="room-status">Spend Actions to move or Sigil-Cast. Movement remains adjacent unless a program says otherwise.</p>
        <div class="room-actions">
          <button class="primary-action move-action" type="button" id="move-action">Move</button>
          <button class="primary-action roll-action" type="button" id="roll-action">Sigil-Cast</button>
          <button class="primary-action turn-action" type="button" id="end-turn-action">End Turn</button>
        </div>
      </footer>

    </section>
  `;

  const roomStage = document.querySelector(".room-stage");
  const roomGrid = document.querySelector("#room-grid");
  const roomMeta = document.querySelector("#room-meta");
  const enemyInfo = document.querySelector("#enemy-info");
  const enemyList = document.querySelector("#enemy-list");
  const moveButton = document.querySelector("#move-action");
  const rollButton = document.querySelector("#roll-action");
  const endTurnButton = document.querySelector("#end-turn-action");
  const roomStatus = document.querySelector("#room-status");
  const turnPhaseBanner = document.querySelector("#turn-phase-banner");
  const programListItems = document.querySelector("#program-list-items");
  const runecastPanel = document.querySelector("#runecast-panel");
  const rollOptions = document.querySelector("#roll-options");
  const rollResults = document.querySelector("#roll-results");
  const rollStatus = document.querySelector("#roll-status");
  const rollConfirm = document.querySelector("#roll-confirm");
  const selectedRollSlots = [];
  let currentCastSymbols = null;
  let allocatedProgramSymbols = {};
  let isRunecastingActive = false;
  let isRolling = false;
  let cameraOffset = { x: 0, y: 0 };
  let dragState = null;
  let suppressTileClick = false;
  let pendingAttack = null;
  let pendingSymbolAssignment = null;
  let pendingBlinkTargetTileIds = [];
  let temporaryRevealTileIds = new Set();
  let sightRangeBonus = 0;
  let sightRangeBonusTurnsRemaining = 0;

  function getRoomDebugState() {
    return {
      nodeId: levelNode.id,
      tier: levelNode.tier,
      turnNumber,
      characterPositionId,
      actionPointsRemaining,
      executionRollsRemaining,
      nextTurnExecBonus: character.nextTurnExecBonus,
      programCooldowns: { ...programCooldowns },
      cooldownLockedProgramIds: [...cooldownLockedProgramIds],
      integrity: character.stats.integrity,
      maxIntegrity: character.stats.maxIntegrity,
      enemies: activeEnemies.map((enemy) => ({
        id: enemy.instanceId,
        type: enemy.id,
        positionId: enemy.positionId,
        integrity: enemy.stats.integrity,
        confusedTurns: enemy.confusedTurns || 0,
        stunnedTurns: enemy.stunnedTurns || 0,
      })),
      collectedThreads: collectedThreadTileIds.length,
      totalThreads: riftThreadTileIds.length,
      collectedCaches: collectedCacheTileIds.length,
      collectedArtifacts: collectedArtifactTileIds.length,
      collectedSigils: collectedSigilTileIds.length,
      usedPowerHubs: usedPowerHubTileIds.length,
      isMoveMode,
      isBlinkTargetMode,
      hasPendingAttack: Boolean(pendingAttack),
      temporaryRevealTileIds: [...temporaryRevealTileIds],
      sightRangeBonus,
      sightRangeBonusTurnsRemaining,
      pendingSymbolAssignment: pendingSymbolAssignment
        ? {
            programId: pendingSymbolAssignment.programId,
            candidateResultIndices: [...pendingSymbolAssignment.candidateResultIndices],
          }
        : null,
      isRunecastingActive,
      isLevelComplete,
      isRunDefeated,
      turnPhase,
    };
  }

  gameLog("room.start", {
    nodeId: levelNode.id,
    tier: levelNode.tier,
    tileCount: roomTiles.length,
    riftTileId: riftTile.id,
    threadTileIds: riftThreadTileIds,
    cacheTileIds,
    artifactTileIds,
    sigilPickups,
    enemyTypes: roomConfig.enemyTypes,
    startState: getRoomDebugState(),
  });

  function clampCameraOffset(offset) {
    const stageWidth = roomStage.clientWidth;
    const stageHeight = roomStage.clientHeight;
    const gridWidth = roomGrid.offsetWidth;
    const gridHeight = roomGrid.offsetHeight;
    const sampleTile = roomGrid.querySelector(".room-tile");
    const tileWidth = sampleTile ? sampleTile.offsetWidth : 0;
    const tileHeight = sampleTile ? sampleTile.offsetHeight : 0;
    const tileHalfWidth = tileWidth / 2;
    const tileHalfHeight = tileHeight / 2;
    const minX = stageWidth / 2 - (gridWidth - tileHalfWidth);
    const minY = stageHeight / 2 - (gridHeight - tileHalfHeight);
    const maxX = stageWidth / 2 - tileHalfWidth;
    const maxY = stageHeight / 2 - tileHalfHeight;

    return {
      x: Math.min(maxX, Math.max(minX, offset.x)),
      y: Math.min(maxY, Math.max(minY, offset.y)),
    };
  }

  function centerCameraOnTile(tileId) {
    const tileElement = roomGrid.querySelector(`[data-tile-id="${tileId}"]`);

    if (!tileElement) {
      return;
    }

    const stageRect = roomStage.getBoundingClientRect();
    const tileRect = tileElement.getBoundingClientRect();
    const deltaX = stageRect.left + stageRect.width / 2 - (tileRect.left + tileRect.width / 2);
    const deltaY = stageRect.top + stageRect.height / 2 - (tileRect.top + tileRect.height / 2);

    cameraOffset = clampCameraOffset({
      x: cameraOffset.x + deltaX,
      y: cameraOffset.y + deltaY,
    });
  }

  function updateCamera() {
    cameraOffset = clampCameraOffset(cameraOffset);
    roomGrid.style.transform = `translate(${cameraOffset.x}px, ${cameraOffset.y}px)`;
  }

  function showDamageIndicator(tileId, amount, variant = "enemy") {
    const tileElement = roomGrid.querySelector(`[data-tile-id="${tileId}"]`);

    if (!tileElement) {
      return;
    }

    const indicator = document.createElement("span");
    indicator.className = `damage-indicator ${variant === "player" ? "player-damage" : "enemy-damage"}`;
    indicator.textContent = `-${amount}`;
    tileElement.appendChild(indicator);
    window.setTimeout(() => indicator.remove(), 900);
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function captureEnemyTokenRects() {
    return new Map(
      [...roomGrid.querySelectorAll(".glitchspawn-token")].map((token) => [
        token.dataset.enemyId,
        token.getBoundingClientRect(),
      ])
    );
  }

  function captureCharacterTokenRect() {
    return roomGrid.querySelector(".character-token")?.getBoundingClientRect() || null;
  }

  function animateCharacterMovement(previousRect) {
    const token = roomGrid.querySelector(".character-token");

    if (!token || !previousRect) {
      return Promise.resolve();
    }

    const currentRect = token.getBoundingClientRect();
    const deltaX = previousRect.left - currentRect.left;
    const deltaY = previousRect.top - currentRect.top;

    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
      return Promise.resolve();
    }

    return token.animate(
      [
        { transform: `translate(calc(-50% + ${deltaX}px), calc(-54% + ${deltaY}px))` },
        { transform: "translate(-50%, -54%)" },
      ],
      {
        duration: 360,
        easing: "cubic-bezier(0.22, 0.8, 0.24, 1)",
      }
    ).finished.catch(() => null);
  }

  function animateEnemyMovement(previousRects) {
    const animations = [...roomGrid.querySelectorAll(".glitchspawn-token")]
      .map((token) => {
        const previousRect = previousRects.get(token.dataset.enemyId);

        if (!previousRect) {
          return null;
        }

        const currentRect = token.getBoundingClientRect();
        const deltaX = previousRect.left - currentRect.left;
        const deltaY = previousRect.top - currentRect.top;

        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
          return null;
        }

        return token.animate(
          [
            { transform: `translate(calc(-50% + ${deltaX}px), calc(-52% + ${deltaY}px))` },
            { transform: "translate(-50%, -52%)" },
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.22, 0.8, 0.24, 1)",
          }
        ).finished.catch(() => null);
      })
      .filter(Boolean);

    return animations.length ? Promise.all(animations) : Promise.resolve();
  }

  function showRunDeathPopup(sourceText = "Integrity depleted.") {
    if (document.querySelector(".run-death-overlay")) {
      return;
    }

    turnPhase = "defeat";
    isMoveMode = false;
    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    pendingAttack = null;
    pendingSymbolAssignment = null;
    isRunDefeated = true;
    roomStage.classList.remove("movement-active", "dragging");
    deactivateRunecasting();
    updateRoom();

    const overlay = document.createElement("div");
    overlay.className = "run-death-overlay";
    overlay.innerHTML = `
      <section class="run-death-panel" role="dialog" aria-modal="true" aria-labelledby="run-death-title">
        <p class="signal">Signal Lost</p>
        <h2 id="run-death-title">Sigilant Derezzed</h2>
        <p>${sourceText}</p>
        <button class="primary-action" type="button" id="return-main-menu">Return to Main Menu</button>
      </section>
    `;

    document.querySelector(".room-screen").appendChild(overlay);
    overlay.querySelector("#return-main-menu").focus();
    overlay.querySelector("#return-main-menu").addEventListener("click", () => window.location.reload());
    gameLog("run.defeat", getRoomDebugState());
  }

  function hasLivingEnemies() {
    return activeEnemies.some((enemy) => enemy.positionId && enemy.stats.integrity > 0);
  }

  function getLivingEnemies() {
    return activeEnemies.filter((enemy) => enemy.positionId && enemy.stats.integrity > 0);
  }

  function isRoomSecured() {
    return !hasLivingEnemies();
  }

  function showAllDerezzedNotice() {
    if (hasShownAllDerezzedNotice || isLevelComplete || isRunDefeated || hasLivingEnemies()) {
      return;
    }

    hasShownAllDerezzedNotice = true;
    isMoveMode = false;
    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    pendingAttack = null;
    pendingSymbolAssignment = null;
    roomStage.classList.remove("movement-active", "dragging");
    updateRoom({ centerCamera: false });

    const overlay = document.createElement("div");
    overlay.className = "all-derezzed-overlay";
    overlay.innerHTML = `
      <section class="all-derezzed-panel" role="dialog" aria-modal="true" aria-labelledby="all-derezzed-title">
        <p class="signal">Area Secured</p>
        <h2 id="all-derezzed-title">All Glitchspawn Derezzed</h2>
        <p>Enemy turns are skipped. Movement is unrestricted while you finish the room objective.</p>
        <button class="primary-action" type="button" id="continue-secured-room">Continue</button>
      </section>
    `;

    document.querySelector(".room-screen").appendChild(overlay);
    overlay.querySelector("#continue-secured-room").focus();
    overlay.querySelector("#continue-secured-room").addEventListener("click", () => {
      overlay.remove();
      isMoveMode = true;
      roomStage.classList.add("movement-active");
      updateRoom({ centerCamera: false });
      roomStatus.textContent = "All Glitchspawn derezzed. Movement is unrestricted.";
    });
    gameLog("room.allEnemiesDerezzed", getRoomDebugState());
  }

  function beginPlayerTurn() {
    cooldownLockedProgramIds = new Set(
      Object.entries(programCooldowns)
        .filter(([, remaining]) => remaining > 0)
        .map(([programId]) => programId)
    );

    Object.entries(programCooldowns).forEach(([programId, remaining]) => {
      const nextRemaining = Math.max(0, remaining - 1);

      if (nextRemaining > 0) {
        programCooldowns[programId] = nextRemaining;
      } else {
        delete programCooldowns[programId];
      }
    });

    const execBonus = character.nextTurnExecBonus || 0;
    temporaryExecutionBonusThisTurn = execBonus;
    actionPointsRemaining = character.stats.move;
    executionRollsRemaining = character.stats.exec + temporaryExecutionBonusThisTurn;
    character.nextTurnExecBonus = 0;
    return execBonus;
  }

  function startProgramCooldown(program) {
    const cooldown = Number.isFinite(program.cooldown) ? program.cooldown : 0;

    if (cooldown <= 0) {
      return;
    }

    programCooldowns[program.id] = Math.max(programCooldowns[program.id] || 0, cooldown);
    cooldownLockedProgramIds.add(program.id);
  }

  function markProgramAllocated(programId, program, allocatedSymbols) {
    currentCastSymbols = markSymbolsSpent(currentCastSymbols, allocatedSymbols);
    allocatedProgramSymbols = {
      ...allocatedProgramSymbols,
      [programId]: [...(allocatedProgramSymbols[programId] || []), ...allocatedSymbols],
    };
    startProgramCooldown(program);
  }

  function dealEnemyIntegrityDamage(enemy, rawDamage, defenseStat) {
    const enemyIntegrityBeforeDamage = enemy.stats.integrity;
    const dealtDamage = Math.max(0, rawDamage - (enemy.stats[defenseStat] || 0));
    enemy.stats.integrity = Math.max(0, enemy.stats.integrity - dealtDamage);
    let didLevelUp = false;

    if (enemyIntegrityBeforeDamage > 0 && enemy.stats.integrity <= 0) {
      didLevelUp = addCharacterXp(character, enemy.xpValue);
      enemy.positionId = null;
      enemy.confusedTurns = 0;
      enemy.stunnedTurns = 0;
    }

    return {
      dealtDamage,
      enemyIntegrityBeforeDamage,
      didDefeat: enemyIntegrityBeforeDamage > 0 && enemy.stats.integrity <= 0,
      didLevelUp,
    };
  }

  function updateRoom(options = {}) {
    const shouldCenterCamera = options.centerCamera !== false;
    const isPlayerPhase = turnPhase === "player";
    const securedRoom = isRoomSecured();
    const canMove = securedRoom || actionPointsRemaining > 0;
    const movementRange = securedRoom ? roomTiles.length : actionPointsRemaining;
    const reachableTileIds = isPlayerPhase && isMoveMode && canMove
      ? getReachableTileIds(roomTiles, characterPositionId, movementRange, getOccupiedEnemyTileIds(activeEnemies))
      : [];
    const blinkTargetTileIds = isBlinkTargetMode ? pendingBlinkTargetTileIds : [];
    const attackPreviewTileIds = pendingAttack?.revealTarget ? pendingAttack.targetTileIds || [] : [];
    const previewTileIds = [...attackPreviewTileIds, ...temporaryRevealTileIds];
    const naturalVisibleTileIds = getVisibleTileIds(roomTiles, characterPositionId, baseSightRange + sightRangeBonus);
    naturalVisibleTileIds.forEach((tileId) => exploredTileIds.add(tileId));
    const visibleTileIds = [...new Set([...naturalVisibleTileIds, ...previewTileIds])];
    const targetableEnemyTileIds = pendingAttack
      ? pendingAttack.targetTileIds || getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId)
      : [];
    const visibleEnemies = activeEnemies.filter(
      (enemy) => enemy.positionId && enemy.stats.integrity > 0 && visibleTileIds.includes(enemy.positionId)
    );

    roomGrid.innerHTML = renderRoomTiles(
      roomTiles,
      character,
      characterPositionId,
      activeEnemies,
      [...new Set([...reachableTileIds, ...blinkTargetTileIds, ...attackPreviewTileIds])],
      visibleTileIds,
      [...exploredTileIds],
      targetableEnemyTileIds,
      riftThreadTileIds,
      collectedThreadTileIds,
      artifactTileIds,
      collectedArtifactTileIds,
      sigilPickups,
      collectedSigilTileIds
    );
    enemyInfo.classList.toggle("hidden", !visibleEnemies.length);
    enemyList.innerHTML = visibleEnemies.map(renderEnemyInfo).join("");
    document.querySelector(".artifact-strip").outerHTML = renderArtifactStrip(character.artifacts || []);
    document.querySelector("#character-stats").outerHTML = renderCharacterStats(
      character.stats,
      temporaryExecutionBonusThisTurn + character.nextTurnExecBonus
    );
    document.querySelector(".progression-tracker").outerHTML = renderProgressionTracker(character.progression);
    document.querySelector(".thread-tracker").outerHTML = renderThreadTracker(collectedThreadTileIds.length, riftThreadTileIds.length);
    moveButton.disabled = !isPlayerPhase || !canMove;
    moveButton.textContent = securedRoom ? "Move (Free)" : actionPointsRemaining > 0 ? `Move (${actionPointsRemaining})` : "Actions Spent";
    rollButton.disabled = !isPlayerPhase || isLevelComplete || isRunDefeated || actionPointsRemaining <= 0 || isRunecastingActive;
    rollButton.textContent = isRunecastingActive
      ? "Sigil-Casting"
      : actionPointsRemaining > 0
        ? `Sigil-Cast (${actionPointsRemaining})`
        : "Actions Spent";
    endTurnButton.disabled = !isPlayerPhase || isLevelComplete || isRunDefeated;
    rollConfirm.disabled = rollConfirm.disabled || !isPlayerPhase;
    turnPhaseBanner.textContent = isPlayerPhase ? "Player Turn" : "Glitchspawn Turn";
    turnPhaseBanner.classList.toggle("glitch-phase", !isPlayerPhase);
    document.querySelector(".room-footer").classList.toggle("glitch-phase-active", !isPlayerPhase);
    roomMeta.textContent = `${levelNode.zoneName} / ${levelNode.label} / Turn ${turnNumber}`;

    if (isRunDefeated) {
      roomStatus.textContent = "Integrity depleted. Run terminated.";
      moveButton.disabled = true;
      rollButton.disabled = true;
      endTurnButton.disabled = true;
    } else if (isLevelComplete) {
      roomStatus.textContent = "Rift closed. Level complete.";
      moveButton.disabled = true;
      moveButton.textContent = "Level Complete";
    } else if (securedRoom && isMoveMode) {
      roomStatus.textContent = "All Glitchspawn derezzed. Choose adjacent hexes freely.";
    } else if (securedRoom) {
      roomStatus.textContent = "All Glitchspawn derezzed. Enemy turns are skipped and movement is unrestricted.";
    } else if (isBlinkTargetMode) {
      roomStatus.textContent = "Choose a highlighted hex exactly 2 spaces away in a straight line.";
    } else if (pendingAttack) {
      roomStatus.textContent = pendingAttack.prompt || `Choose an adjacent enemy to deal ${pendingAttack.damage} ${pendingAttack.damageType} damage.`;
    } else if (isMoveMode) {
      roomStatus.textContent = `Choose a highlighted hex. ${actionPointsRemaining} ${actionPointsRemaining === 1 ? "action" : "actions"} remaining this turn.`;
    } else if (actionPointsRemaining <= 0) {
      roomStatus.textContent = "Actions spent for this turn.";
    } else {
      roomStatus.textContent = `${actionPointsRemaining} ${actionPointsRemaining === 1 ? "action" : "actions"} available. Nearby hexes are illuminated.`;
    }

    if (shouldCenterCamera) {
      centerCameraOnTile(characterPositionId);
    }
    updateCamera();
  }

  moveButton.addEventListener("click", () => {
    if (turnPhase !== "player" || (!isRoomSecured() && actionPointsRemaining <= 0) || isLevelComplete || isRunDefeated) {
      return;
    }

    isMoveMode = !isMoveMode;
    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    pendingSymbolAssignment = null;
    suppressTileClick = false;
    dragState = null;
    roomStage.classList.toggle("movement-active", isMoveMode);
    roomStage.classList.remove("dragging");
    updateRoom();
  });

  function clearMovementPreview() {
    roomGrid.querySelectorAll(".movement-route, .movement-destination").forEach((tile) => {
      tile.classList.remove("movement-route", "movement-destination");
    });
  }

  function previewMovementPath(targetTileId) {
    clearMovementPreview();

    if (!isMoveMode || turnPhase !== "player" || isLevelComplete || isRunDefeated) {
      return;
    }

    const movementRange = isRoomSecured() ? roomTiles.length : actionPointsRemaining;
    const path = getMovementPathToTile(
      roomTiles,
      characterPositionId,
      targetTileId,
      movementRange,
      getOccupiedEnemyTileIds(activeEnemies)
    );

    if (!path.length) {
      return;
    }

    path.forEach((tileId, index) => {
      const tileButton = roomGrid.querySelector(`[data-tile-id="${tileId}"]`);

      if (!tileButton) {
        return;
      }

      tileButton.classList.add(index === path.length - 1 ? "movement-destination" : "movement-route");
    });
  }

  roomGrid.addEventListener("mouseover", (event) => {
    const tileButton = event.target.closest("[data-tile-id]");

    if (!tileButton || !roomGrid.contains(tileButton)) {
      return;
    }

    previewMovementPath(tileButton.dataset.tileId);
  });

  roomGrid.addEventListener("mouseleave", clearMovementPreview);

  roomStage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || isMoveMode || turnPhase !== "player") {
      return;
    }

    if ((isPhysicalTargetMode && event.target.closest(".targetable-enemy")) || (isBlinkTargetMode && event.target.closest(".reachable"))) {
      return;
    }

    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: cameraOffset.x,
      originY: cameraOffset.y,
      moved: false,
    };

    roomStage.setPointerCapture(event.pointerId);
    roomStage.classList.add("dragging");
  });

  roomStage.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.moved && Math.hypot(deltaX, deltaY) > 6) {
      dragState.moved = true;
      suppressTileClick = true;
    }

    cameraOffset = clampCameraOffset({
      x: dragState.originX + deltaX,
      y: dragState.originY + deltaY,
    });
    updateCamera();
  });

  function stopDragging(pointerId) {
    if (!dragState || dragState.pointerId !== pointerId) {
      return;
    }

    roomStage.releasePointerCapture(pointerId);
    roomStage.classList.remove("dragging");
    dragState = null;
  }

  roomStage.addEventListener("pointerup", (event) => {
    stopDragging(event.pointerId);
  });

  roomStage.addEventListener("pointercancel", (event) => {
    stopDragging(event.pointerId);
  });

  endTurnButton.addEventListener("click", async () => {
    if (isLevelComplete || turnPhase !== "player") {
      return;
    }

    gameLog("turn.end.begin", getRoomDebugState());

    if (isRoomSecured()) {
      isMoveMode = false;
      isPhysicalTargetMode = false;
      isBlinkTargetMode = false;
      pendingPhysicalDamage = 0;
      pendingAttack = null;
      pendingSymbolAssignment = null;
      suppressTileClick = false;
      dragState = null;
      roomStage.classList.remove("movement-active", "dragging");
      deactivateRunecasting();
      const execBonus = beginPlayerTurn();
      turnNumber += 1;
      selectedRollSlots.length = 0;
      updateRoom();
      let turnStatus = "Glitchspawn turn skipped. Area remains secured.";
      if (execBonus > 0) {
        turnStatus += ` FOCUS adds ${execBonus} temporary ${execBonus === 1 ? "action" : "actions"} this turn.`;
      }
      if (cooldownLockedProgramIds.size) {
        turnStatus += ` ${[...cooldownLockedProgramIds].map((programId) => getProgramById(programId)?.name || programId).join(", ")} ${cooldownLockedProgramIds.size === 1 ? "is" : "are"} cooling down.`;
      }
      roomStatus.textContent = turnStatus;
      gameLog("turn.end.skippedSecuredRoom", { status: turnStatus, state: getRoomDebugState() });
      return;
    }

    turnPhase = "glitch";
    isMoveMode = false;
    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    suppressTileClick = false;
    dragState = null;
    temporaryRevealTileIds = new Set();
    if (sightRangeBonusTurnsRemaining > 0) {
      sightRangeBonusTurnsRemaining -= 1;
      if (sightRangeBonusTurnsRemaining <= 0) {
        sightRangeBonus = 0;
      }
    }
    roomStage.classList.remove("movement-active", "dragging");
    deactivateRunecasting();
    updateRoom();
    roomStatus.textContent = "Glitchspawn Turn.";
    await wait(220);
    const previousTokenRects = captureEnemyTokenRects();
    const previousEnemyPositions = new Map(activeEnemies.map((enemy) => [enemy.instanceId, enemy.positionId]));
    activeEnemies.forEach((enemy) => {
      if (!enemy.positionId || enemy.stats.integrity <= 0) {
        return;
      }

      enemy.positionId = getNextEnemyPosition(roomTiles, enemy, characterPositionId, getOccupiedEnemyTileIds(activeEnemies));
    });
    const movedEnemies = activeEnemies.filter((enemy) => previousEnemyPositions.get(enemy.instanceId) !== enemy.positionId);
    updateRoom();
    await animateEnemyMovement(previousTokenRects);
    const characterTile = roomTiles.find((tile) => tile.id === characterPositionId);
    const isShelteredByHaven = characterTile?.type === "haven";
    const attackingEnemies = isShelteredByHaven
      ? []
      : activeEnemies.filter((enemy) => isEnemyAdjacentToPlayer(roomTiles, enemy, characterPositionId));
    const stunnedEnemies = getLivingEnemies().filter((enemy) => (enemy.stunnedTurns || 0) > 0);
    const stunnedEnemyIds = new Set(stunnedEnemies.map((enemy) => enemy.instanceId));
    let turnStatus = movedEnemies.length
      ? `${movedEnemies.length} Glitch Spawn ${movedEnemies.length === 1 ? "moves" : "move"} closer.`
      : "The Glitch Spawn hold position near the Sigilant.";
    if (isShelteredByHaven) {
      characterTile.type = "havenInactive";
      turnStatus += " Haven protection prevents enemy attacks.";
    }
    if (stunnedEnemies.length) {
      turnStatus += ` ${stunnedEnemies.map((enemy) => enemy.name).join(", ")} ${stunnedEnemies.length === 1 ? "is" : "are"} stunned.`;
      stunnedEnemies.forEach((enemy) => {
        enemy.stunnedTurns = Math.max(0, (enemy.stunnedTurns || 0) - 1);
      });
    }

    let incomingDamage = 0;
    const confusedEnemies = getLivingEnemies().filter((enemy) => enemy.confusedTurns > 0 && !stunnedEnemyIds.has(enemy.instanceId));
    const confusedAttackResults = confusedEnemies
      .map((enemy) => {
        const target = getLivingEnemies().find((candidate) => candidate.instanceId !== enemy.instanceId);

        if (!target) {
          enemy.confusedTurns = Math.max(0, (enemy.confusedTurns || 0) - 1);
          return null;
        }

        const didHit = Math.random() < (enemy.stats.accuracy ?? 0.4);
        let damageResult = null;

        if (didHit) {
          damageResult = dealEnemyIntegrityDamage(target, enemy.stats.power, "physicalDefense");
        }

        enemy.confusedTurns = Math.max(0, (enemy.confusedTurns || 0) - 1);
        return { enemy, target, didHit, damageResult };
      })
      .filter(Boolean);
    const confusedEnemyIds = new Set(confusedEnemies.map((enemy) => enemy.instanceId));
    const playerAttackingEnemies = attackingEnemies.filter((enemy) => !confusedEnemyIds.has(enemy.instanceId) && !stunnedEnemyIds.has(enemy.instanceId));

    if (confusedAttackResults.length) {
      const hits = confusedAttackResults.filter((result) => result.didHit);
      const misses = confusedAttackResults.filter((result) => !result.didHit);

      if (hits.length) {
        turnStatus += ` ${hits
          .map((result) => `${result.enemy.name} hits ${result.target.name} for ${result.damageResult.dealtDamage}`)
          .join(", ")}.`;
      }

      if (misses.length) {
        turnStatus += ` ${misses.map((result) => result.enemy.name).join(", ")} ${misses.length === 1 ? "misses" : "miss"} while confused.`;
      }
    }

    const attackResults = playerAttackingEnemies.map((enemy) => ({
      enemy,
      didHit: Math.random() < (enemy.stats.accuracy ?? 0.4),
    }));
    const hitEnemies = attackResults.filter((result) => result.didHit).map((result) => result.enemy);
    const missedEnemies = attackResults.filter((result) => !result.didHit).map((result) => result.enemy);
    const didConfuseDefeatEnemy = confusedAttackResults.some((result) => result.damageResult?.didDefeat);
    const didConfuseLevelUp = confusedAttackResults.some((result) => result.damageResult?.didLevelUp);

    if (playerAttackingEnemies.length) {
      incomingDamage = hitEnemies.reduce((total, enemy) => total + enemy.stats.power, 0);
      character.stats.integrity = Math.max(0, character.stats.integrity - incomingDamage);
      if (hitEnemies.length) {
        turnStatus += ` ${hitEnemies.map((enemy) => enemy.name).join(", ")} hit for ${incomingDamage} damage.`;
      }
      if (missedEnemies.length) {
        turnStatus += ` ${missedEnemies.map((enemy) => enemy.name).join(", ")} ${missedEnemies.length === 1 ? "misses" : "miss"}.`;
      }
    }

    if (character.stats.integrity <= 0) {
      turnStatus += " Integrity critical.";
      updateRoom();
      if (incomingDamage > 0) {
        showDamageIndicator(characterPositionId, incomingDamage, "player");
      }
      roomStatus.textContent = turnStatus;
      gameLog("turn.end.defeat", {
        movedEnemies: movedEnemies.map((enemy) => enemy.instanceId),
        attackingEnemies: playerAttackingEnemies.map((enemy) => enemy.instanceId),
        confusedEnemies: confusedEnemies.map((enemy) => enemy.instanceId),
        hitEnemies: hitEnemies.map((enemy) => enemy.instanceId),
        missedEnemies: missedEnemies.map((enemy) => enemy.instanceId),
        incomingDamage,
        status: turnStatus,
        state: getRoomDebugState(),
      });
      await wait(450);
      showRunDeathPopup("Your Integrity reached 0.");
      return;
    }

    await wait(180);
    turnPhase = "player";
    const execBonus = beginPlayerTurn();
    turnNumber += 1;
    selectedRollSlots.length = 0;
    updateRoom();
    if (incomingDamage > 0) {
      showDamageIndicator(characterPositionId, incomingDamage, "player");
    }
    if (didConfuseLevelUp) {
      window.setTimeout(showImmediateLevelReward, 120);
    }
    if (didConfuseDefeatEnemy && !hasLivingEnemies()) {
      window.setTimeout(showAllDerezzedNotice, didConfuseLevelUp ? 260 : 120);
    }
    if (execBonus > 0) {
      turnStatus += ` FOCUS adds ${execBonus} temporary ${execBonus === 1 ? "action" : "actions"} this turn.`;
    }
    if (cooldownLockedProgramIds.size) {
      turnStatus += ` ${[...cooldownLockedProgramIds].map((programId) => getProgramById(programId)?.name || programId).join(", ")} ${cooldownLockedProgramIds.size === 1 ? "is" : "are"} cooling down.`;
    }
    roomStatus.textContent = turnStatus;
    gameLog("turn.end.resolved", {
      movedEnemies: movedEnemies.map((enemy) => enemy.instanceId),
      attackingEnemies: playerAttackingEnemies.map((enemy) => enemy.instanceId),
      confusedEnemies: confusedEnemies.map((enemy) => enemy.instanceId),
      hitEnemies: hitEnemies.map((enemy) => enemy.instanceId),
      missedEnemies: missedEnemies.map((enemy) => enemy.instanceId),
      incomingDamage,
      status: turnStatus,
      state: getRoomDebugState(),
    });
  });

  function updateRunecastingPanel(results = []) {
    const spentResultIndices = new Set(
      Array.isArray(currentCastSymbols)
        ? currentCastSymbols.filter((symbol) => symbol.spent).map((symbol) => symbol.resultIndex)
        : []
    );

    const assignableResultIndices = pendingSymbolAssignment?.candidateResultIndices || new Set();

    rollOptions.innerHTML = renderRollDieOptions(character, selectedRollSlots, currentCastSymbols);
    rollResults.innerHTML = renderRollResultSlots(
      character,
      selectedRollSlots,
      results,
      spentResultIndices,
      assignableResultIndices,
      currentCastSymbols
    );
    const hasRollResults = Array.isArray(currentCastSymbols) && currentCastSymbols.length;
    rollConfirm.disabled =
      !isRunecastingActive ||
      isRolling ||
      executionRollsRemaining <= 0 ||
      (hasRollResults && !selectedRollSlots.length);
  }

  function updateProgramAvailability() {
    programListItems.innerHTML = renderPrograms(character.programs, currentCastSymbols, {
      showPhysicalFallback: isRunecastingActive,
      allocations: allocatedProgramSymbols,
      cacheLimit: character.stats.cache,
      cooldownLockedProgramIds,
      cooldowns: programCooldowns,
    });
  }

  function hasUsableCastSymbols() {
    return Array.isArray(currentCastSymbols) && currentCastSymbols.some((symbol) => !symbol.spent && !symbol.blank);
  }

  function finishRunecastingIfNoOptions(statusText = "") {
    if (
      !isRunecastingActive ||
      executionRollsRemaining > 0 ||
      hasUsableCastSymbols() ||
      pendingAttack ||
      isBlinkTargetMode ||
      pendingSymbolAssignment
    ) {
      return false;
    }

    deactivateRunecasting();
    if (statusText) {
      roomStatus.textContent = statusText;
    }
    return true;
  }

  function resolvePlayerTileEntry() {
    let status = "";

    if (riftThreadTileIds.includes(characterPositionId) && !collectedThreadTileIds.includes(characterPositionId)) {
      collectedThreadTileIds.push(characterPositionId);
      status = `Rift Thread acquired. ${collectedThreadTileIds.length}/${riftThreadTileIds.length} collected.`;
      gameLog("tile.threadCollected", { tileId: characterPositionId, state: getRoomDebugState() });
    }

    if (cacheTileIds.includes(characterPositionId) && !collectedCacheTileIds.includes(characterPositionId)) {
      collectedCacheTileIds.push(characterPositionId);
      window.setTimeout(showCacheUpgrade, 120);
      status = status ? `${status} Cache node accessed.` : "Cache node accessed.";
      gameLog("tile.cacheAccessed", { tileId: characterPositionId, state: getRoomDebugState() });
    }

    if (artifactTileIds.includes(characterPositionId) && !collectedArtifactTileIds.includes(characterPositionId)) {
      collectedArtifactTileIds.push(characterPositionId);
      window.setTimeout(() => showArtifactChoice(characterPositionId), 120);
      status = status ? `${status} Artifact signal accessed.` : "Artifact signal accessed.";
      gameLog("tile.artifactAccessed", { tileId: characterPositionId, state: getRoomDebugState() });
    }

    const sigilPickup = sigilPickups.find((pickup) => pickup.tileId === characterPositionId);
    if (sigilPickup && !collectedSigilTileIds.includes(characterPositionId)) {
      collectedSigilTileIds.push(characterPositionId);
      window.setTimeout(() => showSigilPickupChoice(sigilPickup), 120);
      const sigil = getSigilDefinition(sigilPickup.sigil.element, sigilPickup.sigil.face);
      status = status ? `${status} ${sigil.name} sigil acquired.` : `${sigil.name} sigil acquired.`;
      gameLog("tile.sigilCollected", { tileId: characterPositionId, sigil: sigilPickup.sigil, state: getRoomDebugState() });
    }

    const currentTile = roomTiles.find((tile) => tile.id === characterPositionId);
    if (currentTile?.type === "powerHub" && !usedPowerHubTileIds.includes(characterPositionId)) {
      usedPowerHubTileIds.push(characterPositionId);
      currentTile.type = "powerHubOff";
      const integrityBeforeHeal = character.stats.integrity;
      character.stats.integrity = Math.min(character.stats.maxIntegrity, character.stats.integrity + 2);
      const healedIntegrity = character.stats.integrity - integrityBeforeHeal;
      status = status ? `${status} Power Hub restored ${healedIntegrity} Integrity.` : `Power Hub restored ${healedIntegrity} Integrity.`;
      gameLog("tile.powerHubUsed", { tileId: characterPositionId, healedIntegrity, state: getRoomDebugState() });
    }

    if (characterPositionId === riftTile.id) {
      if (collectedThreadTileIds.length >= riftThreadTileIds.length) {
        isLevelComplete = true;
        isMoveMode = false;
        isBlinkTargetMode = false;
        isPhysicalTargetMode = false;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        gameLog("level.riftClosed", getRoomDebugState());
        return status ? `${status} Rift closed. Level complete.` : "Rift closed. Level complete.";
      }

      if (collectedThreadTileIds.length < riftThreadTileIds.length) {
        return status || `The Rift resists closure. Collect ${riftThreadTileIds.length - collectedThreadTileIds.length} Rift Thread first.`;
      }

      return status || "The Rift is ready to close.";
    }

    return status;
  }

  function finishLevelIfComplete(status) {
    if (!isLevelComplete) {
      return;
    }

    updateRoom();
    roomStatus.textContent = status || "Rift closed. Level complete.";
    window.setTimeout(() => showLevelComplete(character, levelNode.id), 500);
  }

  function getCacheProgramOptions() {
    const ownedPrograms = new Set(ensureProgramLibrary(character));
    const loadoutElements = getCharacterLoadoutElements(character);

    return getRandomOptions(
      Object.values(programs).filter((program) => {
        const requiredElements = Array.isArray(program.requirement) && program.requirement.length
          ? program.requirement.map((requirement) => requirement.element)
          : [program.element];

        return !ownedPrograms.has(program.id) && requiredElements.some((element) => loadoutElements.has(element));
      }),
      2
    );
  }

  function applyArtifact(artifact) {
    character.artifacts = character.artifacts || [];
    character.artifacts.push(artifact);
    const amount = Number.isFinite(artifact.amount) ? artifact.amount : 1;

    if (artifact.stat === "maxIntegrity") {
      character.stats.maxIntegrity += amount;
      character.stats.integrity = Math.min(character.stats.maxIntegrity, character.stats.integrity + amount);
      return;
    }

    if (Number.isFinite(character.stats[artifact.stat])) {
      character.stats[artifact.stat] += amount;
    }
  }

  function closeCacheUpgrade(status) {
    document.querySelector(".cache-upgrade-overlay")?.remove();
    updateRoom();
    roomStatus.textContent = status;
  }

  function showArtifactChoice(tileId) {
    const artifactOptions = getRandomOptions(artifacts, 2);
    const overlay = document.createElement("div");

    gameLog("artifact.popup.open", {
      tileId,
      artifactOptions: artifactOptions.map((artifact) => artifact.id),
      state: getRoomDebugState(),
    });

    overlay.className = "cache-upgrade-overlay artifact-choice-overlay";
    overlay.innerHTML = `
      <section class="cache-upgrade-panel" aria-labelledby="artifact-choice-title">
        <p class="signal">Artifact Signal</p>
        <h2 id="artifact-choice-title">Choose Artifact</h2>
        <div class="cache-upgrade-grid">
          ${
            artifactOptions.length
              ? artifactOptions
                  .map(
                    (artifact) => `
                      <button class="secondary-action reward-choice artifact-choice" type="button" data-artifact-choice="${artifact.id}">
                        <strong>${artifact.name}</strong>
                        <small>${artifact.label}</small>
                      </button>
                    `
                  )
                  .join("")
              : `<p class="program-preview-empty">No artifacts available.</p>`
          }
        </div>
      </section>
    `;

    document.querySelector(".room-screen").appendChild(overlay);

    overlay.querySelectorAll("[data-artifact-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const artifact = artifactOptions.find((option) => option.id === button.dataset.artifactChoice);

        if (!artifact) {
          return;
        }

        applyArtifact(artifact);
        overlay.remove();
        updateRoom();
        roomStatus.textContent = `${artifact.name} acquired. ${artifact.label}.`;
        gameLog("tile.artifactCollected", { tileId, artifactId: artifact.id, state: getRoomDebugState() });
      });
    });
  }

  function showSigilPickupChoice(pickup) {
    const sigil = getSigilDefinition(pickup.sigil.element, pickup.sigil.face);
    const blankSlots = getBlankDieFaceSlots(character);

    if (!blankSlots.length) {
      character.sigilInventory = character.sigilInventory || [];
      character.sigilInventory.push(pickup.sigil);
      updateRoom();
      roomStatus.textContent = `${sigil.name} sigil held in reserve. No blank die faces available.`;
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "cache-upgrade-overlay sigil-pickup-overlay";
    overlay.innerHTML = `
      <section class="cache-upgrade-panel" aria-labelledby="sigil-pickup-title">
        <p class="signal">Floating Sigil</p>
        <h2 id="sigil-pickup-title">New Sigil Acquired</h2>
        <div class="sigil-pickup-preview" style="--die-accent: ${sigil.accent}">
          <img src="${sigil.image}" alt="${sigil.name} sigil">
          <span>Common ${sigil.name}</span>
        </div>
        <div class="cache-upgrade-grid single-reward">
          <article class="reward-card">
            <h3>Equip Sigil:</h3>
            <div class="reward-choice-grid">
              ${blankSlots
                .map(
                  (slot) => `
                    <button class="secondary-action reward-choice" type="button" data-die-index="${slot.dieIndex}" data-face-index="${slot.faceIndex}">
                      <strong>Die ${slot.dieIndex + 1}</strong>
                      <small>Face ${slot.faceIndex + 1}</small>
                    </button>
                  `
                )
                .join("")}
            </div>
          </article>
        </div>
      </section>
    `;

    document.querySelector(".room-screen").appendChild(overlay);
    overlay.querySelectorAll("[data-die-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const dieIndex = Number(button.dataset.dieIndex);
        const faceIndex = Number(button.dataset.faceIndex);

        if (!addSigilToDieFace(character, pickup.sigil, dieIndex, faceIndex)) {
          return;
        }

        overlay.remove();
        updateRoom();
        roomStatus.textContent = `${sigil.name} sigil equipped to Die ${dieIndex + 1}, Face ${faceIndex + 1}.`;
        gameLog("sigil.socketed", { sigil: pickup.sigil, dieIndex, faceIndex, state: getRoomDebugState() });
      });
    });
  }

  function showProgramLibraryEquip(status = "Choose equipped programs.") {
    const library = ensureProgramLibrary(character);
    const requiredCount = Math.min(character.stats.cache, library.length);
    let selectedProgramIds = character.programs.filter((programId) => library.includes(programId)).slice(0, requiredCount);

    if (selectedProgramIds.length < requiredCount) {
      library.forEach((programId) => {
        if (selectedProgramIds.length < requiredCount && !selectedProgramIds.includes(programId)) {
          selectedProgramIds.push(programId);
        }
      });
    }

    const overlay = document.createElement("div");
    overlay.className = "cache-upgrade-overlay program-library-overlay";

    function renderChoices() {
      return library
        .map((programId) => {
          const program = getProgramById(programId);
          const isSelected = selectedProgramIds.includes(programId);

          return renderProgramRewardChoice(
            program,
            `data-library-program="${program.id}" aria-pressed="${isSelected}"`,
            isSelected ? "selected" : ""
          );
        })
        .join("");
    }

    function renderOverlay() {
      overlay.innerHTML = `
        <section class="cache-upgrade-panel" aria-labelledby="program-library-title">
          <p class="signal">Program Library</p>
          <h2 id="program-library-title">Equip Programs</h2>
          <p class="program-preview-empty">${status} CACHE ${selectedProgramIds.length}/${requiredCount} equipped.</p>
          <div class="cache-upgrade-grid single-reward">
            <article class="reward-card">
              <h3>Owned Programs</h3>
              <div class="reward-choice-grid">
                ${renderChoices()}
              </div>
            </article>
          </div>
          <button class="primary-action" type="button" id="confirm-program-library" ${selectedProgramIds.length === requiredCount ? "" : "disabled"}>Confirm Loadout</button>
        </section>
      `;
    }

    function bindOverlay() {
      overlay.querySelectorAll("[data-library-program]").forEach((button) => {
        button.addEventListener("click", () => {
          const programId = button.dataset.libraryProgram;

          if (selectedProgramIds.includes(programId)) {
            selectedProgramIds = selectedProgramIds.filter((id) => id !== programId);
          } else if (selectedProgramIds.length < requiredCount) {
            selectedProgramIds.push(programId);
          }

          renderOverlay();
          bindOverlay();
        });
      });

      overlay.querySelector("#confirm-program-library").addEventListener("click", () => {
        if (selectedProgramIds.length !== requiredCount) {
          return;
        }

        character.programs = [...selectedProgramIds];
        overlay.remove();
        updateProgramAvailability();
        updateRoom();
        roomStatus.textContent = "Program loadout updated.";
        gameLog("program.libraryEquipped", { equippedPrograms: character.programs, state: getRoomDebugState() });
      });
    }

    renderOverlay();
    document.querySelector(".room-screen").appendChild(overlay);
    bindOverlay();
  }

  function showCacheUpgrade() {
    const programOptions = getCacheProgramOptions();
    const overlay = document.createElement("div");

    gameLog("cache.popup.open", {
      programOptions: programOptions.map((program) => program.id),
      library: ensureProgramLibrary(character),
      state: getRoomDebugState(),
    });

    overlay.className = "cache-upgrade-overlay";
    overlay.innerHTML = `
      <section class="cache-upgrade-panel" aria-labelledby="cache-upgrade-title">
        <p class="signal">Cache Node</p>
        <h2 id="cache-upgrade-title">Choose Program</h2>
        <div class="cache-upgrade-grid single-reward">
          <article class="reward-card">
            <h3>New Program</h3>
            <div class="reward-choice-grid">
              ${
                programOptions.length
                  ? programOptions
                      .map(
                        (program) => renderProgramRewardChoice(program, `data-cache-program="${program.id}"`)
                      )
                      .join("")
                  : `<p class="program-preview-empty">No new programs available.</p>`
              }
            </div>
          </article>
        </div>
      </section>
    `;
    document.querySelector(".room-screen").appendChild(overlay);

    overlay.querySelectorAll("[data-cache-program]").forEach((button) => {
      button.addEventListener("click", () => {
        const program = getProgramById(button.dataset.cacheProgram);

        if (!program) {
          return;
        }

        ensureProgramLibrary(character);

        if (!character.programLibrary.includes(program.id)) {
          character.programLibrary.push(program.id);
        }

        gameLog("cache.programSelected", { programId: program.id, library: character.programLibrary, state: getRoomDebugState() });
        document.querySelector(".cache-upgrade-overlay")?.remove();

        if (character.programs.length < character.stats.cache) {
          character.programs.push(program.id);
          updateProgramAvailability();
          updateRoom();
          roomStatus.textContent = `${program.name} added to library and equipped.`;
          return;
        }

        showProgramLibraryEquip(`${program.name} added. Choose ${Math.min(character.stats.cache, character.programLibrary.length)} programs to equip.`);
      });
    });

  }

  function showImmediateLevelReward() {
    if ((character.progression.pendingRewards || 0) <= 0 || document.querySelector(".level-reward-overlay")) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "cache-upgrade-overlay level-reward-overlay";
    overlay.innerHTML = `
      <section class="cache-upgrade-panel" aria-labelledby="level-reward-title">
        <p class="signal">Level ${character.progression.level} Reached</p>
        <h2 id="level-reward-title">New Blank Die</h2>
        <div class="cache-upgrade-grid single-reward">
          <article class="reward-card">
            <h3>Add Blank Die</h3>
            <div class="reward-choice-grid">
              <button class="secondary-action reward-choice" type="button" id="add-blank-level-die">
                <strong>Blank Die</strong>
                <small>Six empty faces for future sigils.</small>
              </button>
            </div>
          </article>
        </div>
      </section>
    `;

    document.querySelector(".room-screen").appendChild(overlay);
    overlay.querySelector("#add-blank-level-die").addEventListener("click", () => {
      character.loadout.push(createBlankDie());
      character.progression.pendingRewards = Math.max(0, (character.progression.pendingRewards || 0) - 1);
      overlay.remove();
      updateRoom();
      roomStatus.textContent = "Blank die added to the pool.";

      if (character.progression.pendingRewards > 0) {
        window.setTimeout(showImmediateLevelReward, 120);
      }
    });

    gameLog("level.reward.open", { level: character.progression.level, state: getRoomDebugState() });
  }

  function deactivateRunecasting() {
    isRunecastingActive = false;
    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    pendingAttack = null;
    pendingSymbolAssignment = null;
    isRolling = false;
    currentCastSymbols = null;
    allocatedProgramSymbols = {};
    runecastPanel.classList.add("inactive");
    rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
    updateProgramAvailability();
    updateRunecastingPanel();
    updateRoom();
  }

  function activateRunecasting() {
    if (turnPhase !== "player") {
      return;
    }

    if (actionPointsRemaining <= 0) {
      rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
      gameLog("sigilCast.blocked.noCasts", getRoomDebugState());
      return;
    }

    actionPointsRemaining -= 1;
    executionRollsRemaining = character.stats.exec + temporaryExecutionBonusThisTurn;
    isRunecastingActive = true;
    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    pendingAttack = null;
    pendingSymbolAssignment = null;
    currentCastSymbols = [];
    allocatedProgramSymbols = {};
    selectedRollSlots.length = 0;
    runecastPanel.classList.remove("inactive");
    rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
    updateProgramAvailability();
    updateRunecastingPanel();
    updateRoom();
    gameLog("sigilCast.panelActivated", getRoomDebugState());
  }

  rollButton.addEventListener("click", () => {
    if (turnPhase !== "player" || isRunecastingActive || isLevelComplete || actionPointsRemaining <= 0) {
      return;
    }
    activateRunecasting();
  });

  function getAssignableProgramSymbols(program, selectedSymbols = []) {
    if (!Array.isArray(currentCastSymbols) || !program?.requirement?.length) {
      return [];
    }

    const requirement = program.requirement[selectedSymbols.length];
    const selectedResultIndices = new Set(selectedSymbols.map((symbol) => symbol.resultIndex));

    if (!requirement) {
      return [];
    }

    return currentCastSymbols.filter(
      (symbol) =>
        !symbol.spent &&
        !symbol.blank &&
        !selectedResultIndices.has(symbol.resultIndex) &&
        symbol.element === requirement.element &&
        symbol.face === requirement.face
    );
  }

  function queueSymbolAssignment(programId, symbols, status, selectedSymbols = []) {
    pendingSymbolAssignment = {
      programId,
      candidateResultIndices: new Set(symbols.map((symbol) => symbol.resultIndex)),
      selectedSymbols,
    };
    isMoveMode = false;
    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    pendingAttack = null;
    roomStage.classList.remove("movement-active", "dragging");
    updateProgramAvailability();
    updateRunecastingPanel();
    updateRoom();
    rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
    roomStatus.textContent = status;
  }

  function resolveAssignedProgram(programId, selectedSymbol) {
    const assignment = pendingSymbolAssignment;
    let allocatedSymbols = [];
    let attackDamage = 0;
    let defenseStat = "physicalDefense";
    let damageType = "physical";
    let healAmount = 0;
    let statusLabel = "Physical Damage";

    pendingSymbolAssignment = null;

    if (programId === "physical-damage") {
      allocatedSymbols = findPhysicalAllocationFromSymbol(currentCastSymbols, selectedSymbol);
      attackDamage = getPhysicalDamageFromAllocation(allocatedSymbols);
    } else {
      const program = getProgramById(programId);
      const effect = program?.effect || {};

      if (
        !program ||
        !selectedSymbol ||
        !["damageAdjacent", "damageLine", "debuffDefense", "damageAdjacentAll", "confuseEnemy", "resetOtherCooldowns", "healIntegrity", "blinkStraight", "nextTurnExec", "revealRiftThreads", "pushEnemy", "sightRangeBonus"].includes(effect.type)
      ) {
        return;
      }

      allocatedSymbols = [...(assignment?.selectedSymbols || []), selectedSymbol];

      if (allocatedSymbols.length < program.requirement.length) {
        const nextSymbols = getAssignableProgramSymbols(program, allocatedSymbols);

        if (!nextSymbols.length) {
          pendingSymbolAssignment = null;
          updateProgramAvailability();
          updateRunecastingPanel();
          roomStatus.textContent = `${program.name} needs another required sigil.`;
          return;
        }

        queueSymbolAssignment(
          programId,
          nextSymbols,
          `Choose sigil ${allocatedSymbols.length + 1}/${program.requirement.length} for ${program.name}.`,
          allocatedSymbols
        );
        return;
      }

      if (effect.type === "nextTurnExec") {
        const execAmount = Number.isFinite(effect.amount) ? effect.amount : 1;
        currentCastSymbols = markSymbolsSpent(currentCastSymbols, allocatedSymbols);
        allocatedProgramSymbols = {
          ...allocatedProgramSymbols,
          [programId]: [...(allocatedProgramSymbols[programId] || []), ...allocatedSymbols],
        };
        character.nextTurnExecBonus += execAmount;
        startProgramCooldown(program);
        isMoveMode = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
        roomStatus.textContent = `${program.name} will add ${execAmount} temporary ${execAmount === 1 ? "Execution" : "Executions"} next turn.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("program.nextTurnExecResolved", { programId, execAmount, state: getRoomDebugState() });
        return;
      }

      if (effect.type === "blinkStraight") {
        const blinkDistance = Number.isFinite(effect.distance) ? effect.distance : 2;
        const blinkTargetTileIds = getBlinkTargetTileIds(roomTiles, characterPositionId, getOccupiedEnemyTileIds(activeEnemies), blinkDistance);

        if (!blinkTargetTileIds.length) {
          updateProgramAvailability();
          updateRunecastingPanel();
          updateRoom();
          roomStatus.textContent = "BLINK has no valid straight-line target.";
          return;
        }

        currentCastSymbols = markSymbolsSpent(currentCastSymbols, allocatedSymbols);
        allocatedProgramSymbols = {
          ...allocatedProgramSymbols,
          [programId]: [...(allocatedProgramSymbols[programId] || []), ...allocatedSymbols],
        };
        startProgramCooldown(program);
        isMoveMode = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = true;
        pendingBlinkTargetTileIds = blinkTargetTileIds;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        gameLog("program.blinkTargeting", { targets: blinkTargetTileIds, state: getRoomDebugState() });
        return;
      }

      if (effect.type === "healIntegrity") {
        const healAmount = Number.isFinite(effect.amount) ? effect.amount : 1;
        markProgramAllocated(programId, program, allocatedSymbols);
        character.stats.integrity = Math.min(character.stats.maxIntegrity, character.stats.integrity + healAmount);
        isMoveMode = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        roomStatus.textContent = `${program.name} restored ${healAmount} Integrity.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("program.rebuildResolved", getRoomDebugState());
        return;
      }

      if (effect.type === "resetOtherCooldowns") {
        Object.keys(programCooldowns).forEach((cooldownProgramId) => {
          if (cooldownProgramId !== programId) {
            delete programCooldowns[cooldownProgramId];
            cooldownLockedProgramIds.delete(cooldownProgramId);
          }
        });
        markProgramAllocated(programId, program, allocatedSymbols);
        isMoveMode = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        roomStatus.textContent = `${program.name} reset cooldowns on all other programs.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("program.cooldownsReset", { programId, cooldowns: { ...programCooldowns }, state: getRoomDebugState() });
        return;
      }

      if (effect.type === "revealRiftThreads") {
        markProgramAllocated(programId, program, allocatedSymbols);
        temporaryRevealTileIds = new Set(riftThreadTileIds.filter((tileId) => !collectedThreadTileIds.includes(tileId)));
        isMoveMode = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        roomStatus.textContent = `${program.name} revealed ${temporaryRevealTileIds.size} Rift Thread ${temporaryRevealTileIds.size === 1 ? "hex" : "hexes"} for this turn.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("program.riftThreadsRevealed", { programId, revealedTileIds: [...temporaryRevealTileIds], state: getRoomDebugState() });
        return;
      }

      if (effect.type === "sightRangeBonus") {
        const bonusAmount = Number.isFinite(effect.amount) ? effect.amount : 1;
        const playerTurns = Number.isFinite(effect.playerTurns) ? effect.playerTurns : 2;
        markProgramAllocated(programId, program, allocatedSymbols);
        sightRangeBonus = Math.max(sightRangeBonus, bonusAmount);
        sightRangeBonusTurnsRemaining = Math.max(sightRangeBonusTurnsRemaining, playerTurns);
        isMoveMode = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        roomStatus.textContent = `${program.name} increased sight range by ${bonusAmount} until the end of your next turn.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("program.sightRangeBonusResolved", { programId, bonusAmount, playerTurns, state: getRoomDebugState() });
        return;
      }

      if (effect.type === "pushEnemy") {
        const pushableEnemyTileIds = getPushableEnemyTileIds(roomTiles, activeEnemies, characterPositionId);

        if (!pushableEnemyTileIds.length) {
          updateProgramAvailability();
          updateRunecastingPanel();
          updateRoom();
          roomStatus.textContent = `${program.name} requires an adjacent enemy with an open hex behind it.`;
          return;
        }

        markProgramAllocated(programId, program, allocatedSymbols);
        isMoveMode = false;
        isPhysicalTargetMode = true;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = {
          programId,
          label: program.name,
          effectType: "pushEnemy",
          stunTurns: Number.isFinite(effect.stunTurns) ? effect.stunTurns : 1,
          targetTileIds: pushableEnemyTileIds,
          prompt: "Choose an adjacent enemy to push and stun.",
        };
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        return;
      }

      if (effect.type === "damageAdjacentAll") {
        const adjacentEnemyTileIds = getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId);

        if (!adjacentEnemyTileIds.length) {
          updateProgramAvailability();
          updateRunecastingPanel();
          updateRoom();
          roomStatus.textContent = `${program.name} requires at least one adjacent enemy.`;
          return;
        }

        const selfDamage = Number.isFinite(effect.selfDamage) ? effect.selfDamage : 0;
        const rawDamage = Number.isFinite(effect.amount) ? effect.amount : 1;
        const defense = effect.damageType === "arcane" ? "arcaneDefense" : "physicalDefense";
        const damagedEnemies = adjacentEnemyTileIds
          .map((tileId) => getEnemyAtTile(activeEnemies, tileId))
          .filter(Boolean)
          .map((enemy) => ({ enemy, tileId: enemy.positionId, result: dealEnemyIntegrityDamage(enemy, rawDamage, defense) }));
        const defeatedEnemies = damagedEnemies.filter((item) => item.result.didDefeat);
        const didLevelUp = damagedEnemies.some((item) => item.result.didLevelUp);

        markProgramAllocated(programId, program, allocatedSymbols);
        character.stats.integrity = Math.max(0, character.stats.integrity - selfDamage);
        isMoveMode = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        if (selfDamage > 0) {
          showDamageIndicator(characterPositionId, selfDamage, "player");
        }
        damagedEnemies.forEach((item) => showDamageIndicator(item.tileId, item.result.dealtDamage, "enemy"));
        roomStatus.textContent = `${program.name} cost ${selfDamage} Integrity and hit ${damagedEnemies.length} adjacent ${damagedEnemies.length === 1 ? "enemy" : "enemies"}.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        if (didLevelUp) {
          window.setTimeout(showImmediateLevelReward, 120);
        }
        if (defeatedEnemies.length && !hasLivingEnemies()) {
          window.setTimeout(showAllDerezzedNotice, didLevelUp ? 260 : 120);
        }
        if (character.stats.integrity <= 0) {
          window.setTimeout(() => showRunDeathPopup(`${program.name} consumed your last Integrity.`), 260);
        }
        gameLog("program.damageAdjacentAllResolved", { programId, selfDamage, damagedEnemies, state: getRoomDebugState() });
        return;
      }

      if (effect.type === "debuffDefense") {
        const adjacentEnemyTileIds = getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId);

        if (!adjacentEnemyTileIds.length) {
          updateProgramAvailability();
          updateRunecastingPanel();
          updateRoom();
          roomStatus.textContent = "SHATTER requires an adjacent enemy.";
          return;
        }

        currentCastSymbols = markSymbolsSpent(currentCastSymbols, allocatedSymbols);
        allocatedProgramSymbols = {
          ...allocatedProgramSymbols,
          [programId]: [...(allocatedProgramSymbols[programId] || []), ...allocatedSymbols],
        };
        startProgramCooldown(program);
        isMoveMode = false;
        isPhysicalTargetMode = true;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = {
          programId,
          label: program.name,
          effectType: "debuffDefense",
          defenseReduction: Number.isFinite(effect.amount) ? effect.amount : 1,
          targetTileIds: adjacentEnemyTileIds,
          prompt: `Choose an adjacent enemy to reduce defenses by ${Number.isFinite(effect.amount) ? effect.amount : 1}.`,
        };
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        return;
      }

      if (effect.type === "confuseEnemy") {
        const adjacentEnemyTileIds = getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId);

        if (!adjacentEnemyTileIds.length) {
          updateProgramAvailability();
          updateRunecastingPanel();
          updateRoom();
          roomStatus.textContent = `${program.name} requires an adjacent enemy.`;
          return;
        }

        if (getLivingEnemies().length < 2) {
          updateProgramAvailability();
          updateRunecastingPanel();
          updateRoom();
          roomStatus.textContent = `${program.name} needs another Glitchspawn for the target to attack.`;
          return;
        }

        markProgramAllocated(programId, program, allocatedSymbols);
        isMoveMode = false;
        isPhysicalTargetMode = true;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = {
          programId,
          label: program.name,
          effectType: "confuseEnemy",
          duration: Number.isFinite(effect.duration) ? effect.duration : 1,
          targetTileIds: adjacentEnemyTileIds,
          prompt: `Choose an adjacent enemy to confuse for its next turn.`,
        };
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        return;
      }

      if (effect.type === "damageLine") {
        const lineDistance = Number.isFinite(effect.distance) ? effect.distance : 2;
        const lineTargetTileIds = getLineTargetTileIds(roomTiles, characterPositionId, lineDistance, [], { allowOccupied: true });

        if (!lineTargetTileIds.length) {
          updateProgramAvailability();
          updateRunecastingPanel();
          updateRoom();
          roomStatus.textContent = `${program.name} has no valid straight-line target.`;
          return;
        }

        currentCastSymbols = markSymbolsSpent(currentCastSymbols, allocatedSymbols);
        allocatedProgramSymbols = {
          ...allocatedProgramSymbols,
          [programId]: [...(allocatedProgramSymbols[programId] || []), ...allocatedSymbols],
        };
        startProgramCooldown(program);
        isMoveMode = false;
        isPhysicalTargetMode = true;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = Number.isFinite(effect.amount) ? effect.amount : 1;
        pendingAttack = {
          programId,
          label: program.name,
          damage: pendingPhysicalDamage,
          defenseStat: effect.damageType === "arcane" ? "arcaneDefense" : "physicalDefense",
          damageType: effect.damageType === "arcane" ? "arcane" : "physical",
          targetTileIds: lineTargetTileIds,
          revealTarget: Boolean(effect.revealTarget),
          allowEmptyTarget: true,
          prompt: `Choose a hex ${lineDistance} spaces away in a straight line.`,
        };
        roomStage.classList.remove("movement-active", "dragging");
        updateProgramAvailability();
        updateRunecastingPanel();
        updateRoom();
        return;
      }

      attackDamage = Number.isFinite(effect.amount) ? effect.amount : 1;
      damageType = effect.damageType === "physical" ? "physical" : "arcane";
      defenseStat = damageType === "physical" ? "physicalDefense" : "arcaneDefense";
      healAmount = Number.isFinite(effect.healAmount) ? effect.healAmount : 0;
      statusLabel = program.name;
    }

    if (!allocatedSymbols.length) {
      updateProgramAvailability();
      updateRunecastingPanel();
      return;
    }

    const adjacentEnemyTileIds = getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId);

    if (!adjacentEnemyTileIds.length) {
      isPhysicalTargetMode = false;
      pendingPhysicalDamage = 0;
      pendingAttack = null;
      pendingSymbolAssignment = null;
      updateRoom();
      roomStatus.textContent = "This program requires an adjacent enemy.";
      return;
    }

    currentCastSymbols = markSymbolsSpent(currentCastSymbols, allocatedSymbols);
    allocatedProgramSymbols = {
      ...allocatedProgramSymbols,
      [programId]: [...(allocatedProgramSymbols[programId] || []), ...allocatedSymbols],
    };
    if (programId !== "physical-damage") {
      startProgramCooldown(getProgramById(programId));
    }
    isMoveMode = false;
    isPhysicalTargetMode = true;
    pendingPhysicalDamage = attackDamage;
    pendingAttack = {
      programId,
      label: statusLabel,
      damage: attackDamage,
      defenseStat,
      damageType,
      healAmount,
    };
    roomStage.classList.remove("movement-active", "dragging");
    updateProgramAvailability();
    updateRunecastingPanel();
    updateRoom();
    gameLog("program.attackTargeting", { programId, attackDamage, damageType, allocatedSymbols, state: getRoomDebugState() });
  }

  programListItems.addEventListener("click", (event) => {
    const programCard = event.target.closest("[data-program-id]");
    const programId = programCard?.dataset.programId;

    if (turnPhase !== "player" || !programCard || programCard.getAttribute("aria-disabled") === "true" || !Array.isArray(currentCastSymbols)) {
      return;
    }

    if (programId === "physical-damage") {
      const availableSymbols = currentCastSymbols.filter((symbol) => !symbol.spent && !symbol.blank);

      if (!availableSymbols.length) {
        return;
      }

      if (!getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId).length) {
        roomStatus.textContent = "Physical Damage requires an adjacent enemy.";
        return;
      }

      queueSymbolAssignment("physical-damage", availableSymbols, "Choose which rolled sigil to spend for Physical Damage.");
      return;
    }

    const program = getProgramById(programId);
    const effect = program?.effect || {};

    if (!program || !["damageAdjacent", "damageLine", "debuffDefense", "damageAdjacentAll", "confuseEnemy", "resetOtherCooldowns", "healIntegrity", "blinkStraight", "nextTurnExec", "revealRiftThreads", "pushEnemy", "sightRangeBonus"].includes(effect.type)) {
      return;
    }

    if (["damageAdjacent", "damageAdjacentAll"].includes(effect.type) && !getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId).length) {
      roomStatus.textContent = "This program requires an adjacent enemy.";
      return;
    }

    if (["debuffDefense", "confuseEnemy"].includes(effect.type) && !getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId).length) {
      roomStatus.textContent = `${program.name} requires an adjacent enemy.`;
      return;
    }

    if (effect.type === "pushEnemy" && !getPushableEnemyTileIds(roomTiles, activeEnemies, characterPositionId).length) {
      roomStatus.textContent = `${program.name} requires an adjacent enemy with an open hex behind it.`;
      return;
    }

    if (effect.type === "confuseEnemy" && getLivingEnemies().length < 2) {
      roomStatus.textContent = `${program.name} needs another Glitchspawn for the target to attack.`;
      return;
    }

    if (effect.type === "blinkStraight") {
      const blinkDistance = Number.isFinite(effect.distance) ? effect.distance : 2;

      if (!getBlinkTargetTileIds(roomTiles, characterPositionId, getOccupiedEnemyTileIds(activeEnemies), blinkDistance).length) {
        roomStatus.textContent = `${program.name} has no valid straight-line target.`;
        return;
      }
    }

    if (effect.type === "damageLine") {
      const lineDistance = Number.isFinite(effect.distance) ? effect.distance : 2;

      if (!getLineTargetTileIds(roomTiles, characterPositionId, lineDistance, [], { allowOccupied: true }).length) {
        roomStatus.textContent = `${program.name} has no valid straight-line target.`;
        return;
      }
    }

    if (!canCastProgram(program, currentCastSymbols, cooldownLockedProgramIds)) {
      roomStatus.textContent = `${program.name} requires additional sigils.`;
      return;
    }

    const assignableSymbols = getAssignableProgramSymbols(program, []);

    if (!assignableSymbols.length) {
      updateProgramAvailability();
      updateRunecastingPanel();
      return;
    }

    queueSymbolAssignment(programId, assignableSymbols, `Choose sigil 1/${program.requirement.length} for ${program.name}.`);
  });

  rollResults.addEventListener("click", (event) => {
    const result = event.target.closest("[data-result-index]");

    if (!pendingSymbolAssignment || !result || turnPhase !== "player" || isRolling) {
      return;
    }

    const resultIndex = Number(result.dataset.resultIndex);

    if (!pendingSymbolAssignment.candidateResultIndices.has(resultIndex)) {
      return;
    }

    const selectedSymbol = currentCastSymbols.find((symbol) => symbol.resultIndex === resultIndex && !symbol.spent);

    if (!selectedSymbol) {
      return;
    }

    resolveAssignedProgram(pendingSymbolAssignment.programId, selectedSymbol);
  });

  rollOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-roll-slot]");

    if (
      turnPhase !== "player" ||
      !option ||
      !isRunecastingActive ||
      isRolling ||
      executionRollsRemaining <= 0 ||
      !Array.isArray(currentCastSymbols) ||
      !currentCastSymbols.length
    ) {
      return;
    }

    const slotIndex = Number(option.dataset.rollSlot);
    const symbol = currentCastSymbols.find((item) => item.slotIndex === slotIndex);

    if (!symbol || symbol.spent) {
      return;
    }

    const existingIndex = selectedRollSlots.indexOf(slotIndex);

    if (existingIndex >= 0) {
      selectedRollSlots.splice(existingIndex, 1);
    } else {
      selectedRollSlots.push(slotIndex);
      selectedRollSlots.sort((a, b) => a - b);
    }

    isPhysicalTargetMode = false;
    isBlinkTargetMode = false;
    pendingPhysicalDamage = 0;
    pendingAttack = null;
    pendingSymbolAssignment = null;
    updateProgramAvailability();
    rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
    updateRunecastingPanel();
  });

  rollConfirm.addEventListener("click", () => {
    const hasRollResults = Array.isArray(currentCastSymbols) && currentCastSymbols.length;
    const slotsToRoll = hasRollResults ? [...selectedRollSlots] : character.loadout.map((_, index) => index);

    if (
      turnPhase !== "player" ||
      !isRunecastingActive ||
      !slotsToRoll.length ||
      isRolling ||
      executionRollsRemaining <= 0
    ) {
      return;
    }

    gameLog("sigilCast.roll.begin", { selectedRollSlots: [...slotsToRoll], isReroll: hasRollResults, state: getRoomDebugState() });
    selectedRollSlots.length = 0;
    selectedRollSlots.push(...slotsToRoll);
    executionRollsRemaining -= 1;
    isRolling = true;
    rollConfirm.disabled = true;
    rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
    updateRunecastingPanel();
    updateRoom({ centerCamera: false });

    const finalResults = slotsToRoll.map((slotIndex) => rollDie(character.loadout[slotIndex]));
    const disruptiveEnemy = activeEnemies.find(
      (enemy) => enemy.id === "mindPhantom" && enemy.positionId && enemy.stats.integrity > 0
    );

    if (disruptiveEnemy && finalResults.length) {
      const disruptedResultIndex = Math.floor(Math.random() * finalResults.length);
      finalResults[disruptedResultIndex] = rollDie(character.loadout[slotsToRoll[disruptedResultIndex]]);
    }
    let ticks = 0;
    const rollTimer = window.setInterval(() => {
      ticks += 1;
      const temporaryResults = slotsToRoll.map((slotIndex) => rollDie(character.loadout[slotIndex]));
      updateRunecastingPanel(ticks < 12 ? temporaryResults : finalResults);

      if (ticks >= 12) {
        window.clearInterval(rollTimer);
        isRolling = false;
        isPhysicalTargetMode = false;
        isBlinkTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        if (hasRollResults) {
          currentCastSymbols = currentCastSymbols.map((symbol) => {
            const rolledSlotIndex = slotsToRoll.indexOf(symbol.slotIndex);

            if (rolledSlotIndex < 0 || symbol.spent) {
              return symbol;
            }

            return {
              ...symbol,
              element: finalResults[rolledSlotIndex]?.sigil?.element || null,
              face: finalResults[rolledSlotIndex]?.sigil?.face || null,
              faceIndex: finalResults[rolledSlotIndex]?.faceIndex ?? null,
              blank: !finalResults[rolledSlotIndex]?.sigil,
            };
          });
        } else {
          currentCastSymbols = getCastSymbols(character, slotsToRoll, finalResults);
          allocatedProgramSymbols = {};
        }
        selectedRollSlots.length = 0;

        if (executionRollsRemaining <= 0 && !hasUsableCastSymbols()) {
          deactivateRunecasting();
          roomStatus.textContent = "No usable sigils rolled. Executions spent for this Sigil-Cast.";
          gameLog("sigilCast.autoClosed.noUsableSymbols", {
            selectedRollSlots: [...slotsToRoll],
            finalResults,
            isReroll: hasRollResults,
            state: getRoomDebugState(),
          });
          return;
        }

        updateProgramAvailability();
        updateRunecastingPanel(finalResults);
        rollStatus.textContent = getExecutionStatusText(executionRollsRemaining);
        gameLog("sigilCast.roll.complete", {
          selectedRollSlots: [...slotsToRoll],
          finalResults,
          isReroll: hasRollResults,
          disruptedBy: disruptiveEnemy?.instanceId || null,
          state: getRoomDebugState(),
        });
      }
    }, 90);
  });

  roomGrid.addEventListener("click", async (event) => {
    if (suppressTileClick) {
      suppressTileClick = false;
      return;
    }

    const tileButton = event.target.closest("[data-tile-id]");

    if (turnPhase !== "player") {
      return;
    }

    if (tileButton && isBlinkTargetMode) {
      const tileId = tileButton.dataset.tileId;
      const blinkTargetTileIds = pendingBlinkTargetTileIds;

      if (!blinkTargetTileIds.includes(tileId)) {
        return;
      }

      characterPositionId = tileId;
      isBlinkTargetMode = false;
      pendingBlinkTargetTileIds = [];
      isPhysicalTargetMode = false;
      pendingPhysicalDamage = 0;
      pendingAttack = null;
      pendingSymbolAssignment = null;
      roomStage.classList.remove("movement-active", "dragging");
      const entryStatus = resolvePlayerTileEntry();
      updateRoom();
      roomStatus.textContent = entryStatus || "BLINK relocated the Sigilant.";
      finishLevelIfComplete(entryStatus);
      finishRunecastingIfNoOptions(roomStatus.textContent);
      return;
    }

    if (tileButton && pendingAttack) {
      const tileId = tileButton.dataset.tileId;
      const targetableEnemyTileIds = pendingAttack.targetTileIds || getAdjacentEnemyTileIds(roomTiles, activeEnemies, characterPositionId);

      if (!targetableEnemyTileIds.includes(tileId)) {
        return;
      }

      const targetEnemy = getEnemyAtTile(activeEnemies, tileId);

      if (!targetEnemy && !pendingAttack.allowEmptyTarget) {
        return;
      }

      if (!targetEnemy && pendingAttack.allowEmptyTarget) {
        const revealStatus = `${pendingAttack.label} revealed the target space, but hit no enemy.`;
        isPhysicalTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        updateRoom();
        roomStatus.textContent = revealStatus;
        finishRunecastingIfNoOptions(revealStatus);
        return;
      }

      if (pendingAttack.effectType === "debuffDefense") {
        const reduction = pendingAttack.defenseReduction || 1;
        targetEnemy.stats.physicalDefense = Math.max(0, targetEnemy.stats.physicalDefense - reduction);
        targetEnemy.stats.arcaneDefense = Math.max(0, targetEnemy.stats.arcaneDefense - reduction);
        isPhysicalTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        updateRoom();
        roomStatus.textContent = `${targetEnemy.name} defenses reduced by ${reduction}.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("combat.defenseReduced", {
          targetEnemyId: targetEnemy.instanceId,
          reduction,
          state: getRoomDebugState(),
        });
        return;
      }

      if (pendingAttack.effectType === "confuseEnemy") {
        targetEnemy.confusedTurns = Math.max(targetEnemy.confusedTurns || 0, pendingAttack.duration || 1);
        isPhysicalTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        updateRoom();
        roomStatus.textContent = `${targetEnemy.name} is confused and will attack another Glitchspawn next turn.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("program.enemyConfused", {
          targetEnemyId: targetEnemy.instanceId,
          state: getRoomDebugState(),
        });
        return;
      }

      if (pendingAttack.effectType === "pushEnemy") {
        const destinationTileId = getPushDestinationTileId(
          roomTiles,
          characterPositionId,
          targetEnemy.positionId,
          getOccupiedEnemyTileIds(activeEnemies)
        );

        if (!destinationTileId) {
          return;
        }

        targetEnemy.positionId = destinationTileId;
        targetEnemy.stunnedTurns = Math.max(targetEnemy.stunnedTurns || 0, pendingAttack.stunTurns || 1);
        isPhysicalTargetMode = false;
        pendingPhysicalDamage = 0;
        pendingAttack = null;
        pendingSymbolAssignment = null;
        updateRoom();
        roomStatus.textContent = `${targetEnemy.name} was pushed back and stunned for its next turn.`;
        finishRunecastingIfNoOptions(roomStatus.textContent);
        gameLog("program.enemyPushed", {
          targetEnemyId: targetEnemy.instanceId,
          destinationTileId,
          state: getRoomDebugState(),
        });
        return;
      }

      const dealtDamage = Math.max(0, pendingAttack.damage - targetEnemy.stats[pendingAttack.defenseStat]);
      const enemyIntegrityBeforeDamage = targetEnemy.stats.integrity;
      targetEnemy.stats.integrity = Math.max(0, targetEnemy.stats.integrity - dealtDamage);
      const damageLabel = pendingAttack.label;
      const damageType = pendingAttack.damageType;
      const healAmount = pendingAttack.healAmount || 0;
      const integrityBeforeHeal = character.stats.integrity;
      isPhysicalTargetMode = false;
      pendingPhysicalDamage = 0;
      pendingAttack = null;
      pendingSymbolAssignment = null;
      let damageStatus;
      let didLevelUp = false;

      if (enemyIntegrityBeforeDamage > 0 && targetEnemy.stats.integrity <= 0) {
        didLevelUp = addCharacterXp(character, targetEnemy.xpValue);
        targetEnemy.positionId = null;
        targetEnemy.stunnedTurns = 0;
        damageStatus = `${damageLabel} dealt ${dealtDamage} ${damageType} damage. ${targetEnemy.name} derezzed. +${targetEnemy.xpValue} XP.`;
        if (didLevelUp) {
          damageStatus += ` Level ${character.progression.level} reached.`;
        }
      } else {
        damageStatus = `${damageLabel} dealt ${dealtDamage} ${damageType} damage after defense.`;
      }

      if (healAmount > 0) {
        character.stats.integrity = Math.min(character.stats.maxIntegrity, character.stats.integrity + healAmount);
        const healedIntegrity = character.stats.integrity - integrityBeforeHeal;
        damageStatus += ` Healed ${healedIntegrity} Integrity.`;
      }

      updateRoom();
      showDamageIndicator(tileId, dealtDamage, "enemy");
      roomStatus.textContent = damageStatus;
      finishRunecastingIfNoOptions(damageStatus);
      if (didLevelUp) {
        window.setTimeout(showImmediateLevelReward, 120);
      }
      if (!hasLivingEnemies()) {
        window.setTimeout(showAllDerezzedNotice, didLevelUp ? 260 : 120);
      }
      gameLog("combat.damageResolved", {
        targetEnemyId: targetEnemy.instanceId,
        damageLabel,
        dealtDamage,
        damageType,
        targetIntegrityBefore: enemyIntegrityBeforeDamage,
        targetIntegrityAfter: targetEnemy.stats.integrity,
        status: damageStatus,
        state: getRoomDebugState(),
      });
      return;
    }

    if (!tileButton || !isMoveMode) {
      return;
    }

    const tileId = tileButton.dataset.tileId;
    const movementRange = isRoomSecured() ? roomTiles.length : actionPointsRemaining;
    const movementPath = getMovementPathToTile(
      roomTiles,
      characterPositionId,
      tileId,
      movementRange,
      getOccupiedEnemyTileIds(activeEnemies)
    );
    const reachableTileIds = getReachableTileIds(
      roomTiles,
      characterPositionId,
      movementRange,
      getOccupiedEnemyTileIds(activeEnemies)
    );

    if (!reachableTileIds.includes(tileId) || !movementPath.length) {
      return;
    }

    const previousCharacterRect = captureCharacterTokenRect();
    characterPositionId = tileId;
    if (!isRoomSecured()) {
      actionPointsRemaining = Math.max(0, actionPointsRemaining - movementPath.length);
      isMoveMode = false;
    } else {
      isMoveMode = true;
    }
    suppressTileClick = false;
    isBlinkTargetMode = false;
    roomStage.classList.toggle("movement-active", isMoveMode);
    roomStage.classList.remove("dragging");
    updateRoom({ centerCamera: false });
    await animateCharacterMovement(previousCharacterRect);
    centerCameraOnTile(characterPositionId);
    updateCamera();
    const entryStatus = resolvePlayerTileEntry();
    updateRoom();
    if (entryStatus) {
      roomStatus.textContent = entryStatus;
    }
    finishLevelIfComplete(entryStatus);
    gameLog("player.moved", { tileId, entryStatus, state: getRoomDebugState() });
  });

  updateRunecastingPanel();
  updateRoom();
  window.addEventListener("resize", updateCamera);
}

function renderCraftedDieFaces(customFaces, selectedElement = "") {
  return Array.from({ length: customDieFaceCount }, (_, index) => {
    const sigil = customFaces[index];
    const die = sigil ? getDieById(sigil.element) : null;

    return `
      <button class="craft-face ${sigil ? "filled" : "empty"}" type="button" data-face-index="${index}" style="--die-accent: ${die?.accent || "#f6f8ff"}" aria-label="Die face ${index + 1}">
        ${sigil ? `<img src="${die.files[sigil.face || 1]}" alt="${die.name} common sigil">` : `<span>${selectedElement ? "Drop" : "Empty"}</span>`}
        <small>${index + 1}</small>
      </button>
    `;
  }).join("");
}

function renderSigilCraftOptions(customFaces, selectedElement = "") {
  return dice
    .map((die) => {
      const placedCount = customFaces.filter((sigil) => sigil?.element === die.id).length;
      const isAtLimit = placedCount >= 2;
      const isSelected = selectedElement === die.id;

      return `
        <button class="sigil-craft-option ${isSelected ? "selected" : ""}" type="button" draggable="${isAtLimit ? "false" : "true"}" data-sigil-element="${die.id}" style="--die-accent: ${die.accent}" ${isAtLimit ? "disabled" : ""} aria-pressed="${isSelected}">
          <img src="${die.files[1]}" alt="${die.name} common sigil">
          <span>${die.name}</span>
          <small>${placedCount}/2</small>
        </button>
      `;
    })
    .join("");
}

function renderSigilCrafting(customFaces, selectedElement = "") {
  const filledCount = customFaces.filter(Boolean).length;

  return `
    <div class="sigil-craft-board">
      <div class="crafted-die" id="crafted-die" aria-label="Custom starting die">
        ${renderCraftedDieFaces(customFaces, selectedElement)}
      </div>
      <div class="sigil-craft-bank" id="sigil-craft-bank" aria-label="Common sigils">
        ${renderSigilCraftOptions(customFaces, selectedElement)}
      </div>
      <p class="craft-count">${filledCount}/${startingCustomFaceLimit} faces assigned. Choose common sigils; no more than 2 copies of one element.</p>
    </div>
  `;
}

function renderCraftingSigilToken(sigil, attributes = "") {
  const die = getDieById(sigil?.element);

  if (!sigil || !die) {
    return `<span class="crafting-empty-label">Empty</span>`;
  }

  return `
    <span class="crafting-sigil-token" style="--die-accent: ${die.accent}" ${attributes}>
      <img src="${die.files[sigil.face || 1]}" alt="${die.name} ${sigilRarityLabels[sigil.face || 1]} sigil">
      <span>${die.name}</span>
      <small>${sigilRarityLabels[sigil.face || 1]}</small>
    </span>
  `;
}

function renderCraftingDatabank(character, selectedCraftSource = null) {
  const inventory = character.sigilInventory || [];

  return `
    <section class="crafting-databank" aria-labelledby="crafting-databank-title" data-crafting-inventory-target="true">
      <div class="section-heading">
        <h3 id="crafting-databank-title">Databank</h3>
      </div>
      <div class="crafting-inventory-grid">
        ${
          inventory.length
            ? inventory
                .map((sigil, index) => {
                  const isSelected = selectedCraftSource?.type === "inventory" && selectedCraftSource.index === index;

                  return `
                    <button class="crafting-inventory-sigil ${isSelected ? "selected" : ""}" type="button" draggable="true" data-crafting-source="inventory" data-inventory-index="${index}" aria-pressed="${isSelected}">
                      ${renderCraftingSigilToken(sigil)}
                    </button>
                  `;
                })
                .join("")
            : `<p class="crafting-empty-bank">No loose sigils stored.</p>`
        }
      </div>
    </section>
  `;
}

function renderCraftingDice(character, selectedCraftSource = null) {
  return `
    <section class="crafting-dice" aria-labelledby="crafting-dice-title">
      <div class="section-heading">
        <h3 id="crafting-dice-title">Dice</h3>
      </div>
      <div class="crafting-dice-grid">
        ${(character.loadout || [])
          .map((loadoutDie, dieIndex) => {
            const isCustom = typeof loadoutDie !== "string" && loadoutDie?.type === "custom";
            const faces = getLoadoutDieFaces(loadoutDie);

            return `
              <article class="crafting-die-card ${isCustom ? "" : "locked"}">
                <header>
                  <strong>Die ${dieIndex + 1}</strong>
                  <small>${isCustom ? "Custom" : "Fixed"}</small>
                </header>
                <div class="crafting-face-grid">
                  ${faces
                    .map((sigil, faceIndex) => {
                      const die = sigil ? getDieById(sigil.element) : null;
                      const isSelected =
                        selectedCraftSource?.type === "face" &&
                        selectedCraftSource.dieIndex === dieIndex &&
                        selectedCraftSource.faceIndex === faceIndex;

                      return `
                        <button class="craft-face crafting-face ${sigil ? "filled" : "empty"} ${isSelected ? "selected" : ""}" type="button" ${isCustom ? `draggable="${sigil ? "true" : "false"}" data-crafting-target="face" data-crafting-source="${sigil ? "face" : ""}" data-die-index="${dieIndex}" data-face-index="${faceIndex}"` : "disabled"} style="--die-accent: ${die?.accent || "#f6f8ff"}" aria-label="Die ${dieIndex + 1} face ${faceIndex + 1}">
                          ${sigil ? `<img src="${die.files[sigil.face || 1]}" alt="${die.name} sigil">` : `<span>Empty</span>`}
                          <small>${faceIndex + 1}</small>
                        </button>
                      `;
                    })
                    .join("")}
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function getCraftingSigilSource(character, source) {
  if (!source) {
    return null;
  }

  if (source.type === "inventory") {
    return character.sigilInventory?.[source.index] || null;
  }

  if (source.type === "face") {
    const loadoutDie = character.loadout?.[source.dieIndex];
    return loadoutDie?.type === "custom" ? loadoutDie.faces?.[source.faceIndex] || null : null;
  }

  return null;
}

function setCraftingSigilSource(character, source, sigil) {
  if (source.type === "inventory") {
    character.sigilInventory = character.sigilInventory || [];

    if (sigil) {
      character.sigilInventory[source.index] = sigil;
    } else {
      character.sigilInventory.splice(source.index, 1);
    }

    return true;
  }

  if (source.type === "face") {
    const loadoutDie = character.loadout?.[source.dieIndex];

    if (!loadoutDie || loadoutDie.type !== "custom") {
      return false;
    }

    loadoutDie.faces = Array.from({ length: customDieFaceCount }, (_, index) => loadoutDie.faces?.[index] || null);
    loadoutDie.faces[source.faceIndex] = sigil || null;
    return true;
  }

  return false;
}

function moveCraftingSigil(character, source, target) {
  const sourceSigil = getCraftingSigilSource(character, source);

  if (!sourceSigil || !target) {
    return false;
  }

  if (
    source.type === target.type &&
    source.index === target.index &&
    source.dieIndex === target.dieIndex &&
    source.faceIndex === target.faceIndex
  ) {
    return false;
  }

  if (target.type === "inventory") {
    setCraftingSigilSource(character, source, null);
    character.sigilInventory = character.sigilInventory || [];
    character.sigilInventory.push(sourceSigil);
    return true;
  }

  const targetSigil = getCraftingSigilSource(character, target);
  setCraftingSigilSource(character, target, sourceSigil);
  setCraftingSigilSource(character, source, targetSigil || null);
  return true;
}

function renderCharacterOptions(selectedCharacterId) {
  return characters
    .map((character) => {
      const isSelected = selectedCharacterId === character.id;

      return `
        <button class="character-card ${isSelected ? "selected" : ""}" type="button" data-character-id="${character.id}" aria-pressed="${isSelected}">
          <img class="character-portrait" src="${character.portrait}" alt="${character.name}">
          <img class="character-name-img" src="${character.nameImage}" alt="${character.name}">
        </button>
      `;
    })
    .join("");
}

function renderSelectedCharacterBio(selectedCharacterId) {
  const character = characters.find((item) => item.id === selectedCharacterId);

  return character
    ? `<article class="character-bio"><h4>${character.name}</h4><p>${character.bio}</p></article>`
    : `<article class="character-bio empty"><h4>Awaiting Sigilant</h4><p>Select a character to view origin data.</p></article>`;
}

function showLevelMap(character) {
  character.progression = character.progression || { ...startingProgression };
  character.sigilInventory = character.sigilInventory || [];
  const mapState = ensureMapState(character);
  const selectedNode = mapState.selectedNode || startingMapState.selectedNode;
  const selectedLevelNode = levelNodes.find((node) => node.id === selectedNode) || levelNodes[0];
  const levelMapLines = levelNodes
    .flatMap((node) =>
      node.unlocks.map((unlockedNodeId) => {
        const unlockedNode = levelNodes.find((item) => item.id === unlockedNodeId);

        if (!unlockedNode) {
          return "";
        }

        const isOpenEdge =
          mapState.unlockedNodes.includes(unlockedNode.id) ||
          mapState.completedNodes.includes(node.id) ||
          mapState.completedNodes.includes(unlockedNode.id);

        return `<line class="${isOpenEdge ? "open" : ""}" x1="${node.x}" y1="${node.y}" x2="${unlockedNode.x}" y2="${unlockedNode.y}"></line>`;
      })
    )
    .join("");

  app.innerHTML = `
    <section class="level-map-screen" aria-labelledby="level-map-title">
      <div class="level-map-panel">
        <header class="level-map-header">
          <div>
            <p class="signal">Q-Dara Route Net</p>
            <h2 id="level-map-title">World Map</h2>
          </div>
          <div class="level-map-character">
            ${renderRunCharacter(character)}
            ${renderProgressionTracker(character.progression)}
          </div>
        </header>

        <div class="level-map-tools">
          <button class="secondary-action crafting-map-action" type="button" id="open-crafting">Crafting</button>
        </div>

        <div class="level-map-viewport world-map-viewport" aria-label="Q-Dara world node map">
          <div class="world-map-board">
            <img class="world-map-image" src="${worldMapImage}" alt="Q-Dara world map">
            <svg class="level-map-lines world-map-lines" viewBox="0 0 ${worldMapCoordinateSpace.width} ${worldMapCoordinateSpace.height}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              ${levelMapLines}
            </svg>
            ${levelNodes
              .map((node) => {
                const isUnlocked = mapState.unlockedNodes.includes(node.id) || mapState.completedNodes.includes(node.id);
                const isComplete = mapState.completedNodes.includes(node.id);
                const isSelected = selectedNode === node.id;
                const stateClass = isUnlocked ? "unlocked" : "locked";

                return `
                  <button class="level-node world-node ${node.type}-node ${stateClass} ${isSelected ? "active" : ""} ${isComplete ? "complete" : ""}" type="button" data-level-node="${node.id}" ${isUnlocked ? "" : "disabled"} style="--node-x: ${(node.x / worldMapCoordinateSpace.width) * 100}%; --node-y: ${(node.y / worldMapCoordinateSpace.height) * 100}%; --zone-accent: ${node.accent}; --zone-dark: ${node.dark}; --zone-light: ${node.light};">
                    <span>${node.label}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <footer class="level-map-footer">
          <div class="level-map-selection">
            <p id="level-map-status">${selectedLevelNode.label} - Sigil Occurrence Percentages:</p>
            <div id="level-sigil-rates-slot">${renderSigilSpawnRates(selectedLevelNode)}</div>
          </div>
          <button class="primary-action" type="button" id="enter-level">Enter ${selectedLevelNode.label}</button>
        </footer>
      </div>
    </section>
  `;

  const enterLevel = document.querySelector("#enter-level");
  const craftingButton = document.querySelector("#open-crafting");
  const levelMapStatus = document.querySelector("#level-map-status");
  const levelSigilRatesSlot = document.querySelector("#level-sigil-rates-slot");
  const worldMapViewport = document.querySelector(".world-map-viewport");
  const worldMapBoard = document.querySelector(".world-map-board");
  const levelNodeButtons = [...document.querySelectorAll("[data-level-node]")];

  function centerWorldMapOnNode(nodeId) {
    const node = levelNodes.find((item) => item.id === nodeId) || levelNodes[0];

    if (!worldMapViewport || !worldMapBoard || !node) {
      return;
    }

    const targetX = (node.x / worldMapCoordinateSpace.width) * worldMapBoard.offsetWidth;
    const targetY = (node.y / worldMapCoordinateSpace.height) * worldMapBoard.offsetHeight;

    worldMapViewport.scrollLeft = Math.max(0, targetX - worldMapViewport.clientWidth / 2);
    worldMapViewport.scrollTop = Math.max(0, targetY - worldMapViewport.clientHeight / 2);
  }

  function updateSelectedLevelNode(nodeId) {
    const node = levelNodes.find((item) => item.id === nodeId) || levelNodes[0];
    const isUnlocked = mapState.unlockedNodes.includes(nodeId) || mapState.completedNodes.includes(nodeId);

    if (!isUnlocked) {
      return;
    }

    mapState.selectedNode = nodeId;
    levelNodeButtons.forEach((node) => node.classList.toggle("active", node.dataset.levelNode === nodeId));
    enterLevel.disabled = false;
    enterLevel.textContent = `Enter ${node.label}`;
    levelMapStatus.textContent = `${node.label} - Sigil Occurrence Percentages:`;
    levelSigilRatesSlot.innerHTML = renderSigilSpawnRates(node);
  }

  levelNodeButtons.forEach((node) => {
    node.addEventListener("click", () => updateSelectedLevelNode(node.dataset.levelNode));
  });

  craftingButton.addEventListener("click", () => showSigilCraftingScreen(character));
  enterLevel.addEventListener("click", () => showInitialRoom(character, mapState.selectedNode));
  updateSelectedLevelNode(selectedNode);
  centerWorldMapOnNode(mapState.selectedNode);
}

function showLevelComplete(character, completedNodeId) {
  const completedNode = levelNodes.find((node) => node.id === completedNodeId) || levelNodes[0];
  completeLevelNode(character, completedNodeId);
  gameLog("level.completeScreen", {
    completedNodeId,
    pendingRewards: character.progression.pendingRewards,
    mapState: character.mapState,
  });

  app.innerHTML = `
    <section class="level-map-screen" aria-labelledby="level-complete-title">
      <div class="level-complete-panel">
        <p class="signal">Rift Closure Confirmed</p>
        <h2 id="level-complete-title">${completedNode.label} Closed</h2>
        <div class="level-complete-character">
          ${renderRunCharacter(character)}
          ${renderProgressionTracker(character.progression)}
        </div>
        <p>New route signals are available on the Level Map.</p>
        <button class="primary-action" type="button" id="return-level-map">Return to Level Map</button>
      </div>
    </section>
  `;

  document.querySelector("#return-level-map").addEventListener("click", () => {
    showLevelMap(character);
  });
}

function showSigilCraftingScreen(character) {
  character.sigilInventory = character.sigilInventory || [];
  let selectedCraftSource = null;

  app.innerHTML = `
    <section class="setup-screen crafting-screen" aria-labelledby="crafting-title">
      <div class="setup-panel crafting-panel">
        <header class="setup-header">
          <div>
            <p class="signal">Sigil Crafting</p>
            <h2 id="crafting-title">Craft Dice</h2>
          </div>
          <button class="primary-action" type="button" id="done-crafting">Done Crafting</button>
        </header>

        <div id="crafting-workbench">
          ${renderCraftingDatabank(character, selectedCraftSource)}
          ${renderCraftingDice(character, selectedCraftSource)}
        </div>
      </div>
    </section>
  `;

  const workbench = document.querySelector("#crafting-workbench");
  const doneCrafting = document.querySelector("#done-crafting");

  function renderWorkbench() {
    workbench.innerHTML = `
      ${renderCraftingDatabank(character, selectedCraftSource)}
      ${renderCraftingDice(character, selectedCraftSource)}
    `;
  }

  function getSourceFromElement(element) {
    const inventorySource = element.closest("[data-crafting-source='inventory']");
    const faceSource = element.closest("[data-crafting-source='face']");

    if (inventorySource) {
      return { type: "inventory", index: Number(inventorySource.dataset.inventoryIndex) };
    }

    if (faceSource) {
      return {
        type: "face",
        dieIndex: Number(faceSource.dataset.dieIndex),
        faceIndex: Number(faceSource.dataset.faceIndex),
      };
    }

    return null;
  }

  function getTargetFromElement(element) {
    const faceTarget = element.closest("[data-crafting-target='face']");

    if (faceTarget) {
      return {
        type: "face",
        dieIndex: Number(faceTarget.dataset.dieIndex),
        faceIndex: Number(faceTarget.dataset.faceIndex),
      };
    }

    if (element.closest("[data-crafting-inventory-target]")) {
      return { type: "inventory" };
    }

    return null;
  }

  workbench.addEventListener("click", (event) => {
    const target = getTargetFromElement(event.target);
    const source = getSourceFromElement(event.target);

    if (!selectedCraftSource && source) {
      selectedCraftSource = source;
      renderWorkbench();
      return;
    }

    if (selectedCraftSource && target) {
      moveCraftingSigil(character, selectedCraftSource, target);
      selectedCraftSource = null;
      renderWorkbench();
      return;
    }

    selectedCraftSource = null;
    renderWorkbench();
  });

  workbench.addEventListener("dragstart", (event) => {
    const source = getSourceFromElement(event.target);

    if (!source) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.setData("application/json", JSON.stringify(source));
    event.dataTransfer.effectAllowed = "move";
  });

  workbench.addEventListener("dragover", (event) => {
    if (getTargetFromElement(event.target)) {
      event.preventDefault();
    }
  });

  workbench.addEventListener("drop", (event) => {
    const target = getTargetFromElement(event.target);

    if (!target) {
      return;
    }

    event.preventDefault();

    try {
      const source = JSON.parse(event.dataTransfer.getData("application/json"));
      moveCraftingSigil(character, source, target);
      selectedCraftSource = null;
      renderWorkbench();
    } catch (error) {
      gameError("crafting.drop.invalidSource", { message: error.message });
    }
  });

  doneCrafting.addEventListener("click", () => showLevelMap(character));
}

function getRewardProgramOptions(character) {
  if (character.programs.length >= character.stats.cache) {
    return [];
  }

  const ownedPrograms = new Set(ensureProgramLibrary(character));
  const equippedElements = getCharacterLoadoutElements(character);
  const availablePrograms = Object.values(programs).filter(
    (program) => equippedElements.has(program.element) && !ownedPrograms.has(program.id)
  );

  return availablePrograms.sort(() => Math.random() - 0.5).slice(0, 3);
}

function showLevelReward(character) {
  function finishRewardChoice() {
    character.progression.pendingRewards = Math.max(0, (character.progression.pendingRewards || 0) - 1);

    if (character.progression.pendingRewards > 0) {
      showLevelReward(character);
      return;
    }

    showLevelMap(character);
  }

  app.innerHTML = `
    <section class="level-map-screen" aria-labelledby="level-reward-title">
      <div class="level-complete-panel reward-panel">
        <p class="signal">Level ${character.progression.level} Reward</p>
        <h2 id="level-reward-title">New Blank Die</h2>
        <div class="reward-options">
          <article class="reward-card">
            <h3>Add Blank Die</h3>
            <div class="reward-choice-grid">
              <button class="secondary-action reward-choice" type="button" id="add-level-map-blank-die">
                <strong>Blank Die</strong>
                <small>Six empty faces for future sigils.</small>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#add-level-map-blank-die").addEventListener("click", () => {
    character.loadout.push(createBlankDie());
    finishRewardChoice();
  });

}

function showCharacterSetup() {
  startBackgroundMusic();
  window.clearInterval(runeRainTimer);

  const customFaces = Array.from({ length: customDieFaceCount }, () => null);
  let selectedCharacterId = "";
  let selectedCraftElement = "";

  app.innerHTML = `
    <section class="setup-screen" aria-labelledby="setup-title">
      <div class="setup-panel">
        <header class="setup-header">
          <div>
            <p class="signal">Sigilant Initialization</p>
            <h2 id="setup-title">Character Setup</h2>
          </div>
          <button class="secondary-action" type="button" id="return-menu">Return</button>
        </header>

        <section class="character-select" aria-labelledby="character-select-title">
          <div class="section-heading">
            <h3 id="character-select-title">Choose Sigilant</h3>
          </div>
          <div class="character-options" id="character-options">
            ${renderCharacterOptions(selectedCharacterId)}
          </div>
          <div id="character-bio">
            ${renderSelectedCharacterBio(selectedCharacterId)}
          </div>
          <div class="setup-program-preview" aria-label="Selected character starting programs">
            <p class="signal">Base Programs</p>
            <div id="setup-program-preview">
              ${renderSetupProgramPreview()}
            </div>
          </div>
        </section>

        <section class="loadout" aria-labelledby="loadout-title">
          <div class="loadout-header">
            <div>
              <h3 id="loadout-title">Craft Starting Die</h3>
              <p>Drag or click 3 common elemental sigils onto the blank die. You can place up to 2 copies of the same element.</p>
            </div>
          </div>

          <div id="sigil-crafting">
            ${renderSigilCrafting(customFaces, selectedCraftElement)}
          </div>
        </section>

        <footer class="setup-footer">
          <p id="setup-status">Choose a Sigilant and craft 3 die faces to begin.</p>
          <button class="primary-action" type="button" id="confirm-character" disabled>Enter Rift</button>
        </footer>
      </div>
    </section>
  `;

  const sigilCrafting = document.querySelector("#sigil-crafting");
  const characterOptions = document.querySelector("#character-options");
  const characterBio = document.querySelector("#character-bio");
  const setupProgramPreview = document.querySelector("#setup-program-preview");
  const confirmButton = document.querySelector("#confirm-character");
  const status = document.querySelector("#setup-status");

  function getFilledFaceCount() {
    return customFaces.filter(Boolean).length;
  }

  function canPlaceSigil(element, targetIndex) {
    if (!element || targetIndex < 0 || targetIndex >= customDieFaceCount) {
      return false;
    }

    const existingSigil = customFaces[targetIndex];
    const filledCount = getFilledFaceCount();
    const matchingCount = customFaces.filter((sigil, index) => index !== targetIndex && sigil?.element === element).length;

    return Boolean(existingSigil || filledCount < startingCustomFaceLimit) && matchingCount < 2;
  }

  function placeSigil(element, targetIndex) {
    if (!canPlaceSigil(element, targetIndex)) {
      status.textContent = "That sigil cannot be placed there.";
      return;
    }

    customFaces[targetIndex] = { element, face: 1 };
    selectedCraftElement = "";
    updateSetupState();
  }

  function updateSetupState() {
    const selectedCharacter = characters.find((item) => item.id === selectedCharacterId);
    const filledCount = getFilledFaceCount();

    characterOptions.innerHTML = renderCharacterOptions(selectedCharacterId);
    characterBio.innerHTML = renderSelectedCharacterBio(selectedCharacterId);
    setupProgramPreview.innerHTML = renderSetupProgramPreview();
    sigilCrafting.innerHTML = renderSigilCrafting(customFaces, selectedCraftElement);
    confirmButton.disabled = filledCount !== startingCustomFaceLimit || !selectedCharacterId;

    if (!selectedCharacterId) {
      status.textContent = "Choose a Sigilant.";
      return;
    }

    status.textContent = filledCount === startingCustomFaceLimit
      ? "Custom die ready."
      : `Assign ${startingCustomFaceLimit - filledCount} more ${startingCustomFaceLimit - filledCount === 1 ? "sigil" : "sigils"}.`;
  }

  characterOptions.addEventListener("click", (event) => {
    const card = event.target.closest("[data-character-id]");

    if (!card) {
      return;
    }

    selectedCharacterId = card.dataset.characterId;
    updateSetupState();
  });

  sigilCrafting.addEventListener("click", (event) => {
    const sigilButton = event.target.closest("[data-sigil-element]");
    const faceButton = event.target.closest("[data-face-index]");

    if (sigilButton) {
      selectedCraftElement = sigilButton.dataset.sigilElement;
      updateSetupState();
      return;
    }

    if (!faceButton) {
      return;
    }

    const faceIndex = Number(faceButton.dataset.faceIndex);

    if (selectedCraftElement) {
      placeSigil(selectedCraftElement, faceIndex);
      return;
    }

    if (customFaces[faceIndex]) {
      customFaces[faceIndex] = null;
      updateSetupState();
    }
  });

  sigilCrafting.addEventListener("dragstart", (event) => {
    const sigilButton = event.target.closest("[data-sigil-element]");

    if (!sigilButton) {
      return;
    }

    event.dataTransfer.setData("text/plain", sigilButton.dataset.sigilElement);
    event.dataTransfer.effectAllowed = "copy";
  });

  sigilCrafting.addEventListener("dragover", (event) => {
    if (event.target.closest("[data-face-index]")) {
      event.preventDefault();
    }
  });

  sigilCrafting.addEventListener("drop", (event) => {
    const faceButton = event.target.closest("[data-face-index]");

    if (!faceButton) {
      return;
    }

    event.preventDefault();
    placeSigil(event.dataTransfer.getData("text/plain"), Number(faceButton.dataset.faceIndex));
  });

  confirmButton.addEventListener("click", () => {
    const character = characters.find((item) => item.id === selectedCharacterId);

    showLevelMap({
      ...character,
      programs: [...baseProgramIds],
      loadout: [createCustomDie(customFaces)],
      programLibrary: [...baseProgramIds],
      stats: { ...startingStats },
      progression: { ...startingProgression },
      artifacts: [],
      mapState: {
        selectedNode: startingMapState.selectedNode,
        completedNodes: [...startingMapState.completedNodes],
        unlockedNodes: [...startingMapState.unlockedNodes],
      },
    });
  });

  document.querySelector("#return-menu").addEventListener("click", () => window.location.reload());
  updateSetupState();
}

startRunButton.addEventListener("click", () => {
  startBackgroundMusic();
  showCharacterSetup();
});
startRuneRain();
startBackgroundMusic();
