-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "financeSpaceId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "category" TEXT NOT NULL,
    "comment" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_financeSpaceId_date_idx" ON "Transaction"("financeSpaceId", "date");

-- CreateIndex
CREATE INDEX "Transaction_financeSpaceId_type_idx" ON "Transaction"("financeSpaceId", "type");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_financeSpaceId_fkey" FOREIGN KEY ("financeSpaceId") REFERENCES "FinanceSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
