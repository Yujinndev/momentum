/*
  Warnings:

  - You are about to drop the column `trackBy` on the `Budget` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BudgetMethod" AS ENUM ('ThreeBucket', 'CategoryBased');

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "trackBy";

-- DropEnum
DROP TYPE "BudgetTracking";

-- CreateTable
CREATE TABLE "BudgetPreference" (
    "id" SERIAL NOT NULL,
    "method" "BudgetMethod" NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "userId" TEXT NOT NULL,

    CONSTRAINT "BudgetPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BudgetPreference_id_idx" ON "BudgetPreference"("id");

-- CreateIndex
CREATE INDEX "BudgetPreference_method_idx" ON "BudgetPreference"("method");

-- CreateIndex
CREATE INDEX "BudgetPreference_createdAt_idx" ON "BudgetPreference"("createdAt");

-- CreateIndex
CREATE INDEX "BudgetPreference_updatedAt_idx" ON "BudgetPreference"("updatedAt");

-- CreateIndex
CREATE INDEX "Budget_id_idx" ON "Budget"("id");

-- AddForeignKey
ALTER TABLE "BudgetPreference" ADD CONSTRAINT "BudgetPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
