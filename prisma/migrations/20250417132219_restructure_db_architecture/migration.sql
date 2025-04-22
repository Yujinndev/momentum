/*
  Warnings:

  - The values [YEARLY] on the enum `RecurringPeriod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `financialProfileId` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `financialProfileId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the column `financialProfileId` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `financialProfileId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `financialProfileId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `FinancialProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total_amount` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SavingsGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SavingsGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `categoryId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BudgetTracking" AS ENUM ('ALL', 'CATEGORY');

-- AlterEnum
BEGIN;
CREATE TYPE "RecurringPeriod_new" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY');
ALTER TABLE "Budget" ALTER COLUMN "recurringPeriod" TYPE "RecurringPeriod_new" USING ("recurringPeriod"::text::"RecurringPeriod_new");
ALTER TYPE "RecurringPeriod" RENAME TO "RecurringPeriod_old";
ALTER TYPE "RecurringPeriod_new" RENAME TO "RecurringPeriod";
DROP TYPE "RecurringPeriod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_financialProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_financialProfileId_fkey";

-- DropForeignKey
ALTER TABLE "FinancialProfile" DROP CONSTRAINT "FinancialProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavingsGoal" DROP CONSTRAINT "SavingsGoal_financialProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_financialProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_savingsGoalId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_financialProfileId_fkey";

-- DropIndex
DROP INDEX "Budget_financialProfileId_idx";

-- DropIndex
DROP INDEX "SavingsGoal_financialProfileId_idx";

-- DropIndex
DROP INDEX "Transaction_budgetId_idx";

-- DropIndex
DROP INDEX "Transaction_financialProfileId_idx";

-- DropIndex
DROP INDEX "Transaction_savingsGoalId_idx";

-- DropIndex
DROP INDEX "Wallet_financialProfileId_idx";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "amount",
DROP COLUMN "financialProfileId",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "percentage" DOUBLE PRECISION,
ADD COLUMN     "total_amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "trackBy" "BudgetTracking" NOT NULL DEFAULT 'CATEGORY',
ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "financialProfileId",
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "SavingsGoal" DROP COLUMN "dueDate",
DROP COLUMN "financialProfileId",
DROP COLUMN "priority",
DROP COLUMN "status",
DROP COLUMN "title",
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "endDate" TIMESTAMPTZ(6),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "walletId" TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "date",
DROP COLUMN "financialProfileId",
DROP COLUMN "status",
ADD COLUMN     "transactionDate" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "amount" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "walletRunningBalance" DROP DEFAULT,
ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "financialProfileId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "balance" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "FinancialProfile";

-- DropEnum
DROP TYPE "GoalPriority";

-- DropEnum
DROP TYPE "GoalStatus";

-- DropEnum
DROP TYPE "TransactionStatus";

-- CreateIndex
CREATE INDEX "Account_createdAt_idx" ON "Account"("createdAt");

-- CreateIndex
CREATE INDEX "Account_updatedAt_idx" ON "Account"("updatedAt");

-- CreateIndex
CREATE INDEX "Account_deletedAt_idx" ON "Account"("deletedAt");

-- CreateIndex
CREATE INDEX "Budget_name_idx" ON "Budget"("name");

-- CreateIndex
CREATE INDEX "Budget_createdAt_idx" ON "Budget"("createdAt");

-- CreateIndex
CREATE INDEX "Budget_updatedAt_idx" ON "Budget"("updatedAt");

-- CreateIndex
CREATE INDEX "Budget_deletedAt_idx" ON "Budget"("deletedAt");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_createdAt_idx" ON "Category"("createdAt");

-- CreateIndex
CREATE INDEX "Category_updatedAt_idx" ON "Category"("updatedAt");

-- CreateIndex
CREATE INDEX "Category_deletedAt_idx" ON "Category"("deletedAt");

-- CreateIndex
CREATE INDEX "SavingsGoal_name_idx" ON "SavingsGoal"("name");

-- CreateIndex
CREATE INDEX "SavingsGoal_description_idx" ON "SavingsGoal"("description");

-- CreateIndex
CREATE INDEX "SavingsGoal_createdAt_idx" ON "SavingsGoal"("createdAt");

-- CreateIndex
CREATE INDEX "SavingsGoal_updatedAt_idx" ON "SavingsGoal"("updatedAt");

-- CreateIndex
CREATE INDEX "SavingsGoal_deletedAt_idx" ON "SavingsGoal"("deletedAt");

-- CreateIndex
CREATE INDEX "Session_createdAt_idx" ON "Session"("createdAt");

-- CreateIndex
CREATE INDEX "Session_updatedAt_idx" ON "Session"("updatedAt");

-- CreateIndex
CREATE INDEX "Session_deletedAt_idx" ON "Session"("deletedAt");

-- CreateIndex
CREATE INDEX "Transaction_description_idx" ON "Transaction"("description");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_updatedAt_idx" ON "Transaction"("updatedAt");

-- CreateIndex
CREATE INDEX "Transaction_deletedAt_idx" ON "Transaction"("deletedAt");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_updatedAt_idx" ON "User"("updatedAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "Wallet_name_idx" ON "Wallet"("name");

-- CreateIndex
CREATE INDEX "Wallet_description_idx" ON "Wallet"("description");

-- CreateIndex
CREATE INDEX "Wallet_createdAt_idx" ON "Wallet"("createdAt");

-- CreateIndex
CREATE INDEX "Wallet_updatedAt_idx" ON "Wallet"("updatedAt");

-- CreateIndex
CREATE INDEX "Wallet_deletedAt_idx" ON "Wallet"("deletedAt");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_savingsGoalId_fkey" FOREIGN KEY ("savingsGoalId") REFERENCES "SavingsGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsGoal" ADD CONSTRAINT "SavingsGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsGoal" ADD CONSTRAINT "SavingsGoal_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
