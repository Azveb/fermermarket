-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "ModuleKey" AS ENUM ('WALLET','BLOG','BUNDLES','CORPORATE_LISTINGS','AI_AGRONOM','ANALYTICS','CAMPAIGNS','BULK_CSV','DELIVERY','LEADERBOARD');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateTable UserModule
CREATE TABLE IF NOT EXISTS "UserModule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" "ModuleKey" NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserModule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserModule_userId_module_key" ON "UserModule"("userId", "module");
CREATE INDEX IF NOT EXISTS "UserModule_userId_idx" ON "UserModule"("userId");

-- AddForeignKey
ALTER TABLE "UserModule" ADD CONSTRAINT "UserModule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserModule" ADD CONSTRAINT "UserModule_grantedBy_fkey" FOREIGN KEY ("grantedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
