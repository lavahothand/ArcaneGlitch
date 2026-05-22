# Arcane Glitch Prototype Notes

## How to Run

This is currently a static browser prototype. Open `index.html` directly in a browser.

No build step, package manager, or dev server is required right now.

## Debugging

- Runtime debug logging is enabled in `main.js` with `DEBUG_GAME`.
- Logs are written to the browser console with the `[ArcaneGlitch #]` prefix.
- Recent structured events are also stored in `window.arcaneDebugEvents` for copying from DevTools.
- Global `error`, `unhandledrejection`, and `pagehide` events are logged to help diagnose crashes or unexpected tab closes.

## Main Files

- `index.html` is the browser entry point and main menu shell.
- `main.js` contains the game data, screen rendering, procedural room generation, movement, camera, Sigil-Casting, program allocation/effects, combat, and enemy behavior.
- `styles.css` contains all UI, board, token, program list, Sigil-Casting panel, enemy list, and responsive styling.
- `metadata/programs.js`, `metadata/glitchspawn.js`, and `metadata/artifacts.js` are plain editable metadata files for adding Programs, Glitchspawn, and Artifacts without editing the main game file for simple entries.
- `Arcane Glitch.docx` contains the original high-level game design notes.

## Editable Metadata

The metadata files are JavaScript text files loaded before `main.js` so the game can still run by opening `index.html` directly.

- `metadata/programs.js` supports these current effect types:
  - `damageAdjacent`: deals `amount` damage to an adjacent enemy. Set `damageType` to `arcane` or `physical`; optional `healAmount` restores Integrity after the hit.
  - `damageLine`: targets a hex `distance` spaces away in a straight line. Set `damageType`, `amount`, and optional `revealTarget`.
  - `debuffDefense`: reduces Physical Defense and Arcane Defense on an adjacent enemy by `amount`.
  - `damageAdjacentAll`: costs `selfDamage` Integrity, then damages all adjacent enemies.
  - `confuseEnemy`: targets an adjacent enemy; next Glitchspawn turn it attacks another enemy instead of the player.
  - `resetOtherCooldowns`: clears cooldowns on all other equipped programs.
  - `healIntegrity`: restores Integrity by `amount`.
  - `blinkStraight`: teleports exactly `distance` spaces in a straight line.
  - `nextTurnExec`: adds `amount` temporary Executions on the next player turn.
  - `revealRiftThreads`: temporarily reveals all uncollected Rift Thread hexes.
  - `pushEnemy`: targets an adjacent enemy, pushes it one hex away, and applies `stunTurns`.
  - `sightRangeBonus`: increases line of sight by `amount` for `playerTurns`.
- Programs support a `cooldown` number. When a program is used, any cooldown greater than 0 disables that program immediately and for the next affected player turn while the counter ticks down.
- `metadata/glitchspawn.js` stores enemy stats, XP values, image paths, behavior tags, and accuracy.
- `metadata/artifacts.js` stores stat artifact rewards. Supported `stat` values are `cache`, `exec`, `move`, and `maxIntegrity`.
- More complex effects still require `main.js` support, but simple damage/heal/stat entries can be added in metadata.

## Asset Folders

- `transparent/` contains transparent Runecode face symbols for `Mind`, `Surge`, `Void`, and `Life`, numbered `1`, `2`, and `3`.
- `pixel art/` contains pixel-art element symbols, including `_px_large` files now used by the dice, program, and Sigil-Crafting UI.
- `pixel art/` also contains pixel-art Glitchspawn sprites used by current enemy metadata.
- `characters/` contains character portraits, character name images, the Encantra board token, and `glitchspawn_1.png`.
- `characters/*_px.jpg` portrait files are used by the character selection screen.
- `characters/*_character.png` files are used as the selected character's in-room map token.
- `sound/` contains the looping background music used from the menu through the run.
- Root `hex_*.png` files are board tile art.
- `hexes/` contains newer map tile art, including the global Rift tile and quadrant-specific basic tile variants.

## Major Redesign Roadmap

The next major design pass should shift the prototype toward a pixel-art tactical roguelite identity and a stronger dice-crafting core.

### Pixel-Art Style

