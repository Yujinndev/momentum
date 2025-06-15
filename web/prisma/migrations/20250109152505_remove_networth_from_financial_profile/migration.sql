/*
  Warnings:

  - You are about to drop the column `netWorth` on the `FinancialProfile` table. All the data in the column will be lost.
  - The `color` column on the `Wallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BLACK', 'WHITE', 'GREEN', 'RED', 'ORANGE', 'BLUE', 'PURPLE');

-- AlterTable
ALTER TABLE "FinancialProfile" DROP COLUMN "netWorth";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "color",
ADD COLUMN     "color" "Color" NOT NULL DEFAULT 'BLACK';

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" "Color" NOT NULL DEFAULT 'BLACK',
    "financialProfileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_financialProfileId_fkey" FOREIGN KEY ("financialProfileId") REFERENCES "FinancialProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
