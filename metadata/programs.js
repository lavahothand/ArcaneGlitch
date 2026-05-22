// Editable program metadata.
// Supported effect types:
// - damageAdjacent: requires an adjacent enemy. Uses amount, damageType ("arcane" or "physical"), and optional healAmount.
// - damageLine: targets a hex distance spaces away in a straight line. Uses amount and damageType.
// - debuffDefense: reduces Physical and Arcane Defense on an adjacent enemy by amount.
// - damageAdjacentAll: loses selfDamage Integrity, then damages all adjacent enemies.
// - confuseEnemy: targets an adjacent enemy; next enemy turn it attacks another enemy instead of the player.
// - resetOtherCooldowns: clears cooldowns on all other equipped programs.
// - healIntegrity: restores Integrity by amount.
// - blinkStraight: teleports exactly distance spaces in a straight line.
// - nextTurnExec: adds amount temporary Actions to the next player turn.
// - revealRiftThreads: temporarily reveals Rift Thread hexes.
// - pushEnemy: targets an adjacent enemy, pushes it one hex away, and stuns it.
// - sightRangeBonus: temporarily increases line of sight by amount.
// Cooldown is measured in player turns after the program is used.
window.arcaneMetadata = window.arcaneMetadata || {};

window.arcaneMetadata.programs = {
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
    summary: "Deal 1 AD to an adjacent enemy.",
    details: "Deal 1 Arcane Damage to an adjacent enemy.",
    cooldown: 1,
    effect: {
      type: "damageAdjacent",
      amount: 1,
      damageType: "arcane",
    },
  },
  rebuild: {
    id: "rebuild",
    name: "REBUILD",
    element: "life",
    requirement: [{ element: "life", face: 1 }],
    summary: "Heal 1 Integrity.",
    details: "Heal 1 Integrity up to your max.",
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
    summary: "Gain 1 temporary Action next turn.",
    details: "Gain 1 temporary Action on your next turn.",
    cooldown: 1,
    effect: {
      type: "nextTurnExec",
      amount: 1,
    },
  },
  quake: {
    id: "quake",
    name: "QUAKE",
    element: "surge",
    requirement: [
      { element: "surge", face: 1 },
      { element: "life", face: 2 },
    ],
    summary: "Deal 1 PD 2 spaces away.",
    details: "Spend one common Surge and one uncommon Life symbol to target a hex 2 spaces away in a straight line. Valid target spaces are temporarily revealed while aiming.",
    cooldown: 2,
    effect: {
      type: "damageLine",
      amount: 1,
      damageType: "physical",
      distance: 2,
      revealTarget: true,
    },
  },
  shatter: {
    id: "shatter",
    name: "SHATTER",
    element: "mind",
    requirement: [
      { element: "mind", face: 1 },
      { element: "surge", face: 2 },
    ],
    summary: "Reduce enemy defenses by 1.",
    details: "Spend one common Mind and one uncommon Surge symbol to reduce an adjacent enemy's Physical Defense and Arcane Defense by 1.",
    cooldown: 1,
    effect: {
      type: "debuffDefense",
      amount: 1,
    },
  },
  blinkTwo: {
    id: "blinkTwo",
    name: "BLINK II",
    element: "surge",
    requirement: [
      { element: "surge", face: 1 },
      { element: "void", face: 2 },
    ],
    summary: "Teleport 3 spaces in a straight line.",
    details: "Spend one common Surge and one uncommon Void symbol to teleport exactly 3 hex spaces in a straight-line direction.",
    cooldown: 1,
    effect: {
      type: "blinkStraight",
      distance: 3,
    },
  },
  drain: {
    id: "drain",
    name: "DRAIN",
    element: "life",
    requirement: [
      { element: "life", face: 1 },
      { element: "mind", face: 2 },
    ],
    summary: "Deal 1 AD and heal 1 Integrity.",
    details: "Spend one common Life and one uncommon Mind symbol to deal 1 Arcane Damage to an adjacent enemy, then heal 1 Integrity.",
    cooldown: 2,
    effect: {
      type: "damageAdjacent",
      amount: 1,
      damageType: "arcane",
      healAmount: 1,
    },
  },
  confuse: {
    id: "confuse",
    name: "CONFUSE",
    element: "mind",
    requirement: [
      { element: "mind", face: 1 },
      { element: "void", face: 2 },
    ],
    summary: "Enemy attacks another enemy next turn.",
    details: "Spend one common Mind and one uncommon Void symbol to make an adjacent enemy attack another enemy next turn instead of the player.",
    cooldown: 1,
    effect: {
      type: "confuseEnemy",
      duration: 1,
    },
  },
  fortify: {
    id: "fortify",
    name: "FORTIFY",
    element: "void",
    requirement: [
      { element: "void", face: 1 },
      { element: "life", face: 2 },
    ],
    summary: "Reset all other program cooldowns.",
    details: "Spend one common Void and one uncommon Life symbol to clear cooldowns on all other equipped programs.",
    cooldown: 1,
    effect: {
      type: "resetOtherCooldowns",
    },
  },
  rift: {
    id: "rift",
    name: "RIFT",
    element: "void",
    requirement: [
      { element: "void", face: 1 },
      { element: "void", face: 2 },
    ],
    summary: "Reveal Rift Threads this turn.",
    details: "Spend one common Void and one uncommon Void symbol to reveal all Rift Thread hexes until the turn ends.",
    cooldown: 1,
    effect: {
      type: "revealRiftThreads",
    },
  },
  bolt: {
    id: "bolt",
    name: "BOLT",
    element: "surge",
    requirement: [
      { element: "surge", face: 1 },
      { element: "surge", face: 2 },
    ],
    summary: "Deal 2 AD to an adjacent enemy.",
    details: "Spend one common Surge and one uncommon Surge symbol to deal 2 Arcane Damage to an adjacent enemy.",
    cooldown: 2,
    effect: {
      type: "damageAdjacent",
      amount: 2,
      damageType: "arcane",
    },
  },
  push: {
    id: "push",
    name: "PUSH",
    element: "life",
    requirement: [
      { element: "life", face: 1 },
      { element: "life", face: 2 },
    ],
    summary: "Push and stun an adjacent enemy.",
    details: "Spend one common Life and one uncommon Life symbol to move an adjacent enemy one hex away and stun it for its next turn.",
    cooldown: 1,
    effect: {
      type: "pushEnemy",
      stunTurns: 1,
    },
  },
  vision: {
    id: "vision",
    name: "VISION",
    element: "mind",
    requirement: [
      { element: "mind", face: 1 },
      { element: "mind", face: 2 },
    ],
    summary: "Increase sight range by 1.",
    details: "Spend one common Mind and one uncommon Mind symbol to increase line of sight by 1 until the end of your next turn.",
    cooldown: 1,
    effect: {
      type: "sightRangeBonus",
      amount: 1,
      playerTurns: 2,
    },
  },
};
