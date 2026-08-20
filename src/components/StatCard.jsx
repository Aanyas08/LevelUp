export default function StatCard({ icon: Icon, iconColor, value, label }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-4 flex items-center gap-3">
      <Icon size={20} className={iconColor} />
      <div>
        <p className="text-lg font-semibold leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  )
}
