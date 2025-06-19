/*
  Warnings:

  - Added the required column `userId` to the `SavingContribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SavingSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_savingsGoalId_fkey";

-- AlterTable
ALTER TABLE "SavingContribution" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SavingSchedule" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Budget_userId_idx" ON "Budget"("userId");

-- CreateIndex
CREATE INDEX "BudgetPreference_userId_idx" ON "BudgetPreference"("userId");

-- CreateIndex
CREATE INDEX "Category_id_idx" ON "Category"("id");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE INDEX "SavingContribution_userId_idx" ON "SavingContribution"("userId");

-- CreateIndex
CREATE INDEX "SavingSchedule_userId_idx" ON "SavingSchedule"("userId");

-- CreateIndex
CREATE INDEX "SavingsGoal_id_idx" ON "SavingsGoal"("id");

-- CreateIndex
CREATE INDEX "SavingsGoal_userId_idx" ON "SavingsGoal"("userId");

-- CreateIndex
CREATE INDEX "Transaction_id_idx" ON "Transaction"("id");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "Wallet_id_idx" ON "Wallet"("id");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- AddForeignKey
ALTER TABLE "SavingContribution" ADD CONSTRAINT "SavingContribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSchedule" ADD CONSTRAINT "SavingSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
