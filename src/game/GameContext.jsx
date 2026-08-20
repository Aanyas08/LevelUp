// import { createContext, useCallback, useContext, useMemo, useState } from 'react'
// import { useLocalStorage } from '../hooks/useLocalStorage.js'
// import { xpForLevel, rankForLevel, DIFFICULTY_REWARDS } from './xpCurve.js'
// import { initialHabits, initialPlayer } from './initialData.js'

// const GameContext = createContext(null)

// export function GameProvider({ children }) {
//   const [player, setPlayer] = useLocalStorage('levelup:player', initialPlayer)
//   const [habits, setHabits] = useLocalStorage('levelup:habits', initialHabits)
//   // Transient — not persisted. Holds level-up info while the celebration
//   // modal is showing, then gets cleared.
//   const [levelUpEvent, setLevelUpEvent] = useState(null)

//   /**
//    * Shared completion engine. Every tracking type (tick / timer / numeric)
//    * eventually funnels through here so XP, coins, streaks, and level-ups
//    * stay consistent regardless of how "done" was triggered.
//    */
//   const applyDoneChange = useCallback(
//     (id, nowDone) => {
//       setHabits((prevHabits) => {
//         const habit = prevHabits.find((h) => h.id === id)
//         if (!habit || habit.done === nowDone) return prevHabits

//         setPlayer((prevPlayer) => {
//           const xpDelta = nowDone ? habit.xp : -habit.xp
//           const coinDelta = nowDone ? habit.coins : -habit.coins

//           let xp = prevPlayer.xp + xpDelta
//           let level = prevPlayer.level
//           let leveledUpTo = null
//           let bonusCoins = 0

//           if (xpDelta > 0) {
//             let required = xpForLevel(level)
//             while (xp >= required) {
//               xp -= required
//               level += 1
//               bonusCoins += 50
//               leveledUpTo = level
//               required = xpForLevel(level)
//             }
//           }
//           if (xp < 0) xp = 0

//           const totalXpEarned = Math.max(0, prevPlayer.totalXpEarned + xpDelta)
//           const coins = Math.max(0, prevPlayer.coins + coinDelta + bonusCoins)

//           if (leveledUpTo) {
//             setLevelUpEvent({ level: leveledUpTo, bonusCoins, rank: rankForLevel(leveledUpTo) })
//           }

//           return { ...prevPlayer, xp, level, totalXpEarned, coins }
//         })

//         return prevHabits.map((h) =>
//           h.id === id
//             ? {
//                 ...h,
//                 done: nowDone,
//                 totalCompletions: h.totalCompletions + (nowDone ? 1 : -1),
//                 currentStreak: nowDone ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
//                 longestStreak: nowDone
//                   ? Math.max(h.longestStreak, h.currentStreak + 1)
//                   : h.longestStreak,
//               }
//             : h
//         )
//       })
//     },
//     [setHabits, setPlayer]
//   )

//   // Tick habits: a plain checkbox toggle.
//   const toggleHabit = useCallback(
//     (id) => {
//       const habit = habits.find((h) => h.id === id)
//       if (!habit) return
//       applyDoneChange(id, !habit.done)
//     },
//     [habits, applyDoneChange]
//   )

//   // Timer habits: called whenever the elapsed seconds change (on pause, on
//   // completion, on manual reset). Only crosses into "done" once, and only
//   // reverses "done" if the value is explicitly walked back below target.
//   const updateHabitTimer = useCallback(
//     (id, elapsedSeconds) => {
//       const habit = habits.find((h) => h.id === id)
//       if (!habit) return
//       const clamped = Math.max(0, Math.min(elapsedSeconds, habit.timerTargetSeconds))

//       setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, timerElapsedSeconds: clamped } : h)))

//       const nowDone = clamped >= habit.timerTargetSeconds
//       if (nowDone !== habit.done) applyDoneChange(id, nowDone)
//     },
//     [habits, setHabits, applyDoneChange]
//   )