- Move the visual direction to pixel art for characters, Glitchspawn, map tiles, artifacts, Rift Threads, sigils, and major UI icons.
- Keep the black sci-fi base with white text, but replace soft/glass effects with crisp pixel outlines, limited-palette glows, and chunkier tactical RPG panels.
- Use CSS such as `image-rendering: pixelated` for pixel assets.
- Damage numbers, highlights, buttons, panels, and hover states should be restyled to match the pixel-art direction.

### Sigil Crafting

- Dice should become craftable containers instead of fixed elemental dice.
- Dice start blank, and players attach sigils to individual die faces.
- Sigils should carry their own metadata: element, rarity, name, image, and any future tags.
- Program requirements should eventually refer to sigil element and rarity instead of hard-coded die face numbers.
- Blank or locked die faces should produce no sigil when rolled unless later design decides otherwise.
- Progression rewards can eventually grant new sigils, unlock die faces, upgrade existing faces, or add more dice.

### New Starting Loadout

- Players should start with all four base programs equipped or available:
  - `BLINK`
  - `SPARK`
  - `REBUILD`
  - `FOCUS`
- Players should start with only one die.
- The starting die should have 3 usable faces that the player customizes with starting sigils.
- This makes the initial build decision about which base programs the first custom die can support.

### World Map Expansion

- Replace the current simple branching prototype with a larger explorable world map.
- Map regions should lean into elemental strategies through reward bias, enemy bias, tile bias, and event/story hooks.
- Example route identities:
  - Surge-focused regions emphasize damage programs, aggressive enemies, Power Hubs, and combat rewards.
  - Life-focused regions emphasize sustain, Havens/safe tiles, healing rewards, and defensive artifacts.
  - Void-focused regions emphasize Rift manipulation, Blink/mobility, hidden paths, and thread/rift objectives.
  - Mind-focused regions emphasize Sigil-Casting control, EXECUTIONS, rerolls, disruption, and planning rewards.
- Level-map nodes should eventually preview route theme, threat level, likely rewards, and special conditions before entry.

### Larger Rooms And Vision

- Baseline player vision is now 2 spaces.
- Room sizes should increase further to support the larger vision radius and more exploration.
- Board tile art, tokens, and tile overlays are currently rendered at roughly 75% of the previous map scale so more of the room remains readable.
- Camera, drag bounds, click targets, token animations, and hover/target indicators will need review after map scale changes.
- Hidden/explored tile rules should remain: unseen spaces stay blank, previously seen spaces show greyed-out real tile art.

## Current Flow

1. Main menu has a sci-fi black/white theme with falling Runecode symbols.
2. Background music starts on menu load when the browser allows autoplay, otherwise it starts on the first player interaction and loops through the game.
3. `Start Run` opens character setup.
4. Character setup requires selecting one character and crafting one starting die.
5. The starting die has 6 face slots, starts blank, and the player assigns 3 common elemental sigils before the run.
6. Entering the run opens the Level Map.
7. The current Level Map shows the Q-Dara world map with four unlocked elemental starting nodes.
8. Entering a room generates a connected hex room and starts turn 1.
9. Closing the room Rift shows a completion screen, then returns to the Level Map with that node marked complete and its connected child nodes unlocked.

## Current Characters and Programs

- All characters currently start with the four base programs: `BLINK`, `SPARK`, `REBUILD`, and `FOCUS`.

The base program set is previewed during character setup and listed on the left side in the run.

## Dice Rules

The current starting die is a custom object with 6 face slots:

- A new run starts with one custom die.
- The player assigns exactly 3 common sigils to that die during character setup.
- Each element can be used up to 2 times on the starting die.
- Unassigned faces are blank and produce no sigil when rolled.
- The setup screen supports dragging a common sigil onto a face slot, plus click-to-select/click-to-place as a fallback.

Legacy elemental dice still use `dieFaces = [1, 1, 1, 2, 2, 3]` in `main.js` and can still be added by current level-up rewards.

Important mapping:
- Die positions 1-3 are always common.
- Die positions 4-5 are always uncommon.
- Die position 6 is always rare.

The numbered image assets represent rarity symbols:
- `_1` is common.
- `_2` is uncommon.
- `_3` is rare.

