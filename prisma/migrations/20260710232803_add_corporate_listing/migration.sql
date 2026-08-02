-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isCorporate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minOrderQty" INTEGER;
