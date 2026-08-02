-- Add isApproved to Review (admin moderation before public display)
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- Add isCorporate + minOrderQty to Product (bulk/wholesale listings)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "isCorporate" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "minOrderQty" INTEGER;
