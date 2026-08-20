import TierSummary from '../components/TierSummary.jsx'
import AchievementBadge from '../components/AchievementBadge.jsx'

const achievements = [
  { title: '7-day streak', tier: 'bronze', unlocked: true },
  { title: 'Early riser', tier: 'bronze', unlocked: true },
  { title: 'First habit', tier: 'bronze', unlocked: true },
  { title: 'Level 5', tier: 'silver', unlocked: true },
  { title: '50 habits done', tier: 'gold', unlocked: true },
  { title: '30-day streak', tier: 'silver', unlocked: false, hint: '18 / 30 days' },
  { title: 'Level 10', tier: 'gold', unlocked: false, hint: 'level 8 / 10' },
  { title: '200 habits done', tier: 'gold', unlocked: false, hint: '132 / 200' },
  { title: 'Perfect week', tier: 'bronze', unlocked: false, hint: '5 / 7 days' },
  { title: 'Night owl', tier: 'silver', unlocked: false, hint: 'locked' },
]

const unlockedCount = achievements.filter((a) => a.unlocked).length

export default function Achievements() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Achievements</h1>

      <p className="text-gray-400 text-sm mb-6">
        {unlockedCount} of {achievements.length} unlocked &mdash; keep going to earn the rest.
      </p>

      <p className="text-sm font-medium text-gray-300 mb-3">
        Badge case
      </p>

      <TierSummary />

      <p className="text-sm font-medium text-gray-300 mb-4">
        All achievements
      </p>

      <div className="bg-surface border border-border rounded-2xl px-6 py-8">
        <div className="grid grid-cols-5 gap-y-8 gap-x-4">
          {achievements.map((a, i) => (
            <AchievementBadge
              key={a.title}
              title={a.title}
              tier={a.tier}
              unlocked={a.unlocked}
              hint={a.hint}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  )
}