//   // Numeric habits: same pattern — set the current value, then evaluate
//   // whether that crosses the target threshold.
//   const updateHabitNumeric = useCallback(
//     (id, value) => {
//       const habit = habits.find((h) => h.id === id)
//       if (!habit) return
//       const clamped = Math.max(0, value)

//       setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, numericValue: clamped } : h)))

//       const nowDone = clamped >= habit.numericTarget
//       if (nowDone !== habit.done) applyDoneChange(id, nowDone)
//     },
//     [habits, setHabits, applyDoneChange]
//   )

//   const addHabit = useCallback(
//     ({
//       title,
//       description = '',
//       category = 'Discipline',
//       difficulty = 'Medium',
//       frequency = 'Daily',
//       timeEstimate = '10 min',
//       icon = 'Sparkles',
//       color = 'teal',
//       kind = 'habit', // 'habit' (recurring) | 'task' (one-off)
//       trackingType = 'tick', // 'tick' | 'timer' | 'numeric'
//       timerTargetSeconds = 600,
//       numericTarget = 10,
//       numericUnit = 'reps',
//     }) => {
//       const rewards = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.Medium
//       setHabits((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           title,
//           description,
//           category,
//           difficulty,
//           frequency: kind === 'task' ? 'Once' : frequency,
//           timeEstimate,
//           icon,
//           color,
//           kind,
//           trackingType,
//           timerTargetSeconds,
//           timerElapsedSeconds: 0,
//           numericTarget,
//           numericUnit,
//           numericValue: 0,
//           done: false,
//           currentStreak: 0,
//           longestStreak: 0,
//           totalCompletions: 0,
//           ...rewards,
//         },
//       ])
//     },
//     [setHabits]
//   )

//   const removeHabit = useCallback(
//     (id) => {
//       setHabits((prev) => prev.filter((h) => h.id !== id))
//     },
//     [setHabits]
//   )

//   const clearLevelUpEvent = useCallback(() => setLevelUpEvent(null), [])

//   const derived = useMemo(() => {
//     const xpCap = xpForLevel(player.level)
//     const doneCount = habits.filter((h) => h.done).length
//     const dailyHabits = habits.filter((h) => h.frequency === 'Daily')
//     const dailyDone = dailyHabits.filter((h) => h.done).length
//     const dailyCompletionPct = dailyHabits.length
//       ? Math.round((dailyDone / dailyHabits.length) * 100)
//       : 0
//     return {
//       xpCap,
//       doneCount,
//       totalCount: habits.length,
//       dailyCompletionPct,
//       rank: rankForLevel(player.level),
//     }
//   }, [player.level, habits])

//   const value = useMemo(
//     () => ({
//       player,
//       habits,
//       ...derived,
//       toggleHabit,
//       updateHabitTimer,
//       updateHabitNumeric,
//       addHabit,
//       removeHabit,
//       levelUpEvent,
//       clearLevelUpEvent,
//     }),
//     [
//       player,
//       habits,
//       derived,
//       toggleHabit,
//       updateHabitTimer,
//       updateHabitNumeric,
//       addHabit,
//       removeHabit,
//       levelUpEvent,
//       clearLevelUpEvent,
//     ]
//   )

//   return <GameContext.Provider value={value}>{children}</GameContext.Provider>
// }

// export function useGame() {
//   const ctx = useContext(GameContext)
//   if (!ctx) throw new Error('useGame must be used within a GameProvider')
//   return ctx
// }
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage.js'
import {
  xpForLevel,
  rankForLevel,
  DIFFICULTY_REWARDS,
} from './xpCurve.js'
import {
  initialHabits,
  initialPlayer,
} from './initialData.js'

const GameContext = createContext(null)

const COMPLETION_HISTORY_KEY =
  'levelup:completionHistory'

function getDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(
    2,
    '0'
  )
  const d = String(date.getDate()).padStart(
    2,
    '0'
  )

  return `${y}-${m}-${d}`
}

function parseDateKey(key) {
  const [year, month, day] =
    key.split('-').map(Number)

  return new Date(
    year,
    month - 1,
    day
  )
}

function startOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return startOfDay(next)
}

/*
 * Determines whether a habit is supposed to appear
 * on a particular date.
 */
