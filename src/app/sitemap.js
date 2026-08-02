import { PrismaClient } from '@prisma/client';

export default async function sitemap() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fermermarket.az";
  const prisma = new PrismaClient();

    // Get active products
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });

    // Get active categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    // Get active stores
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const productUrls = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const categoryUrls = categories.map((c) => ({
      url: `${baseUrl}/products?category=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const storeUrls = stores.map((s) => ({
      url: `${baseUrl}/stores/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const staticUrls = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/stores`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];

    return [...staticUrls, ...categoryUrls, ...storeUrls, ...productUrls];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";
