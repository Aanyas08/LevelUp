import StatCard from '../components/StatCard.jsx'
import { Flame, Star, TrendingUp, Trophy } from 'lucide-react'
import { useGame } from '../game/GameContext.jsx'

const weeks = [
  { label: 'Mon', pct: 100 },
  { label: 'Tue', pct: 80 },
  { label: 'Wed', pct: 100 },
  { label: 'Thu', pct: 60 },
  { label: 'Fri', pct: 100 },
  { label: 'Sat', pct: 40 },
  { label: 'Sun', pct: 0 },
]

export default function Progress() {
  const { player, dailyCompletionPct } = useGame()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Your progress</h1>
      <p className="text-gray-400 text-sm mb-6">A look at how consistent you've been this week.</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Flame} iconColor="text-orange-400" value={`${player.currentStreak} days`} label="Current streak" />
        <StatCard icon={Star} iconColor="text-teal" value={player.totalXpEarned} label="Total XP" />
        <StatCard icon={TrendingUp} iconColor="text-purple" value={`${dailyCompletionPct}%`} label="Today's completion" />
        <StatCard icon={Trophy} iconColor="text-gold" value="6" label="Badges earned" />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <p className="text-sm font-medium text-gray-300 mb-5">This week</p>
        <div className="flex items-end justify-between gap-3 h-40">
          {weeks.map((w) => (
            <div key={w.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full bg-teal/80 rounded-t-md"
                style={{ height: `${w.pct}%`, minHeight: w.pct > 0 ? '4px' : '2px' }}
              />
              <span className="text-xs text-gray-500">{w.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
