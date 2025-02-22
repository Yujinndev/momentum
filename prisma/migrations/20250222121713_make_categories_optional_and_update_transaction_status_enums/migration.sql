/*
  Warnings:

  - The values [PENDING,FAILED,CANCELLED] on the enum `TransactionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `category` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionStatus_new" AS ENUM ('SCHEDULED', 'COMPLETED');
ALTER TABLE "Transaction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Transaction" ALTER COLUMN "status" TYPE "TransactionStatus_new" USING ("status"::text::"TransactionStatus_new");
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";
ALTER TYPE "TransactionStatus_new" RENAME TO "TransactionStatus";
DROP TYPE "TransactionStatus_old";
ALTER TABLE "Transaction" ALTER COLUMN "status" SET DEFAULT 'COMPLETED';
COMMIT;

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "categoryId" DROP NOT NULL;
