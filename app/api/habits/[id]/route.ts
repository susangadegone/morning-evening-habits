import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const data = await request.json()
  const habit = await prisma.habit.update({ where: { id }, data })
  return NextResponse.json(habit)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.habit.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ success: true })
}
