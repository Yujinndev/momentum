/*
  Warnings:

  - You are about to drop the column `total_amount` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "total_amount",
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL;
