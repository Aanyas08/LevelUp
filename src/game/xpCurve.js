// XP required to go FROM level `level` TO level `level + 1`.
// Increment grows by +25 each level: 50, 75, 100, 125...
// Level 1 -> 2 costs 100 (base), matching the spec's example table:
// L1: 100, L2: 150, L3: 225, L4: 325, L5: 450 ...
export function xpForLevel(level) {
  if (level <= 1) return 100
  const n = level
  // Closed form of: 100 + sum_{i=1}^{n-1} (50 + 25*(i-1))
  return Math.round(100 + 12.5 * (n - 1) * (n + 2))
}

// Ranks unlock as the player levels up. Used for the "Rank" stat and
// eventually equip-able Titles (Phase 3).
const RANKS = [
  { minLevel: 1, name: 'Beginner' },
  { minLevel: 3, name: 'Habit Apprentice' },
  { minLevel: 6, name: 'Consistency Knight' },
  { minLevel: 10, name: 'XP Hunter' },
  { minLevel: 15, name: 'Discipline Warrior' },
  { minLevel: 20, name: 'Focus Master' },
  { minLevel: 25, name: 'Routine Architect' },
  { minLevel: 30, name: 'Habit Legend' },
]

export function rankForLevel(level) {
  let current = RANKS[0].name
  for (const r of RANKS) {
    if (level >= r.minLevel) current = r.name
  }
  return current
}

export function nextRank(level) {
  return RANKS.find((r) => r.minLevel > level) || null
}

// Difficulty -> reward table, matches the spec's examples
// (Medium: +25 XP/+10 coins, Hard: +50 XP/+20 coins, etc.)
export const DIFFICULTY_REWARDS = {
  Easy: { xp: 15, coins: 5 },
  Medium: { xp: 25, coins: 10 },
  Hard: { xp: 50, coins: 20 },
  Epic: { xp: 100, coins: 40 },
}

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic']
