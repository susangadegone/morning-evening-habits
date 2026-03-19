'use client'

import { useEffect, useState } from 'react'
import { InsightsCharts } from '@/components/InsightsCharts'
import { getHabits, getLogs, buildDateRange } from '@/lib/storage'

interface DailyData {
  date: string
  morningRate: number
  eveningRate: number
}

interface StreakData {
  habitId: string
  name: string
  period: string
  streak: number
}

export default function InsightsPage() {
  const [daily, setDaily] = useState<DailyData[]>([])
  const [streaks, setStreaks] = useState<StreakData[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const habits = getHabits().filter(h => h.active)
    const allLogs = getLogs()
    const dates = buildDateRange(14)

    const morningHabits = habits.filter(h => h.period === 'MORNING')
    const eveningHabits = habits.filter(h => h.period === 'EVENING')

    const dailyData: DailyData[] = dates.map(date => {
      const dayLogs = allLogs.filter(l => l.date === date && l.completed)
      const morningDone = dayLogs.filter(l => morningHabits.some(h => h.id === l.habitId)).length
      const eveningDone = dayLogs.filter(l => eveningHabits.some(h => h.id === l.habitId)).length
      return {
        date,
        morningRate: morningHabits.length > 0 ? Math.round((morningDone / morningHabits.length) * 100) : 0,
        eveningRate: eveningHabits.length > 0 ? Math.round((eveningDone / eveningHabits.length) * 100) : 0,
      }
    })

    const streakData: StreakData[] = habits.map(habit => {
      let streak = 0
      for (let i = dates.length - 1; i >= 0; i--) {
        const done = allLogs.some(l => l.habitId === habit.id && l.date === dates[i] && l.completed)
        if (done) streak++
        else break
      }
      return { habitId: habit.id, name: habit.name, period: habit.period, streak }
    })

    setDaily(dailyData)
    setStreaks(streakData)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const morningStreaks = streaks.filter(s => s.period === 'MORNING')
  const eveningStreaks = streaks.filter(s => s.period === 'EVENING')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Completion Rate — Last 14 Days</h2>
        <p className="text-sm text-gray-500 mt-0.5">Morning vs Evening habits</p>
        <div className="mt-4">
          <InsightsCharts daily={daily} />
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Current Streaks</h2>

        {morningStreaks.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2 px-1">Morning</p>
            <div className="space-y-2">
              {morningStreaks.sort((a, b) => b.streak - a.streak).map(s => (
                <StreakRow key={s.habitId} name={s.name} streak={s.streak} color="amber" />
              ))}
            </div>
          </div>
        )}

        {eveningStreaks.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2 px-1">Evening</p>
            <div className="space-y-2">
              {eveningStreaks.sort((a, b) => b.streak - a.streak).map(s => (
                <StreakRow key={s.habitId} name={s.name} streak={s.streak} color="indigo" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StreakRow({ name, streak, color }: { name: string; streak: number; color: 'amber' | 'indigo' }) {
  const streakColor = streak > 0
    ? color === 'amber' ? 'text-amber-600' : 'text-indigo-600'
    : 'text-gray-300'

  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100">
      <span className="text-sm font-medium text-gray-800">{name}</span>
      <div className="text-right">
        <span className={`text-xl font-bold ${streakColor}`}>{streak}</span>
        <span className="text-xs text-gray-400 ml-1">days</span>
      </div>
    </div>
  )
}