function isScheduledOn(habit, date) {
  const target = startOfDay(date)

  // Old habits created before the scheduling feature
  // continue behaving normally.
  if (!habit.scheduledDate) {
    return true
  }

  const scheduledDate =
    parseDateKey(habit.scheduledDate)

  if (target < scheduledDate) {
    return false
  }

  // Tasks are one-time.
  if (habit.kind === 'task') {
    return (
      getDateKey(target) ===
      habit.scheduledDate
    )
  }

  // Weekly habits repeat on the same weekday.
  if (habit.frequency === 'Weekly') {
    return (
      target.getDay() ===
      scheduledDate.getDay()
    )
  }

  // Daily habits repeat from their start date.
  return true
}

function completionKey(id, dateKey) {
  return `${id}:${dateKey}`
}

function getCompleted(
  history,
  id,
  dateKey
) {
  return Boolean(
    history[completionKey(id, dateKey)]
  )
}

/*
 * Calculate a streak from the completion history.
 *
 * For a daily habit:
 *   today -> yesterday -> day before...
 *
 * For a weekly habit:
 *   same weekday, going backwards by 7 days.
 */
function calculateStreak(
  habit,
  history,
  fromDate = new Date()
) {
  let streak = 0
  let cursor = startOfDay(fromDate)

  if (
    !isScheduledOn(habit, cursor)
  ) {
    cursor = addDays(cursor, -1)
  }

  const step =
    habit.frequency === 'Weekly'
      ? -7
      : -1

  for (let i = 0; i < 1000; i += 1) {
    const key = getDateKey(cursor)

    if (
      isScheduledOn(habit, cursor) &&
      getCompleted(
        history,
        habit.id,
        key
      )
    ) {
      streak += 1
      cursor = addDays(
        cursor,
        step
      )
    } else {
      break
    }
  }

  return streak
}

