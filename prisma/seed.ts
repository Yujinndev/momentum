import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.category.createMany({
    data: [
      { name: 'Income' },
      { name: 'Transfer' },
      { name: 'Savings' },
      { name: 'Payments' },
      { name: 'Health' },
      { name: 'Groceries' },
      { name: 'Utilities' },
      { name: 'Transportation' },
      { name: 'Education' },
      { name: 'Miscellaneous' },
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
