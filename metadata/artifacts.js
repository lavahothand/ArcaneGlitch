// Editable artifact metadata.
// Permanent artifacts use type "permanent" and stat values: cache, exec, move, maxIntegrity.
// Temporary artifacts use type "temporary" and effects handled in main.js.
window.arcaneMetadata = window.arcaneMetadata || {};

window.arcaneMetadata.artifacts = [
  {
    id: "powerGlyph",
    name: "Power Glyph",
    type: "permanent",
    rarity: "uncommon",
    image: "artifacts/art_powerglyph.png",
    stat: "exec",
    amount: 1,
    label: "EXECUTIONS +1",
  },
  {
    id: "cacheCore",
    name: "Cache Core",
    type: "permanent",
    rarity: "uncommon",
    image: "artifacts/art_cachecore.png",
    stat: "cache",
    amount: 1,
    label: "CACHE +1",
  },
  {
    id: "integrityLattice",
    name: "Integrity Lattice",
    type: "permanent",
    rarity: "common",
    image: "artifacts/art_integritylattice.png",
    stat: "maxIntegrity",
    amount: 1,
    label: "Max Integrity +1",
  },
  {
    id: "biomechanics",
    name: "Biomechanics",
    type: "permanent",
    rarity: "rare",
    image: "artifacts/art_biomechanics.png",
    stat: "move",
    amount: 1,
    label: "Actions +1",
  },
  {
    id: "adrenalineSpike",
    name: "Adrenaline Spike",
    type: "temporary",
    rarity: "common",
    image: "artifacts/art_adrenalinespike.png",
    label: "Actions +1 for next 3 turns",
    effect: {
      type: "temporaryActions",
      amount: 1,
      turns: 3,
    },
  },
  {
    id: "jungleHerbs",
    name: "Jungle Herbs",
    type: "temporary",
    rarity: "uncommon",
    image: "artifacts/art_jungleherbs.png",
    label: "Heal 2 Integrity",
    effect: {
      type: "healIntegrity",
      amount: 2,
    },
  },
  {
    id: "realityWarp",
    name: "Reality Warp",
    type: "temporary",
    rarity: "rare",
    image: "artifacts/art_realitywarp.png",
    label: "1 Use: deal 1 damage to all surrounding enemies",
    uses: 1,
    effect: {
      type: "damageAdjacentAll",
      amount: 1,
    },
  },
  {
    id: "pixelBomb",
    name: "Pixel Bomb",
    type: "temporary",
    rarity: "common",
    image: "artifacts/art_pixelbomb.png",
    label: "1 Use: deal 2 damage to an adjacent enemy",
    uses: 1,
    effect: {
      type: "damageAdjacent",
      amount: 2,
    },
  },
  {
    id: "sigilGlyph",
    name: "Sigil-Glyph",
    type: "temporary",
    rarity: "uncommon",
    label: "1 Use: counts as one random sigil during Sigil-Casting",
    uses: 1,
    effect: {
      type: "sigilGlyph",
    },
  },
];
