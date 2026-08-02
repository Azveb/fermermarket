-- ActiveIngredient (Aktiv Maddə)
CREATE TABLE IF NOT EXISTS "ActiveIngredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAz" TEXT NOT NULL,
    "cas" TEXT,
    "group" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActiveIngredient_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ActiveIngredient_name_key" ON "ActiveIngredient"("name");

-- ProductActiveIngredient (many-to-many)
CREATE TABLE IF NOT EXISTS "ProductActiveIngredient" (
    "productId" TEXT NOT NULL,
    "activeIngredientId" TEXT NOT NULL,
    "concentration" TEXT,
    CONSTRAINT "ProductActiveIngredient_pkey" PRIMARY KEY ("productId","activeIngredientId")
);

-- Disease (Xəstəlik)
CREATE TABLE IF NOT EXISTS "Disease" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAz" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "images" TEXT[],
    "affectedCrops" TEXT[],
    "symptoms" TEXT,
    "causes" TEXT,
    "prevention" TEXT,
    "treatment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Disease_slug_key" ON "Disease"("slug");

-- Pest (Zərərverici)
CREATE TABLE IF NOT EXISTS "Pest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAz" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "images" TEXT[],
    "affectedCrops" TEXT[],
    "symptoms" TEXT,
    "lifecycle" TEXT,
    "prevention" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pest_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Pest_slug_key" ON "Pest"("slug");

-- Crop (Bitki)
CREATE TABLE IF NOT EXISTS "Crop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAz" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Crop_slug_key" ON "Crop"("slug");

-- ProductDisease (many-to-many)
CREATE TABLE IF NOT EXISTS "ProductDisease" (
    "productId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    CONSTRAINT "ProductDisease_pkey" PRIMARY KEY ("productId","diseaseId")
);

-- ProductPest (many-to-many)
CREATE TABLE IF NOT EXISTS "ProductPest" (
    "productId" TEXT NOT NULL,
    "pestId" TEXT NOT NULL,
    CONSTRAINT "ProductPest_pkey" PRIMARY KEY ("productId","pestId")
);

-- ProductCrop (many-to-many)
CREATE TABLE IF NOT EXISTS "ProductCrop" (
    "productId" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    CONSTRAINT "ProductCrop_pkey" PRIMARY KEY ("productId","cropId")
);

-- CalculatorSession
CREATE TABLE IF NOT EXISTS "CalculatorSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "productId" TEXT,
    "area" DOUBLE PRECISION NOT NULL,
    "areaUnit" TEXT NOT NULL,
    "useNorm" DOUBLE PRECISION NOT NULL,
    "waterNorm" DOUBLE PRECISION NOT NULL,
    "applications" INTEGER NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalculatorSession_pkey" PRIMARY KEY ("id")
);

-- FarmerProfile
CREATE TABLE IF NOT EXISTS "FarmerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "region" TEXT,
    "village" TEXT,
    "totalArea" DOUBLE PRECISION,
    "crops" TEXT[],
    "greenhouse" DOUBLE PRECISION,
    "garden" DOUBLE PRECISION,
    "irrigationType" TEXT,
    "soilAnalysis" JSONB,
    "previousProducts" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FarmerProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "FarmerProfile_userId_key" ON "FarmerProfile"("userId");

-- ComparisonSession
CREATE TABLE IF NOT EXISTS "ComparisonSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "productIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComparisonSession_pkey" PRIMARY KEY ("id")
);

-- SalesPoint
CREATE TABLE IF NOT EXISTS "SalesPoint" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "phone" TEXT,
    "workHours" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "SalesPoint_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "ProductActiveIngredient" ADD CONSTRAINT "ProductActiveIngredient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductActiveIngredient" ADD CONSTRAINT "ProductActiveIngredient_activeIngredientId_fkey" FOREIGN KEY ("activeIngredientId") REFERENCES "ActiveIngredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductDisease" ADD CONSTRAINT "ProductDisease_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductDisease" ADD CONSTRAINT "ProductDisease_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductPest" ADD CONSTRAINT "ProductPest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductPest" ADD CONSTRAINT "ProductPest_pestId_fkey" FOREIGN KEY ("pestId") REFERENCES "Pest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductCrop" ADD CONSTRAINT "ProductCrop_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductCrop" ADD CONSTRAINT "ProductCrop_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SalesPoint" ADD CONSTRAINT "SalesPoint_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
