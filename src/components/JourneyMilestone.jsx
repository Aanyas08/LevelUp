export default function JourneyMilestone({ level, title, description, active }) {
  return (
    <div className="flex flex-col items-center text-center w-32">
      <div
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold mb-2 ${
          active ? 'border-teal text-teal' : 'border-border text-gray-500'
        }`}
      >
        L{level}
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500 mt-1 leading-snug">{description}</p>
    </div>
  )
}
