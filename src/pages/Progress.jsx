import StatCard from '../components/StatCard.jsx'
import { Flame, Star, TrendingUp, Trophy } from 'lucide-react'
import { useGame } from '../game/GameContext.jsx'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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

      <p className="text-gray-400 text-sm mb-6">
        A look at how consistent you've been this week.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Flame}
          iconColor="text-orange-400"
          value={`${player.currentStreak} days`}
          label="Current streak"
        />

        <StatCard
          icon={Star}
          iconColor="text-teal"
          value={player.totalXpEarned}
          label="Total XP"
        />

        <StatCard
          icon={TrendingUp}
          iconColor="text-purple"
          value={`${dailyCompletionPct}%`}
          label="Today's completion"
        />

        <StatCard
          icon={Trophy}
          iconColor="text-gold"
          value="6"
          label="Badges earned"
        />
      </div>

      {/* Weekly Progress Line Chart */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <p className="text-sm font-medium text-gray-300 mb-5">
          This week
        </p>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeks}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2d38"
              />

              <XAxis
                dataKey="label"
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e202b',
                  border: '1px solid #343744',
                  borderRadius: '10px',
                  color: '#fff',
                }}
                formatter={(value) => [`${value}%`, 'Completion']}
              />

              <Line
                type="monotone"
                dataKey="pct"
                stroke="#48d8d0"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: '#48d8d0',
                  stroke: '#0d0e14',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}