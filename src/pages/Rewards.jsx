import { Gift, Palette, Sticker, Crown, Coins } from 'lucide-react'
import { useGame } from '../game/GameContext.jsx'

const rewards = [
  { title: 'New avatar frame', cost: 200, icon: Palette, owned: true },
  { title: 'Habit sticker pack', cost: 350, icon: Sticker, owned: false },
  { title: 'Dark gold theme', cost: 500, icon: Crown, owned: false },
  { title: 'Streak freeze x1', cost: 150, icon: Gift, owned: true },
]

export default function Rewards() {
  const { player } = useGame()

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Rewards</h1>
        <span className="flex items-center gap-1.5 text-gold font-semibold text-sm">
          <Coins size={16} />
          {player.coins}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-6">Spend coins earned from completing quests on perks and cosmetics.</p>

      <div className="grid grid-cols-2 gap-4">
        {rewards.map((r) => (
          <div key={r.title} className="bg-surface border border-border rounded-xl px-5 py-4 flex items-center gap-4">
            <span className="w-11 h-11 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0">
              <r.icon size={19} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.cost} coins</p>
            </div>
            <button
              disabled={r.owned}
              className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                r.owned
                  ? 'bg-surface-light text-gray-500'
                  : 'bg-teal text-bg hover:bg-teal-light'
              }`}
            >
              {r.owned ? 'Owned' : 'Redeem'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
