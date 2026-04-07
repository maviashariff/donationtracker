export default function ProgressBar({ collected = 0, goal = 1 }) {
  const pct = Math.min(Math.round((collected / goal) * 100), 100)

  const barColor =
    pct >= 100
      ? 'bg-green-500'
      : pct >= 60
      ? 'bg-blue-500'
      : pct >= 30
      ? 'bg-yellow-500'
      : 'bg-red-400'

  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-1.5">
        <span className="font-bold text-gray-800">
          ₹{collected?.toLocaleString('en-IN')}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            pct >= 100
              ? 'bg-green-100 text-green-700'
              : pct >= 60
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {pct}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`${barColor} h-2.5 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        Goal: ₹{goal?.toLocaleString('en-IN')}
      </p>
    </div>
  )
}