The Void transparent image mapping is intentionally remapped in `dice.void.files`:
- Common uses `transparent/Void_2.png`.
- Uncommon uses `transparent/Void_3.png`.
- Rare uses `transparent/Void_1.png`.

## Room and Movement

- Room sizes scale with progression (see Room Scaling section below).
- The first room on each starter route uses only basic tiles plus exactly one Rift tile, one Rift Thread, one stationary 1-Integrity Rift enemy, and one floating Sigil pickup. It has no Cache tile or Artifact pickup.
- Cindera rooms randomize basic spaces from `hexes/cindera_hex_basic1.png` through `hexes/cindera_hex_basic4.png`.
- Conclave rooms randomize basic spaces from `hexes/conclave_hex_basic1.png` through `hexes/conclave_hex_basic4.png`.
- Parcel 7 rooms randomize basic spaces from `hexes/parcel7_hex_basic1.png` through `hexes/parcel7_hex_basic4.png`.
- Sestra Jungle rooms randomize basic spaces from `hexes/jungle_hex_basic1.png` through `hexes/jungle_hex_basic4.png`.
- The player starts on the first generated basic tile.
- The Rift tile is selected from farther non-start border tiles and uses `hexes/rift_hex.png` for all rooms.
- Never-seen hidden tiles use `hex_hidden.png`, but their real tile type is pre-generated and static.
- Once a tile has been visible, it remains explored after the player moves away: it shows its real tile art in a greyed-out state instead of returning to blank.
- Tier 2+ rooms include one Cache tile and one separate floating Artifact pickup.
- Cache tile upgrades only offer Program rewards. Program choices appear when at least one of the Program's required elements is present in the character's dice pool. Program rewards are always added to the Program Library, even if CACHE is full.
- Program cache rewards show two program choices and include the program effect text.
- Floating Artifact pickups use `artifact_1.png` and open a choice between two random Artifacts when collected.
- Floating Sigil pickups appear in rooms and use the current pixel-art element sigil asset. Moving onto one collects it and opens a New Sigil Acquired popup where the player can equip it to a blank die face.
- If there are no blank custom die faces, collected Sigils are held in `character.sigilInventory` for future handling.
- Tier 2+ rooms roll roughly one 50% Haven tile chance per 15 hexes. Standing on an active Haven prevents enemy attacks for the next Glitchspawn turn, then the tile becomes inactive for the rest of the level.
- Tier 2+ rooms have a 50% chance to include one Power Hub. The first time the player enters it, it restores 2 Integrity and then changes to the off-state tile for the rest of the level.
- If the character has available CACHE capacity, a selected Program is equipped immediately.
- Artifacts are permanent stat upgrades and display as collected badges above the current character stats. Hover/focus on a badge shows the artifact name and mechanical grant.
- Rift Threads are placed on non-Rift tiles. They render as purple floating strings/loops of energy only when their tile is visible, with a dark backing/outline so they remain readable over tile art.
- Moving onto a Rift Thread collects it and updates the top HUD thread tracker.
- Moving onto the Rift closes the level after all room Rift Threads are collected. Enemies do not have to be defeated to close the Rift.
- Movement pathing spends 1 Action per hex moved. The Actions stat starts at 2 and is the shared pool for movement and Sigil-Cast rolls.
- While Move mode is active, hovering a reachable hex previews the movement route with white dots. Clicking a hex up to the remaining Action distance moves there and spends the full path cost.
- Pressing `Move` disables drag panning until the movement click resolves or the mode is cancelled.
- The player tile and tiles within 2 spaces are lit. Other tiles render as shadowed hexes with white outlines.

## Room Scaling

Rooms are exploration + Thread Hunt rooms. The player must collect all Rift Threads before closing the Rift. Tier 1 is a no-enemy onboarding room. Later rooms add Glitchspawn as threats and XP sources, but they do not need to be defeated to close the room. Thread count, enemy count, Sigil pickups, and room size scale with room progression.

