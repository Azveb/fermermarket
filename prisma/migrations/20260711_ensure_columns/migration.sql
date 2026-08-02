-- Ensure all columns from previous manual migrations exist on Neon
-- Safe to run multiple times (IF NOT EXISTS)
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "isCorporate" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "minOrderQty" INTEGER;
