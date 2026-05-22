// Editable artifact metadata.
// Supported stat values: cache, exec, move, maxIntegrity.
// Amount defaults to 1 when omitted.
window.arcaneMetadata = window.arcaneMetadata || {};

window.arcaneMetadata.artifacts = [
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
