export default function FeatureCard({ icon: Icon, iconColor, title, description }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-5 py-6 hover:border-teal/30 transition-colors">
      <Icon size={26} className={iconColor} />
      <p className="text-base font-semibold mt-3">{title}</p>
      <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{description}</p>
    </div>
  )
}
