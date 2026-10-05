-- CreateTable
CREATE TABLE "FinanceSpace" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceSpace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinanceSpace_financeId_idx" ON "FinanceSpace"("financeId");

-- AddForeignKey
ALTER TABLE "FinanceSpace" ADD CONSTRAINT "FinanceSpace_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "Finance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
