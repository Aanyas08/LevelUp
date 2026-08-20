import { useEffect } from 'react'
import { Sparkles, Coins } from 'lucide-react'
import { xpForLevel } from '../game/xpCurve.js'

export default function LevelUpModal({ event, onClose }) {
  useEffect(() => {
    if (!event) return
    const timer = setTimeout(onClose, 3600)
    return () => clearTimeout(timer)
  }, [event, onClose])

  if (!event) return null

  const nextRequirement = xpForLevel(event.level)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm levelup-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Level up"
    >
      <div
        className="relative levelup-card bg-surface border border-teal/40 rounded-3xl px-10 py-10 flex flex-col items-center text-center max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-3xl levelup-glow pointer-events-none" />

        <div className="relative w-24 h-24 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mb-5 levelup-ring">
          <span className="text-3xl font-extrabold text-teal">L{event.level}</span>
        </div>

        <p className="relative text-xs font-semibold tracking-[0.2em] text-teal uppercase mb-1">
          Level Up
        </p>
        <h2 className="relative text-2xl font-bold mb-1">You reached Level {event.level}</h2>
        <p className="relative text-sm text-gray-400 mb-6">{event.rank}</p>

        <div className="relative flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-gold">
            <Coins size={18} />
            <span className="font-semibold">+{event.bonusCoins}</span>
          </div>
          <div className="flex items-center gap-2 text-purple">
            <Sparkles size={18} />
            <span className="font-semibold">{nextRequirement} XP to Level {event.level + 1}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="relative bg-teal text-bg font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-teal-light transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