| Room Tier | Hex Tiles | Rift Threads | Sigils | Enemies |
|-----------|-----------|--------------|--------|---------|
| 1         | 30        | 1            | 1      | 1 stationary |
| 2         | 48        | 2            | 1      | 2       |
| 3         | 60        | 2            | 2      | 3       |
| 4         | 72        | 3            | 3      | 4       |
| 5         | 84        | 4            | 3      | 5       |
| 6         | 96        | 4            | 4      | 6       |
| 7+        | up to 120 | up to 6      | up to 5| up to 9 |

- Enemies are placed on or near the Rift tile at room start.
- Additional threads are distributed across non-Rift, non-start border tiles.
- Room tier is determined by the node's position on the Level Map, not the player's level.
- Cache tiles do not appear in Tier 1. Cache tiles and artifact pickups appear in Tier 2+ rooms.

## Camera

The run board uses click-and-drag panning in the room viewport.

The camera bounds are intended to allow any hex tile to be centered in the viewport. The camera also recenters on the player's tile after room updates and movement.

## Run Actions

- `Move` enables adjacent movement selection.
- `Sigil-Cast` activates the Sigil-Casting panel below the program list.
- The first `Cast Sigils` roll casts all equipped dice automatically.
- Each turn starts with Actions equal to the current Actions stat. Each hex moved spends 1 Action. Opening the Sigil-Casting panel spends 1 Action and starts a full Sigil-Cast.
- Executions control roll attempts inside the active Sigil-Cast. The first roll casts all equipped dice automatically; later Execution rolls can choose unassigned sigils to reroll while keeping the others.
- `End Turn` resets Actions, advances the turn counter, runs the current Glitch Spawn step, and resolves adjacent enemy attacks.
- If all Glitchspawn in the room are derezzed, a one-time notice appears. After that, enemy turns are skipped and movement becomes unrestricted for the rest of the room.
- The map viewport shows the current phase as `Player Turn` or `Glitchspawn Turn` in its upper-right corner.
- Player controls are disabled during the Glitchspawn turn.
- Enemy tokens animate from their previous visible tile to their new visible tile during Glitchspawn movement.
- The player token animates to the destination hex before the camera recenters.
- If player Integrity reaches 0, the run ends with a defeat popup and returns to the main menu when acknowledged.

## Level Map

- `showLevelMap(character)` renders between character setup and the room.
- The current map uses `map/main_world_map.png` as the background image and overlays the playable node graph from `WORLD_MAP_SPEC.md`.
- The world map is split into four elemental route quadrants: Cindera/Surge, The Conclave/Mind, Parcel 7/Void, and Sestra Jungle/Life.
- The starter node at the top of each quadrant is unlocked at the beginning of a run, so the player can choose which elemental route to start.
- Downstream nodes remain darkened and disabled until a connected parent node is completed.
- Unlocked nodes and open route connections glow white. Completed nodes use a green completion treatment.
- Pressing a node only selects it; the player must press `Enter` to launch that room.
- The Level Map has a `Crafting` button above the map. Crafting opens a dice workbench where the player can drag or click sigils between the Databank inventory and custom die faces, then press `Done Crafting` to return to the Level Map.
- Room tier is derived from the selected world-map node depth. Start nodes are Tier 1 and boss nodes are Tier 6.

### Level Map Current Implementation

- `worldZones` in `main.js` stores each route's nodes, edges, element, and color treatment.
- `buildWorldLevelNodes()` converts local route node ids into unique ids such as `cindera-start` and `sestra-n11`.
- `startingMapState.unlockedNodes` is generated from all route start nodes.
- Completing a node calls `completeLevelNode()`, which unlocks every child listed in that node's edge list.
- Each world-map node has a `sigilProfile`, which is shown in the selected-node footer next to the Enter button and passed into room generation for floating Sigil pickups.
- Sigil generation rolls element and rarity separately.
- Starter nodes currently have an 85% matching route element chance and 5% for each other element. Rarity is 100% common, 0% uncommon, and 0% rare.
- Non-starter nodes currently use placeholder route-biased element odds and rarity odds that scale by node tier.

## Character Progression

