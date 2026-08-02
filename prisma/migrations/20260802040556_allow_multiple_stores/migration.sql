-- DropIndex: Drop unique constraint on Store.ownerId
DROP INDEX IF EXISTS "Store_ownerId_key";

-- AlterTable: Add storeId column to User table
ALTER TABLE "User" ADD COLUMN "storeId" TEXT;

-- AddForeignKey: User.storeId → Store.id
ALTER TABLE "User" ADD CONSTRAINT "User_storeId_fkey"
  FOREIGN KEY ("storeId") REFERENCES "Store"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
