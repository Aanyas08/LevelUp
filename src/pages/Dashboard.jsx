import { Flame, Star, CheckCircle2, TrendingUp, Coins } from 'lucide-react'
import LevelRing from '../components/LevelRing.jsx'
import StatCard from '../components/StatCard.jsx'
import HabitItem from '../components/HabitItem.jsx'
import AchievementBadge from '../components/AchievementBadge.jsx'
import LevelUpModal from '../components/LevelUpModal.jsx'
import { useGame } from '../game/GameContext.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Dashboard() {
  const {
    player, habits, xpCap, doneCount, totalCount, dailyCompletionPct,
    rank, toggleHabit, updateHabitTimer, updateHabitNumeric, levelUpEvent, clearLevelUpEvent,
  } = useGame()

  const {user} = useAuth()

  return (
    <div className="max-w-5xl">
      <LevelUpModal event={levelUpEvent} onClose={clearLevelUpEvent} />

      <div className="bg-surface border border-border rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Guest'}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Day {player.currentStreak} of your journey &middot; {rank}
          </p>
          <div className="mt-5 w-72">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-400">XP to next level</span>
              <span className="text-teal font-medium">{player.xp} / {xpCap}</span>
            </div>
            <div className="h-2.5 bg-surface-light rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${Math.min((player.xp / xpCap) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
        <LevelRing level={player.level} xp={player.xp} xpCap={xpCap} size={72} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Flame} iconColor="text-orange-400" value={`${player.currentStreak} days`} label="Day streak" />
        <StatCard icon={Star} iconColor="text-teal" value={player.totalXpEarned} label="Total XP" />
        <StatCard icon={Coins} iconColor="text-gold" value={player.coins} label="Coins" />
        <StatCard icon={CheckCircle2} iconColor="text-blue-400" value={`${doneCount} / ${totalCount}`} label="Habits done" />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-300">Today's habits — tap to complete</p>
          <span className="flex items-center gap-1.5 text-xs text-purple font-medium">
            <TrendingUp size={14} />
            {dailyCompletionPct}% today
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {habits.map((h) => (
            <HabitItem
              key={h.id}
              habit={h}
              onToggle={() => toggleHabit(h.id)}
              onUpdateTimer={updateHabitTimer}
              onUpdateNumeric={updateHabitNumeric}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-3">Badge case</p>
        <div className="flex gap-4">
          <AchievementBadge title="7-day streak" tier="bronze" unlocked={true} index={0} />
          <AchievementBadge title="Level 5" tier="silver" unlocked={true} index={1} />
          <AchievementBadge title="50 habits done" tier="gold" unlocked={true} index={2} />
        </div>
      </div>
    </div>
  )
}