- Characters track `level`, `xp`, and `xpToNextLevel` on the run character object so progress persists between rooms and the Level Map.
- Characters currently start at Level 1 with 0 XP and need 50 XP to reach Level 2.
- Characters currently start with CACHE 4. CACHE limits the number of programs the character can have equipped.
- The in-run program list shows one blank slot for each unused CACHE capacity.
- Characters keep a Program Library separate from equipped Programs. Cache rewards add Programs to the library; if the library exceeds CACHE capacity, the player chooses which Programs to equip.
- Enemy definitions include an `xpValue`. XP is awarded when that enemy is defeated.

### XP Threshold Scaling

XP required to level up scales at approximately 1.5x per level:

| Level | XP to Next Level |
|-------|-----------------|
| 1     | 50              |
| 2     | 100             |
| 3     | 150             |
| 4     | 225             |
| 5     | 340             |
| 6+    | continues ×1.5  |

After leveling up, `xpToNextLevel` should update to the next threshold. XP does not reset between rooms — it carries across the full run.

### Level-Up Rewards

When a level-up occurs from defeating an enemy, the reward appears immediately in the current room.

- **Add a die to the pool** — player selects one new die from any element.
- Level rewards currently only grant dice, not stats or programs.
- Current implementation grants a blank custom die with six empty faces instead of choosing an elemental die.

### Artifacts

Current artifact pool:
- `Memory Shard`: EXECUTIONS +1
- `Cache Core`: CACHE +1
- `Phase Spur`: Actions +1
- `Integrity Lattice`: max Integrity +1 and restores 1 Integrity

## Sigil-Casting and Programs

- Programs are greyed out when Sigil-Casting starts because no rolled symbols are available yet.
- Completed dice results produce `currentCastSymbols`.
- Programs become available only if their required unspent symbols are showing.
- Selecting a program highlights valid rolled sigils first. The player then clicks the specific sigil to assign, removes that spent die result from the Sigil-Casting area, and shows the allocated die tile outside the program card's right edge.
- Physical Damage also requires choosing a specific rolled sigil. Matching unspent copies of that same symbol are spent together for the 1/3/5 damage scaling.
- Room footer status text should be compact, share the map viewport width, and wrap across multiple lines when messages are long.
- `Physical Damage` appears only while Sigil-Casting. It is greyed out until at least one unspent die result exists.
- Damage indicators should pop over damaged targets or the player tile, use red text, and show the final Integrity damage dealt after defense.
- The Integrity stat HUD uses a red health bar with current/max text.
- Physical Damage uses the best matching group of unspent rolled symbols:
  - all unique symbols: 1 physical damage
  - two matching symbols: 3 physical damage
  - three or more matching symbols: 5 physical damage

Implemented program effects:
- `SPARK`: consumes one common Surge symbol, targets an adjacent enemy, and deals arcane damage minus Arcane Defense.
- `REBUILD`: consumes one common Life symbol and restores 1 Integrity immediately.
- `BLINK`: consumes one common Void symbol, then targets a connected hex exactly 2 spaces away in a straight line and teleports there.
- `QUAKE`: consumes one common Surge and one uncommon Life symbol, temporarily reveals all valid target hexes 2 spaces away in a straight line while aiming, and deals 1 physical damage if an enemy is there.
- `SHATTER`: consumes one common Mind and one uncommon Surge symbol, then reduces an adjacent enemy's Physical Defense and Arcane Defense by 1.
- `BLINK II`: consumes one common Surge and one uncommon Void symbol, then teleports exactly 3 spaces in a straight line.
- `DRAIN`: consumes one common Life and one uncommon Mind symbol, deals 1 arcane damage to an adjacent enemy, then heals 1 Integrity.
- `CONFUSE`: consumes one common Mind and one uncommon Void symbol, then makes an adjacent enemy attack another Glitchspawn on its next turn instead of the player.
- `FORTIFY`: consumes one common Void and one uncommon Life symbol, then clears cooldowns on all other equipped programs.
- `RIFT`: consumes one common Void and one uncommon Void symbol, then reveals all uncollected Rift Thread hexes for the current turn.
- `BOLT`: consumes one common Surge and one uncommon Surge symbol, then deals 2 arcane damage to an adjacent enemy.
- `PUSH`: consumes one common Life and one uncommon Life symbol, then pushes an adjacent enemy one hex away and stuns it for its next turn.
- `VISION`: consumes one common Mind and one uncommon Mind symbol, then increases line of sight by 1 until the end of the next player turn.
- `Physical Damage`: consumes one or more symbols based on the best matching group, targets an adjacent enemy, and deals physical damage minus Physical Defense.
- `FOCUS`: consumes one common Mind symbol and adds 1 temporary Execution to the next player turn.

