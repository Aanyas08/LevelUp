const tiers = [
  { key: 'bronze', label: 'Bronze', unlocked: 3, total: 10, from: '#F0997B', to: '#993C1D' },
  { key: 'silver', label: 'Silver', unlocked: 2, total: 10, from: '#F1EFE8', to: '#8A8880' },
  { key: 'gold', label: 'Gold', unlocked: 1, total: 10, from: '#FAC775', to: '#8A5A0B' },
]

export default function TierSummary() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {tiers.map((t, i) => {
        const pct = Math.round((t.unlocked / t.total) * 100)
        return (
          <div
            key={t.key}
            className="badge-pop bg-surface border border-border rounded-xl px-4 py-4"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-8 h-8 rounded-full shrink-0"
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
              />
              <div>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs text-gray-500">{t.unlocked} / {t.total} unlocked</p>
              </div>
            </div>
            <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${t.from}, ${t.to})` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}