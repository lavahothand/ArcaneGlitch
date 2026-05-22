// Editable enemy metadata.
// Add new entries to window.arcaneMetadata.glitchspawn, then reference their ids from room generation in main.js.
window.arcaneMetadata = window.arcaneMetadata || {};

window.arcaneMetadata.glitchspawn = {
  voidRaider: {
    id: "voidRaider",
    name: "Void Raider",
    image: "pixel art/glitchspawn_1_px.png",
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
    image: "pixel art/glitchspawn_2_px.png",
    xpValue: 30,
    behavior: "aggressive",
    stats: {
      integrity: 3,
      physicalDefense: 0,
      arcaneDefense: 0,
      power: 2,
      accuracy: 0.45,
    },
  },
  mindPhantom: {
    id: "mindPhantom",
    name: "Vision Phantom",
    image: "pixel art/glitchspawn3_px.png",
    xpValue: 40,
    behavior: "aggressive",
    stats: {
      integrity: 5,
      physicalDefense: 0,
      arcaneDefense: 1,
      power: 1,
      accuracy: 0.4,
    },
  },
};