## Enemies

### Current Enemy

- `Void Raider`
- Image: `characters/glitchspawn_1.png`
- Integrity: 4
- Physical Defense: 0
- Arcane Defense: 0
- Power: 1
- XP Value: 25

The Void Raider starts on the Rift tile. After the player's turn, it moves one adjacent step toward the player unless already adjacent. If adjacent, it attacks the player for damage equal to its Power.

If the Void Raider is within the player's visible tiles, its tile is highlighted red and a compact enemy row appears on the right side. Hover/focus on that row shows full details.

### Glitchspawn Behavior and Accuracy

- `neutral`: moves randomly to an adjacent open tile each Glitchspawn turn.
- `aggressive`: has a 50% chance each Glitchspawn turn to move one adjacent step toward the player.
- `hyperAggressive`: moves one adjacent step toward the player every Glitchspawn turn.
- Enemy attacks use `stats.accuracy` as a hit chance. Baseline accuracy starts around 40%.
- Accuracy currently increases by 5 percentage points per room tier above Tier 1, capped at 85%.

### Additional Enemies

**Surge Crawler**
- Integrity: 3
- Physical Defense: 0
- Arcane Defense: 0
- Power: 3
- XP Value: 30
- Behavior: Aggressive. Has a 50% chance each Glitchspawn turn to move toward the player. High damage, low survivability. Glass cannon.

**Mind Phantom**
- Integrity: 5
- Physical Defense: 0
- Arcane Defense: 1
- Power: 1
- XP Value: 40
- Behavior: Neutral movement. Also forces one of the player's dice to re-roll at the start of the player's Sigil-Casting phase. Threatening because it disrupts symbol matching, not because of raw damage.

### Enemy Scaling

- Tier 1 rooms: 1 Void Raider starts on the Rift with 1 Integrity and uses stationary behavior, so it does not move off the Rift.
- Tier 2 rooms: 2 enemies, mix of Void Raider and Surge Crawler.
- Tier 3 rooms: 3 enemies, introduce Mind Phantom. Begin mixing all three types.
- Tier 4+ rooms: enemy counts keep increasing with tier until the current cap of 9 enemies.
- Enemy Integrity, Power, Accuracy, Defense, and XP value scale upward by room tier.

### Multiple Enemy Support

- The right-side enemy list must render all visible enemies, not just one.
- Target selection for programs and Physical Damage must support choosing among multiple adjacent enemies.
- Each visible enemy tile should be highlighted red. Clicking a highlighted tile selects that enemy as the target when a program or attack is pending.

## Likely Next Implementation Steps

Items below track likely next steps now that branching room tiers, XP, program rewards, artifacts, and multiple enemy support have initial implementations.

### UI/UX Polish Queue

- Add clearer damage indicator styling and timing once combat visuals are more stable.
- Improve Sigil-Casting affordance around remaining casts per turn and spent casts.
- Add stronger phase feedback after a program has been allocated.
- Begin pixel-art UI treatment after the dice-crafting model is stable.

1. **Design sigil metadata and crafted dice data** - separate sigils from fixed die faces, then define blank/locked/filled face slots.
2. **Refactor rolling around crafted dice** - rolled results should come from the sigils attached to each die face.
3. **Update starting loadout** - give all four base programs and one 3-face custom starting die.
4. **Expand baseline vision and room scale** - increase vision to 2 spaces, enlarge room layouts, and shrink board assets roughly 50%.
5. **Improve world-map identity** - add elemental route themes, reward previews, and region-specific encounter bias.
6. **Begin pixel-art conversion** - replace map, character, enemy, sigil, artifact, and UI assets in stages.
7. **Add enemy variety** - add more Glitchspawn profiles so high-tier rooms are not just larger copies of early rooms.
8. **Add room objective variety** - keep Thread Hunt as the base, then add alternate map objectives after the combat loop feels stable.
