/*
  Warnings:

  - A unique constraint covering the columns `[financeId,slug]` on the table `FinanceSpace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FinanceSpace_financeId_name_key";

-- AlterTable
ALTER TABLE "FinanceSpace" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FinanceSpace_financeId_slug_key" ON "FinanceSpace"("financeId", "slug");
