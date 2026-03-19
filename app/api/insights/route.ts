import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') ?? '14')

  // Build date range using local timezone
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    dates.push(`${yyyy}-${mm}-${dd}`)
  }

  const habits = await prisma.habit.findMany({ where: { active: true } })
  const logs = await prisma.habitLog.findMany({
    where: { date: { in: dates }, completed: true },
  })

  const morningHabits = habits.filter(h => h.period === 'MORNING')
  const eveningHabits = habits.filter(h => h.period === 'EVENING')

  // Daily completion rates
  const daily = dates.map(date => {
    const dayLogs = logs.filter(l => l.date === date)
    const morningDone = dayLogs.filter(l => morningHabits.some(h => h.id === l.habitId)).length
    const eveningDone = dayLogs.filter(l => eveningHabits.some(h => h.id === l.habitId)).length
    return {
      date,
      morningRate: morningHabits.length > 0 ? Math.round((morningDone / morningHabits.length) * 100) : 0,
      eveningRate: eveningHabits.length > 0 ? Math.round((eveningDone / eveningHabits.length) * 100) : 0,
    }
  })

  // Current streak per habit (consecutive days ending today)
  const streaks = habits.map(habit => {
    let streak = 0
    for (let i = dates.length - 1; i >= 0; i--) {
      const done = logs.some(l => l.habitId === habit.id && l.date === dates[i])
      if (done) streak++
      else break
    }
    return { habitId: habit.id, name: habit.name, period: habit.period, streak }
  })

  return NextResponse.json({ daily, streaks })
}
