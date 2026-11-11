/*
  Warnings:

  - Made the column `slug` on table `FinanceSpace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FinanceSpace" ALTER COLUMN "slug" SET NOT NULL;
