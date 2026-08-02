-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryPartnerId" TEXT;

-- CreateIndex
CREATE INDEX "Order_deliveryPartnerId_idx" ON "Order"("deliveryPartnerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
