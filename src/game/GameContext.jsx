import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { xpForLevel, rankForLevel, DIFFICULTY_REWARDS } from './xpCurve.js'
import { initialHabits, initialPlayer } from './initialData.js'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [player, setPlayer] = useLocalStorage('levelup:player', initialPlayer)
  const [habits, setHabits] = useLocalStorage('levelup:habits', initialHabits)
  // Transient — not persisted. Holds level-up info while the celebration
  // modal is showing, then gets cleared.
  const [levelUpEvent, setLevelUpEvent] = useState(null)

  /**
   * Shared completion engine. Every tracking type (tick / timer / numeric)
   * eventually funnels through here so XP, coins, streaks, and level-ups
   * stay consistent regardless of how "done" was triggered.
   */
  const applyDoneChange = useCallback(
    (id, nowDone) => {
      setHabits((prevHabits) => {
        const habit = prevHabits.find((h) => h.id === id)
        if (!habit || habit.done === nowDone) return prevHabits

        setPlayer((prevPlayer) => {
          const xpDelta = nowDone ? habit.xp : -habit.xp
          const coinDelta = nowDone ? habit.coins : -habit.coins

          let xp = prevPlayer.xp + xpDelta
          let level = prevPlayer.level
          let leveledUpTo = null
          let bonusCoins = 0

          if (xpDelta > 0) {
            let required = xpForLevel(level)
            while (xp >= required) {
              xp -= required
              level += 1
              bonusCoins += 50
              leveledUpTo = level
              required = xpForLevel(level)
            }
          }
          if (xp < 0) xp = 0

          const totalXpEarned = Math.max(0, prevPlayer.totalXpEarned + xpDelta)
          const coins = Math.max(0, prevPlayer.coins + coinDelta + bonusCoins)

          if (leveledUpTo) {
            setLevelUpEvent({ level: leveledUpTo, bonusCoins, rank: rankForLevel(leveledUpTo) })
          }

          return { ...prevPlayer, xp, level, totalXpEarned, coins }
        })

        return prevHabits.map((h) =>
          h.id === id
            ? {
                ...h,
                done: nowDone,
                totalCompletions: h.totalCompletions + (nowDone ? 1 : -1),
                currentStreak: nowDone ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
                longestStreak: nowDone
                  ? Math.max(h.longestStreak, h.currentStreak + 1)
                  : h.longestStreak,
              }
            : h
        )
      })
    },
    [setHabits, setPlayer]
  )

  // Tick habits: a plain checkbox toggle.
  const toggleHabit = useCallback(
    (id) => {
      const habit = habits.find((h) => h.id === id)
      if (!habit) return
      applyDoneChange(id, !habit.done)
    },
    [habits, applyDoneChange]
  )

  // Timer habits: called whenever the elapsed seconds change (on pause, on
  // completion, on manual reset). Only crosses into "done" once, and only
  // reverses "done" if the value is explicitly walked back below target.
  const updateHabitTimer = useCallback(
    (id, elapsedSeconds) => {
      const habit = habits.find((h) => h.id === id)
      if (!habit) return
      const clamped = Math.max(0, Math.min(elapsedSeconds, habit.timerTargetSeconds))

      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, timerElapsedSeconds: clamped } : h)))

      const nowDone = clamped >= habit.timerTargetSeconds
      if (nowDone !== habit.done) applyDoneChange(id, nowDone)
    },
    [habits, setHabits, applyDoneChange]
  )

  // Numeric habits: same pattern — set the current value, then evaluate
  // whether that crosses the target threshold.
  const updateHabitNumeric = useCallback(
    (id, value) => {
      const habit = habits.find((h) => h.id === id)
      if (!habit) return
      const clamped = Math.max(0, value)

      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, numericValue: clamped } : h)))

      const nowDone = clamped >= habit.numericTarget
      if (nowDone !== habit.done) applyDoneChange(id, nowDone)
    },
    [habits, setHabits, applyDoneChange]
  )

  const addHabit = useCallback(
    ({
      title,
      description = '',
      category = 'Discipline',
      difficulty = 'Medium',
      frequency = 'Daily',
      timeEstimate = '10 min',
      icon = 'Sparkles',
      color = 'teal',
      kind = 'habit', // 'habit' (recurring) | 'task' (one-off)
      trackingType = 'tick', // 'tick' | 'timer' | 'numeric'
      timerTargetSeconds = 600,
      numericTarget = 10,
      numericUnit = 'reps',
    }) => {
      const rewards = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.Medium
      setHabits((prev) => [
        ...prev,
        {
          id: Date.now(),
          title,
          description,
          category,
          difficulty,
          frequency: kind === 'task' ? 'Once' : frequency,
          timeEstimate,
          icon,
          color,
          kind,
          trackingType,
          timerTargetSeconds,
          timerElapsedSeconds: 0,
          numericTarget,
          numericUnit,
          numericValue: 0,
          done: false,
          currentStreak: 0,
          longestStreak: 0,
          totalCompletions: 0,
          ...rewards,
        },
      ])
    },
    [setHabits]
  )

  const removeHabit = useCallback(
    (id) => {
      setHabits((prev) => prev.filter((h) => h.id !== id))
    },
    [setHabits]
  )

  const clearLevelUpEvent = useCallback(() => setLevelUpEvent(null), [])

  const derived = useMemo(() => {
    const xpCap = xpForLevel(player.level)
    const doneCount = habits.filter((h) => h.done).length
    const dailyHabits = habits.filter((h) => h.frequency === 'Daily')
    const dailyDone = dailyHabits.filter((h) => h.done).length
    const dailyCompletionPct = dailyHabits.length
      ? Math.round((dailyDone / dailyHabits.length) * 100)
      : 0
    return {
      xpCap,
      doneCount,
      totalCount: habits.length,
      dailyCompletionPct,
      rank: rankForLevel(player.level),
    }
  }, [player.level, habits])

  const value = useMemo(
    () => ({
      player,
      habits,
      ...derived,
      toggleHabit,
      updateHabitTimer,
      updateHabitNumeric,
      addHabit,
      removeHabit,
      levelUpEvent,
      clearLevelUpEvent,
    }),
    [
      player,
      habits,
      derived,
      toggleHabit,
      updateHabitTimer,
      updateHabitNumeric,
      addHabit,
      removeHabit,
      levelUpEvent,
      clearLevelUpEvent,
    ]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within a GameProvider')
  return ctx
}
