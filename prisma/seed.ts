import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.category.deleteMany()

  await prisma.category.createMany({
    data: [
      { name: 'Income' },
      { name: 'Transfer' },
      { name: 'Savings' },
      { name: 'Payments' },
      { name: 'Miscellaneous' },
      { name: 'Sinking Funds' },
      { name: 'Medical Expenses' },
      { name: 'Food/Groceries' },
      { name: 'Transportation' },
      { name: 'Utilities' },
      { name: 'Education' },
      { name: 'Shopping' },
      { name: 'Subscriptions' },
      { name: 'Travel/Vacation' },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