export function GameProvider({
  children,
}) {
  const [player, setPlayer] =
    useLocalStorage(
      'levelup:player',
      initialPlayer
    )

  const [habits, setHabits] =
    useLocalStorage(
      'levelup:habits',
      initialHabits
    )

  /*
   * Completion history is now persisted separately
   * from the habit itself.
   *
   * Example:
   *
   * {
   *   "123:2026-08-20": true,
   *   "123:2026-08-21": true,
   *   "456:2026-08-20": false
   * }
   */
  const [
    completionHistory,
    setCompletionHistory,
  ] = useLocalStorage(
    COMPLETION_HISTORY_KEY,
    {}
  )

  const [levelUpEvent, setLevelUpEvent] =
    useState(null)

  /*
   * Shared completion engine.
   *
   * dateKey is important now because a habit can be
   * completed on different calendar dates.
   */
  const applyDoneChange = useCallback(
    (
      id,
      nowDone,
      dateKey = getDateKey()
    ) => {
      const currentValue =
        getCompleted(
          completionHistory,
          id,
          dateKey
        )

      if (currentValue === nowDone) {
        return
      }

      const habit = habits.find(
        (h) => h.id === id
      )

      if (!habit) return

      /*
       * Save calendar completion.
       */
      setCompletionHistory(
        (prevHistory) => ({
          ...prevHistory,
          [completionKey(
            id,
            dateKey
          )]: nowDone,
        })
      )

      /*
       * XP and coins still use your existing
       * reward system.
       */
      setPlayer((prevPlayer) => {
        const xpDelta = nowDone
          ? habit.xp
          : -habit.xp

        const coinDelta = nowDone
          ? habit.coins
          : -habit.coins

        let xp =
          prevPlayer.xp + xpDelta

        let level =
          prevPlayer.level

        let leveledUpTo = null
        let bonusCoins = 0

        if (xpDelta > 0) {
          let required =
            xpForLevel(level)

          while (xp >= required) {
            xp -= required
            level += 1
            bonusCoins += 50
            leveledUpTo = level
            required =
              xpForLevel(level)
          }
        }

        if (xp < 0) {
          xp = 0
        }

        const totalXpEarned =
          Math.max(
            0,
            prevPlayer.totalXpEarned +
              xpDelta
          )

        const coins =
          Math.max(
            0,
            prevPlayer.coins +
              coinDelta +
              bonusCoins
          )

        if (leveledUpTo) {
          setLevelUpEvent({
            level: leveledUpTo,
            bonusCoins,
            rank: rankForLevel(
              leveledUpTo
            ),
          })
        }

        return {
          ...prevPlayer,
          xp,
          level,
          totalXpEarned,
          coins,
        }
      })

      /*
       * Update the habit's legacy "done" value
       * only when we're changing today's state.
       *
       * This keeps your existing dashboard and
       * other components compatible.
       */
      if (dateKey === getDateKey()) {
        setHabits((prevHabits) =>
          prevHabits.map((h) => {
            if (h.id !== id) {
              return h
            }

            const newHistory = {
              ...completionHistory,
              [completionKey(
                id,
                dateKey
              )]: nowDone,
            }

            const currentStreak =
              calculateStreak(
                h,
                newHistory
              )

            const longestStreak =
              Math.max(
                h.longestStreak || 0,
                currentStreak
              )

            return {
              ...h,
              done: nowDone,
              currentStreak,
              longestStreak,
              totalCompletions:
                Math.max(
                  0,
                  (h.totalCompletions ||
                    0) +
                    (nowDone ? 1 : -1)
                ),
            }
          })
        )
      } else {
        /*
         * Historical/future calendar completion:
         * don't change today's "done" value,
         * but update streak metadata.
         */
        setHabits((prevHabits) =>
          prevHabits.map((h) => {
            if (h.id !== id) {
              return h
            }

            const newHistory = {
              ...completionHistory,
              [completionKey(
                id,
                dateKey
              )]: nowDone,
            }

            const currentStreak =
              calculateStreak(
                h,
                newHistory
              )

            return {
              ...h,
              currentStreak,
              longestStreak: Math.max(
                h.longestStreak || 0,
                currentStreak
              ),
              totalCompletions:
                Math.max(
                  0,
                  (h.totalCompletions ||
                    0) +
                    (nowDone ? 1 : -1)
                ),
            }
          })
        )
      }
    },
    [
      habits,
      completionHistory,
      setHabits,
      setPlayer,
      setCompletionHistory,
    ]
  )

  /*
   * Tick habits.
   *
   * dateKey can now be supplied by the calendar.
   */
  const toggleHabit = useCallback(
    (
      id,
      dateKey = getDateKey()
    ) => {
      const currentDone =
        getCompleted(
          completionHistory,
          id,
          dateKey
        )

      applyDoneChange(
        id,
        !currentDone,
        dateKey
      )
    },
    [
      completionHistory,
      applyDoneChange,
    ]
  )

  /*
   * Timer habits.
   */
  const updateHabitTimer =
    useCallback(
      (
        id,
        elapsedSeconds,
        dateKey = getDateKey()
      ) => {
        const habit = habits.find(
          (h) => h.id === id
        )

        if (!habit) return

        const clamped = Math.max(
          0,
          Math.min(
            elapsedSeconds,
            habit.timerTargetSeconds
          )
        )

        /*
         * Timer value is still stored on the
         * habit for today's normal UI.
         */
        if (
          dateKey === getDateKey()
        ) {
          setHabits((prev) =>
            prev.map((h) =>
              h.id === id
                ? {
                    ...h,
                    timerElapsedSeconds:
                      clamped,
                  }
                : h
            )
          )
        }

        const nowDone =
          clamped >=
          habit.timerTargetSeconds

        const currentDone =
          getCompleted(
            completionHistory,
            id,
            dateKey
          )

        if (
          nowDone !== currentDone
        ) {
          applyDoneChange(
            id,
            nowDone,
            dateKey
          )
        }
      },
      [
        habits,
        setHabits,
        completionHistory,
        applyDoneChange,
      ]
    )

  /*
   * Numeric habits.
   */
  const updateHabitNumeric =
    useCallback(
      (
        id,
        value,
        dateKey = getDateKey()
      ) => {
        const habit = habits.find(
          (h) => h.id === id
        )

        if (!habit) return

        const clamped = Math.max(
          0,
          value
        )

        /*
         * Keep the existing numeric UI
         * compatible for today's habit.
         */
        if (
          dateKey === getDateKey()
        ) {
          setHabits((prev) =>
            prev.map((h) =>
              h.id === id
                ? {
                    ...h,
                    numericValue:
                      clamped,
                  }
                : h
            )
          )
        }

        const nowDone =
          clamped >=
          habit.numericTarget

        const currentDone =
          getCompleted(
            completionHistory,
            id,
            dateKey
          )

        if (
          nowDone !== currentDone
        ) {
          applyDoneChange(
            id,
            nowDone,
            dateKey
          )
        }
      },
      [
        habits,
        setHabits,
        completionHistory,
        applyDoneChange,
      ]
    )

  /*
   * Create habit/task.
   *
   * NEW:
   * scheduledDate
   */
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
      kind = 'habit',
      trackingType = 'tick',
      timerTargetSeconds = 600,
      numericTarget = 10,
      numericUnit = 'reps',
      scheduledDate = getDateKey(),
    }) => {
      const rewards =
        DIFFICULTY_REWARDS[
          difficulty
        ] ||
        DIFFICULTY_REWARDS.Medium

      const newHabit = {
        id: Date.now(),
        title,
        description,
        category,
        difficulty,

        /*
         * Tasks remain "Once".
         * Habits use Daily/Weekly.
         */
        frequency:
          kind === 'task'
            ? 'Once'
            : frequency,

        /*
         * NEW
         */
        scheduledDate,

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
      }

      setHabits((prev) => [
        ...prev,
        newHabit,
      ])
    },
    [setHabits]
  )

  const removeHabit =
    useCallback(
      (id) => {
        setHabits((prev) =>
          prev.filter(
            (h) => h.id !== id
          )
        )

        /*
         * Remove this habit's calendar
         * history as well.
         */
        setCompletionHistory(
          (prevHistory) => {
            const next = {
              ...prevHistory,
            }

            Object.keys(next).forEach(
              (key) => {
                if (
                  key.startsWith(
                    `${id}:`
                  )
                ) {
                  delete next[key]
                }
              }
            )

            return next
          }
        )
      },
      [
        setHabits,
        setCompletionHistory,
      ]
    )

  const clearLevelUpEvent =
    useCallback(
      () => setLevelUpEvent(null),
      []
    )

  /*
   * Derived statistics.
   *
   * Keep your existing dashboard values.
   */
  const derived = useMemo(() => {
    const xpCap =
      xpForLevel(player.level)

    const today = getDateKey()

    const doneCount =
      habits.filter((h) =>
        getCompleted(
          completionHistory,
          h.id,
          today
        )
      ).length

    const dailyHabits =
      habits.filter(
        (h) =>
          h.frequency === 'Daily'
      )

    const dailyDone =
      dailyHabits.filter((h) =>
        getCompleted(
          completionHistory,
          h.id,
          today
        )
      ).length

    const dailyCompletionPct =
      dailyHabits.length
        ? Math.round(
            (dailyDone /
              dailyHabits.length) *
              100
          )
        : 0

    return {
      xpCap,
      doneCount,
      totalCount: habits.length,
      dailyCompletionPct,
      rank: rankForLevel(
        player.level
      ),
    }
  }, [
    player.level,
    habits,
    completionHistory,
  ])

  const value = useMemo(
    () => ({
      player,
      habits,
      completionHistory,

      ...derived,

      toggleHabit,
      updateHabitTimer,
      updateHabitNumeric,
      addHabit,
      removeHabit,

      isScheduledOn,

      getDateKey,

      levelUpEvent,
      clearLevelUpEvent,
    }),
    [
      player,
      habits,
      completionHistory,
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

  return (
    <GameContext.Provider
      value={value}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(
    GameContext
  )

  if (!ctx) {
    throw new Error(
      'useGame must be used within a GameProvider'
    )
  }

  return ctx
}
