import { HabitCard } from './HabitCard'

interface Habit {
  id: string
  name: string
  period: string
  sortOrder: number
}

interface HabitLog {
  habitId: string
  completed: boolean
}

interface Props {
  title: string
  period: 'MORNING' | 'EVENING'
  habits: Habit[]
  logs: HabitLog[]
  onToggle: (habitId: string, completed: boolean) => void
}

const styles = {
  MORNING: {
    section: 'bg-amber-50 border-amber-100',
    title: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-700',
  },
  EVENING: {
    section: 'bg-indigo-50 border-indigo-100',
    title: 'text-indigo-900',
    badge: 'bg-indigo-100 text-indigo-700',
  },
}

export function HabitChecklist({ title, period, habits, logs, onToggle }: Props) {
  const completedCount = habits.filter(h =>
    logs.some(l => l.habitId === h.id && l.completed)
  ).length
  const s = styles[period]

  return (
    <div className={`rounded-2xl border p-4 ${s.section}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-semibold ${s.title}`}>{title}</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.badge}`}>
          {completedCount}/{habits.length}
        </span>
      </div>
      <div className="space-y-0.5">
        {habits.map(habit => {
          const log = logs.find(l => l.habitId === habit.id)
          return (
            <HabitCard
              key={habit.id}
              id={habit.id}
              name={habit.name}
              completed={log?.completed ?? false}
              period={period}
              onToggle={onToggle}
            />
          )
        })}
      </div>
    </div>
  )
}
