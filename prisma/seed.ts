import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.habit.count()
  if (count > 0) {
    console.log('Habits already seeded, skipping.')
    return
  }

  await prisma.habit.createMany({
    data: [
      { name: 'Wake up by 6:00am', period: 'MORNING', sortOrder: 0 },
      { name: 'Drink a glass of water', period: 'MORNING', sortOrder: 1 },
      { name: 'Exercise / stretch', period: 'MORNING', sortOrder: 2 },
      { name: 'Healthy breakfast', period: 'MORNING', sortOrder: 3 },
      { name: 'Review goals for the day', period: 'MORNING', sortOrder: 4 },
      { name: 'Stop screens by 9:00pm', period: 'EVENING', sortOrder: 0 },
      { name: 'Read', period: 'EVENING', sortOrder: 1 },
      { name: 'In bed by 9:30pm', period: 'EVENING', sortOrder: 2 },
      { name: 'Reflect on the day', period: 'EVENING', sortOrder: 3 },
    ],
  })

  console.log('Seeded 9 default habits.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
