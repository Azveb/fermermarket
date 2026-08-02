-- CreateTable
CREATE TABLE "AdSlot" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'internal',
    "campaignType" TEXT,
    "externalCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdSlot_key_key" ON "AdSlot"("key");
