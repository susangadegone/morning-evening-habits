import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const habits = await prisma.habit.findMany({
    where: { active: true },
    orderBy: [{ period: 'asc' }, { sortOrder: 'asc' }],
  })
  return NextResponse.json(habits)
}

export async function POST(request: Request) {
  const { name, period, sortOrder } = await request.json()
  const habit = await prisma.habit.create({
    data: { name, period, sortOrder: sortOrder ?? 0 },
  })
  return NextResponse.json(habit)
}
