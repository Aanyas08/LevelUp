import { Check, Plus } from 'lucide-react'

export default function StreakDay({ day, done }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-gray-400">{day}</span>
      <span
        className={`w-9 h-9 rounded-full flex items-center justify-center ${
          done ? 'bg-teal/20 text-teal' : 'bg-surface-light text-gray-500 border border-border'
        }`}
      >
        {done ? <Check size={16} strokeWidth={3} /> : <Plus size={14} />}
      </span>
    </div>
  )
}
