-- Add isBanned field to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- Add REFUND to WalletTxType enum
ALTER TYPE "WalletTxType" ADD VALUE IF NOT EXISTS 'REFUND';
