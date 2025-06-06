/*
  Warnings:

  - Added the required column `method` to the `SavingsGoal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GoalMethod" AS ENUM ('Flexible', 'Recurring');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'COMPLETED', 'AUTO_COMPLETED', 'SKIPPED');

-- AlterTable
ALTER TABLE "SavingsGoal" ADD COLUMN     "method" "GoalMethod" NOT NULL;

-- CreateTable
CREATE TABLE "SavingContribution" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),
    "goalId" TEXT NOT NULL,

    CONSTRAINT "SavingContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingSchedule" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMPTZ(6) NOT NULL,
    "autoCredit" BOOLEAN NOT NULL,
    "creditingDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "goalId" TEXT NOT NULL,

    CONSTRAINT "SavingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavingContribution_id_idx" ON "SavingContribution"("id");

-- CreateIndex
CREATE INDEX "SavingContribution_goalId_idx" ON "SavingContribution"("goalId");

-- CreateIndex
CREATE INDEX "SavingContribution_createdAt_idx" ON "SavingContribution"("createdAt");

-- CreateIndex
CREATE INDEX "SavingContribution_updatedAt_idx" ON "SavingContribution"("updatedAt");

-- CreateIndex
CREATE INDEX "SavingContribution_deletedAt_idx" ON "SavingContribution"("deletedAt");

-- CreateIndex
CREATE INDEX "SavingSchedule_id_idx" ON "SavingSchedule"("id");

-- CreateIndex
CREATE INDEX "SavingSchedule_goalId_idx" ON "SavingSchedule"("goalId");

-- CreateIndex
CREATE INDEX "SavingSchedule_dueDate_idx" ON "SavingSchedule"("dueDate");

-- CreateIndex
CREATE INDEX "SavingSchedule_status_idx" ON "SavingSchedule"("status");

-- CreateIndex
CREATE INDEX "SavingSchedule_creditingDate_idx" ON "SavingSchedule"("creditingDate");

-- CreateIndex
CREATE INDEX "SavingSchedule_completedAt_idx" ON "SavingSchedule"("completedAt");

-- AddForeignKey
ALTER TABLE "SavingContribution" ADD CONSTRAINT "SavingContribution_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "SavingsGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSchedule" ADD CONSTRAINT "SavingSchedule_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "SavingsGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
