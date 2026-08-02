-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ALTER COLUMN "sellerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
