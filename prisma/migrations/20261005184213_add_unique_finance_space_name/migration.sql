/*
  Warnings:

  - A unique constraint covering the columns `[financeId,name]` on the table `FinanceSpace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FinanceSpace_financeId_name_key" ON "FinanceSpace"("financeId", "name");
