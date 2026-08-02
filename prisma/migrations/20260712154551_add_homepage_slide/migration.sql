-- CreateTable: HomepageSlide
CREATE TABLE "HomepageSlide" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "cta" TEXT NOT NULL DEFAULT 'Bax',
    "href" TEXT NOT NULL,
    "bg" TEXT NOT NULL DEFAULT 'from-brand-700 to-brand-500',
    "emoji" TEXT NOT NULL DEFAULT '🌾',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HomepageSlide_pkey" PRIMARY KEY ("id")
);
