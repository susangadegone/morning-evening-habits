'use client'

interface Props {
  id: string
  name: string
  completed: boolean
  period: 'MORNING' | 'EVENING'
  onToggle: (id: string, completed: boolean) => void
}

const checkStyles = {
  MORNING: {
    checked: 'bg-amber-500 border-amber-500',
    unchecked: 'border-gray-300 bg-white',
  },
  EVENING: {
    checked: 'bg-indigo-500 border-indigo-500',
    unchecked: 'border-gray-300 bg-white',
  },
}

export function HabitCard({ id, name, completed, period, onToggle }: Props) {
  const styles = checkStyles[period]

  return (
    <button
      onClick={() => onToggle(id, !completed)}
      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-black/5 transition-colors text-left"
    >
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          completed ? styles.checked : styles.unchecked
        }`}
      >
        {completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span
        className={`text-sm font-medium transition-all duration-200 ${
          completed ? 'line-through text-gray-400' : 'text-gray-700'
        }`}
      >
        {name}
      </span>
    </button>
  )
}
