import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) return NextResponse.json([])

  const logs = await prisma.habitLog.findMany({
    where: { date },
  })
  return NextResponse.json(logs)
}

export async function POST(request: Request) {
  const { habitId, date, completed } = await request.json()
  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date } },
    update: { completed },
    create: { habitId, date, completed },
  })
  return NextResponse.json(log)
}
