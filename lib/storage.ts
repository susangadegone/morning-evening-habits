export interface Habit {
  id: string
  name: string
  period: 'MORNING' | 'EVENING'
  sortOrder: number
  active: boolean
}

export interface HabitLog {
  habitId: string
  date: string
  completed: boolean
}

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Wake up by 6:00am', period: 'MORNING', sortOrder: 0, active: true },
  { id: '2', name: 'Drink a glass of water', period: 'MORNING', sortOrder: 1, active: true },
  { id: '3', name: 'Exercise / stretch', period: 'MORNING', sortOrder: 2, active: true },
  { id: '4', name: 'Healthy breakfast', period: 'MORNING', sortOrder: 3, active: true },
  { id: '5', name: 'Review goals for the day', period: 'MORNING', sortOrder: 4, active: true },
  { id: '6', name: 'Stop screens by 9:00pm', period: 'EVENING', sortOrder: 0, active: true },
  { id: '7', name: 'Read', period: 'EVENING', sortOrder: 1, active: true },
  { id: '8', name: 'In bed by 9:30pm', period: 'EVENING', sortOrder: 2, active: true },
  { id: '9', name: 'Reflect on the day', period: 'EVENING', sortOrder: 3, active: true },
]

export function getHabits(): Habit[] {
  const stored = localStorage.getItem('habits')
  if (!stored) {
    localStorage.setItem('habits', JSON.stringify(DEFAULT_HABITS))
    return DEFAULT_HABITS
  }
  return JSON.parse(stored)
}

export function getLogs(): HabitLog[] {
  const stored = localStorage.getItem('logs')
  return stored ? JSON.parse(stored) : []
}

export function upsertLog(habitId: string, date: string, completed: boolean): void {
  const logs = getLogs()
  const idx = logs.findIndex(l => l.habitId === habitId && l.date === date)
  if (idx >= 0) {
    logs[idx].completed = completed
  } else {
    logs.push({ habitId, date, completed })
  }
  localStorage.setItem('logs', JSON.stringify(logs))
}

export function buildDateRange(days: number): string[] {
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    dates.push(`${yyyy}-${mm}-${dd}`)
  }
  return dates
}
