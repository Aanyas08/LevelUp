export default function LevelRing({ level, xp, xpCap, size = 64, showLabel = false }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(xp / xpCap, 1)
  const offset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#232838"
          strokeWidth="5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2DD8C8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize={size * 0.28}
          fontWeight="600"
        >
          L{level}
        </text>
      </svg>
      {showLabel && (
        <div className="text-center">
          <p className="text-xl font-semibold">{xp} XP</p>
          <p className="text-xs text-gray-400">to next level</p>
        </div>
      )}
    </div>
  )
}
