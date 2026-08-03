import { Link } from "@/i18n/routing";
import SafeImage from "@/components/SafeImage";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AdBanner from "@/components/AdBanner";
import { getAdSlotContent } from "@/lib/adSlots";
import BundleCard from "@/components/BundleCard";
import PromoSlider from "@/components/home/PromoSlider";
import StatsSection from "@/components/home/StatsSection";
import BlogSection from "@/components/home/BlogSection";
import { getHomeFallbackData } from "@/lib/mockHomeData";
import DynamicHomeRenderer from "@/components/home/DynamicHomeRenderer";
import HeroSlider from "@/components/home/HeroSlider";
import Icon from "@/components/ui/Icon";
import SideBanner from "@/components/Banners/SideBanner";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const now = new Date();
  try {
    const [categories, premiumListings, homepageAd, latestProducts, bundles, blogPosts] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        take: 10,
      }),
      prisma.listing.findMany({
        where: { tier: { not: "STANDARD" }, OR: [{ endDate: null }, { endDate: { gt: now } }] },
        orderBy: [{ tier: "desc" }, { createdAt: "desc" }],
        take: 8,
        include: { product: { include: { images: { take: 1 }, category: true, store: { select: { name: true, slug: true } } } } },
      }),
      getAdSlotContent("HOMEPAGE_TOP"),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { images: { take: 1 }, category: true, seller: { select: { fullName: true } }, store: { select: { name: true, slug: true, isVerified: true } } },
      }),
      prisma.bundle.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: {
          items: { include: { product: { include: { images: { take: 1 } } } } },
          seller: { select: { fullName: true } },
        },
      }).then((raw) =>
        raw
          .map((b) => {
            const subtotal = b.items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
            const discount = b.discountType === "PERCENTAGE" ? (subtotal * Number(b.discountValue)) / 100 : Number(b.discountValue);
            return { ...b, subtotal, finalPrice: Math.max(subtotal - discount, 0) };
          })
          .filter((b) => b.items.length >= 2)
      ),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { author: { select: { fullName: true } } },
      }),
    ]);
    const serializeProduct = (p) => ({
      ...p,
      price: p.price ? p.price.toString() : null,
      wholesalePrice: p.wholesalePrice ? p.wholesalePrice.toString() : null,
    });

    return { 
      categories, 
      premiumListings: premiumListings.map(l => ({
        ...l,
        product: l.product ? serializeProduct(l.product) : null
      })), 
      homepageAd, 
      latestProducts: latestProducts.map(serializeProduct), 
      bundles: bundles.map(b => ({
        ...b,
        discountValue: b.discountValue ? b.discountValue.toString() : null,
        items: b.items.map(item => ({
          ...item,
          product: item.product ? serializeProduct(item.product) : null
        }))
      })), 
      blogPosts 
    };
  } catch (error) {
    console.warn("Falling back to mock home data:", error.message);
    return getHomeFallbackData();
  }
}

const CATEGORY_ICONS = {
  "bitki-muhafize": "bug",
  "gubreler": "sprout",
  "toxum-ting": "leaf",
  "aqrotexnika": "tractor",
};

