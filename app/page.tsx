'use client'

import { useEffect, useState } from 'react'
import { HabitChecklist } from '@/components/HabitChecklist'

interface Habit {
  id: string
  name: string
  period: string
  sortOrder: number
}

interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
}

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
  const [loading, setLoading] = useState(true)

  const today = getToday()
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    async function load() {
      const [habitsRes, logsRes] = await Promise.all([
        fetch('/api/habits'),
        fetch(`/api/logs?date=${today}`),
      ])
      setHabits(await habitsRes.json())
      setLogs(await logsRes.json())
      setLoading(false)
    }
    load()
  }, [today])

  async function toggleHabit(habitId: string, completed: boolean) {
    const updated: HabitLog = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId, date: today, completed }),
    }).then(r => r.json())

    setLogs(prev => {
      const exists = prev.find(l => l.habitId === habitId)
      if (exists) return prev.map(l => l.habitId === habitId ? { ...l, completed } : l)
      return [...prev, updated]
    })
  }

  const morningHabits = habits.filter(h => h.period === 'MORNING')
  const eveningHabits = habits.filter(h => h.period === 'EVENING')
  const totalHabits = habits.length
  const completedCount = logs.filter(l => l.completed).length
  const progressPct = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0

  if (loading) {
    return <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
  }

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

      {/* Morning habits */}
      <HabitChecklist
        title="Morning"
        period="MORNING"
        habits={morningHabits}
        logs={logs}
        onToggle={toggleHabit}
      />

      {/* Evening habits */}
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
