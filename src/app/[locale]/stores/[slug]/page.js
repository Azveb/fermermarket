import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const p = await params;
  const store = await prisma.store.findUnique({ where: { slug: p.slug }, select: { name: true, description: true } });
  if (!store) return { title: "Mağaza tapılmadı" };
  return {
    title: `${store.name} | FermerMarket`,
    description: store.description || `${store.name} mağazasının məhsulları`,
  };
}

export default async function StorePage({ params }) {
  const p = await params;
  const store = await prisma.store.findUnique({
    where: { slug: p.slug },
    include: {
      owner: { select: { id: true, fullName: true, createdAt: true } },
      products: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 24,
        include: {
          category: { select: { nameAz: true, slug: true } },
          _count: { select: { reviews: { where: { isApproved: true } } } },
        },
      },
      _count: { select: { products: { where: { status: "ACTIVE" } } } },
    },
  });

  if (!store) notFound();

  // Get store stats
  const [deliveredOrders, avgRating] = await Promise.all([
    prisma.orderItem.count({
      where: { sellerId: store.ownerId, order: { status: "DELIVERED" } },
    }),
    prisma.review.aggregate({
      where: { product: { sellerId: store.ownerId }, isApproved: true },
      _avg: { rating: true },
    }),
  ]);

  const rating = avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : null;
  const memberSince = new Date(store.owner.createdAt).getFullYear();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        {/* Store Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-brand-50 border border-brand-100">
              {store.logoUrl ? (
                <SafeImage src={store.logoUrl} alt={store.name} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900">{store.name}</h1>
                {store.isVerified && (
                  <span className="text-xs bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded-full">Təsdiqlənib</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{store.owner.fullName}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap text-sm">
                {rating && <span className="text-yellow-600 font-semibold"> {rating}</span>}
                <span className="text-gray-500"> {deliveredOrders} satış</span>
                <span className="text-gray-500">{store._count.products} aktiv elan</span>
                <span className="text-gray-500">{memberSince}-ci ildən</span>
              </div>
            </div>
          </div>
          {store.description && (
            <p className="text-sm text-gray-600 mt-4 leading-relaxed border-t border-gray-100 pt-4">
              {store.description}
            </p>
          )}
        </div>

        {/* Products */}
        <h2 className="font-bold text-gray-900 mb-4">Aktiv Elanlar ({store._count.products})</h2>
        {store.products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3"></p>
            <p className="text-gray-500">Bu mağazada aktiv elan yoxdur</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {store.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
  );
}