const CATEGORY_THEMES = {
  heyvandarliq: { bg: "from-amber-50 to-orange-50/30 hover:from-amber-100/70 hover:to-orange-100/30", border: "border-amber-100 hover:border-amber-200", iconBg: "bg-amber-100 text-amber-700", text: "text-amber-900" },
  qusculuq: { bg: "from-orange-50 to-red-50/30 hover:from-orange-100/70 hover:to-red-100/30", border: "border-orange-100 hover:border-orange-200", iconBg: "bg-orange-100 text-orange-700", text: "text-orange-900" },
  texnika: { bg: "from-blue-50 to-indigo-50/30 hover:from-blue-100/70 hover:to-indigo-100/30", border: "border-blue-100 hover:border-blue-200", iconBg: "bg-blue-100 text-blue-700", text: "text-blue-900" },
  taxil: { bg: "from-yellow-50 to-amber-50/30 hover:from-yellow-100/70 hover:to-amber-100/30", border: "border-yellow-100 hover:border-yellow-200", iconBg: "bg-yellow-100 text-yellow-700", text: "text-yellow-900" },
  gubre: { bg: "from-emerald-50 to-teal-50/30 hover:from-emerald-100/70 hover:to-teal-100/30", border: "border-emerald-100 hover:border-emerald-200", iconBg: "bg-emerald-100 text-emerald-700", text: "text-emerald-900" },
  toxum: { bg: "from-green-50 to-emerald-50/30 hover:from-green-100/70 hover:to-emerald-100/30", border: "border-green-100 hover:border-green-200", iconBg: "bg-green-100 text-green-700", text: "text-green-900" },
  ariculiq: { bg: "from-yellow-50 to-orange-50/30 hover:from-yellow-100/70 hover:to-orange-100/30", border: "border-yellow-100 hover:border-yellow-200", iconBg: "bg-yellow-100 text-yellow-800", text: "text-yellow-900" },
  sudculuk: { bg: "from-sky-50 to-blue-50/30 hover:from-sky-100/70 hover:to-blue-100/30", border: "border-sky-100 hover:border-sky-200", iconBg: "bg-sky-100 text-sky-700", text: "text-sky-900" },
  meyvə: { bg: "from-rose-50 to-red-50/30 hover:from-rose-100/70 hover:to-red-100/30", border: "border-rose-100 hover:border-rose-200", iconBg: "bg-rose-100 text-rose-700", text: "text-rose-900" },
  tərəvəz: { bg: "from-green-50 to-lime-50/30 hover:from-green-100/70 hover:to-lime-100/30", border: "border-green-100 hover:border-green-200", iconBg: "bg-green-100 text-green-700", text: "text-green-900" },
};

const DEFAULT_THEME = { bg: "from-gray-50 to-slate-50/30 hover:from-gray-100/70 hover:to-slate-100/30", border: "border-gray-100 hover:border-gray-200", iconBg: "bg-gray-100 text-gray-700", text: "text-gray-900" };

export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const editMode = resolvedSearchParams?.editMode === "true";
  
  let homeData = { categories:[], premiumListings:[], homepageAd:null, latestProducts:[], bundles:[], blogPosts:[] };
  let blocks = [];
  
  try { 
    homeData = await getHomeData(); 
    blocks = await prisma.dynamicBlock.findMany({
      where: { page: "home", isActive: true },
      orderBy: { sortOrder: "asc" }
    });
  } catch(e) { 
    console.error("Fetch failed:", e.message); 
  }
  
  const { categories, premiumListings, homepageAd, latestProducts, bundles, blogPosts } = homeData;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FermerMarket",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://fermermarket.az",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fermermarket.az"}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Use defaults if nothing in DB
  if (blocks.length === 0) {
    blocks = [
      { type: "HERO_SLIDER", props: {} },
      { type: "CATEGORIES", props: { title: "Kateqoriyalar", count: 10 } },
      { type: "AD_BANNER", props: {} },
      { type: "PREMIUM_ADS", props: { title: "Premium Elanlar" } },
      { type: "LATEST_ADS", props: { title: "Yeni Elanlar", count: 8 } },
      { type: "BUNDLES", props: { title: "Bağlamalar" } },
      { type: "BLOG", props: {} }
    ];
  }

  return (
    <div className="bg-[#F8FAFC]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[1600px] mx-auto flex gap-6 pt-6 px-4">
        <SideBanner position="left" />
        <div className="flex-1 min-w-0">
          <DynamicHomeRenderer initialBlocks={blocks} homeData={homeData} editMode={editMode} />
        </div>
        <SideBanner position="right" />
      </div>
    </div>
  );
}
