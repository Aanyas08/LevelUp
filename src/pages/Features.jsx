import { Star, Flame, TrendingUp, Trophy, BarChart3, Bot } from 'lucide-react'
import LevelRing from '../components/LevelRing.jsx'
import FeatureCard from '../components/FeatureCard.jsx'
import StreakDay from '../components/StreakDay.jsx'
import JourneyMilestone from '../components/JourneyMilestone.jsx'

const features = [
  { icon: Star, iconColor: 'text-teal', title: 'Earn XP', description: 'Complete habits and earn experience points to grow stronger.' },
  { icon: Flame, iconColor: 'text-orange-400', title: 'Build streaks', description: 'Stay consistent and keep your streak alive every day.' },
  { icon: TrendingUp, iconColor: 'text-purple', title: 'Level up', description: 'Gain XP and advance to new levels with bigger rewards.' },
  { icon: Trophy, iconColor: 'text-gold', title: 'Achievements', description: 'Unlock badges and celebrate your milestones.' },
  { icon: BarChart3, iconColor: 'text-blue-400', title: 'Track progress', description: 'Visualize your journey with beautiful stats and insights.' },
  { icon: Bot, iconColor: 'text-teal', title: 'AI motivation', description: 'Get smart habit suggestions and daily motivational boosts.' },
]

const week = [
  { day: 'M', done: true },
  { day: 'T', done: true },
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: true },
  { day: 'S', done: true },
  { day: 'S', done: false },
]

export default function Features() {
  return (
    <div className="max-w-5xl">
      <div className="bg-surface border border-border rounded-2xl p-8 mb-6 flex items-center justify-between">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-teal leading-tight">Level up your daily life</h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Turn your habits into a game. Earn XP, build streaks, unlock achievements and become the best version of yourself.
          </p>
          <button className="mt-5 bg-teal text-bg font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-teal-light transition-colors">
            Get started
          </button>
        </div>
        <div className="bg-surface-light border border-border rounded-xl px-8 py-6">
          <LevelRing level={8} xp={680} xpCap={1000} size={80} showLabel />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-base font-semibold">Keep your streak alive</p>
            <p className="text-xs text-gray-500 mt-0.5">Consistency is your superpower.</p>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <Flame size={22} />
            <span className="text-xl font-bold">12</span>
            <span className="text-sm text-gray-400">days</span>
          </div>
        </div>
        <div className="flex justify-between max-w-md">
          {week.map((d, i) => (
            <StreakDay key={i} day={d.day} done={d.done} />
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <p className="text-base font-semibold mb-5">Your journey</p>
        <div className="flex items-center justify-between max-w-lg">
          <JourneyMilestone level={1} title="Beginner" description="Start your habit journey" active />
          <div className="flex-1 h-px border-t border-dashed border-border mx-2" />
          <JourneyMilestone level={5} title="Explorer" description="Build consistency and earn XP" active />
          <div className="flex-1 h-px border-t border-dashed border-border mx-2" />
          <JourneyMilestone level={10} title="Master" description="Achieve greatness, unlock everything" />
        </div>
      </div>
    </div>
  )
}
