'use client'

import { useEffect, useState } from 'react'
import { HabitChecklist } from '@/components/HabitChecklist'
import { getHabits, getLogs, upsertLog, type Habit, type HabitLog } from '@/lib/storage'

function getToday(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [mounted, setMounted] = useState(false)

  const today = getToday()
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    setHabits(getHabits().filter(h => h.active))
    setLogs(getLogs().filter(l => l.date === today))
    setMounted(true)
  }, [today])

  function toggleHabit(habitId: string, completed: boolean) {
    upsertLog(habitId, today, completed)
    setLogs(getLogs().filter(l => l.date === today))
  }

  if (!mounted) return null

  const morningHabits = habits.filter(h => h.period === 'MORNING')
  const eveningHabits = habits.filter(h => h.period === 'EVENING')
  const totalHabits = habits.length
  const completedCount = logs.filter(l => l.completed).length
  const progressPct = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0

  return (
    <div className="space-y-5">
      {/* Date + progress */}
      <div>
        <p className="text-sm text-gray-500">{dateLabel}</p>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">{completedCount} of {totalHabits} complete</span>
          <span className="font-semibold text-gray-800">{progressPct}%</span>
        </div>
        <div className="mt-1.5 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <HabitChecklist
        title="Morning"
        period="MORNING"
        habits={morningHabits}
        logs={logs}
        onToggle={toggleHabit}
      />

      <HabitChecklist
        title="Evening"
        period="EVENING"
        habits={eveningHabits}
        logs={logs}
        onToggle={toggleHabit}
      />
    </div>
  )
}
