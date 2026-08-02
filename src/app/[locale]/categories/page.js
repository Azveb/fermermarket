import React from 'react';
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import Icon from '@/components/ui/Icon';
import SideBanner from "@/components/Banners/SideBanner";

export const metadata = {
  title: 'Bütün Kateqoriyalar | FermerMarket',
  description: 'FermerMarket - Gübrələr, toxumlar, bitki mühafizə vasitələri və digər aqrar kateqoriyalar.',
};

export const revalidate = 300; // 5 dəqiqə cache

export default async function CategoriesPage() {
  const [categories, brands, stores] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } }
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 12,
      include: { _count: { select: { products: { where: { status: 'ACTIVE' } } } } }
    }),
    prisma.store.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, slug: true, logoUrl: true, isVerified: true, _count: { select: { products: true } } }
    }),
  ]);

  const iconMap = {
    'Bitki Mühafizə': 'bug',
    'Gübrələr': 'sprout',
    'Toxum və Ting': 'leaf',
    'Aqrotexnika': 'tractor',
    'Suvarma': 'droplets',
    'Alət və Avadanlıqlar': 'hammer',
  };

  const gradients = [
    "from-emerald-500 to-green-600",
    "from-blue-500 to-indigo-600",
    "from-orange-400 to-red-500",
    "from-amber-400 to-orange-500",
    "from-purple-500 to-pink-600",
    "from-cyan-500 to-blue-600",
    "from-teal-400 to-emerald-500",
    "from-rose-400 to-red-500"
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-[1600px] mx-auto flex gap-6 px-4">
        <SideBanner position="left" />
        <div className="flex-1 min-w-0 w-full">
          <div className="container mx-auto max-w-6xl space-y-12">

            {/* ── HEADER ── */}
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Məhsul{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-green-400">
                  Kateqoriyaları
                </span>
              </h1>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Axtardığınız hər növ aqrar məhsulu, texnikanı və xidməti tapmaq üçün müvafiq bölməni seçin.
              </p>
            </div>

            {/* ── POPULYAR BRENDLƏR ── */}
            {brands.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-gray-900">Populyar Brendlər</h2>
                  <Link
                    href="/brands"
                    className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Hamısı
                    <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs">›</span>
                  </Link>
                </div>

                {/* Horizontal scroll row */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.slug}`}
                      className="flex-shrink-0 group flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200 min-w-[110px]"
                    >
                      {/* Logo ya da baş hərf */}
                      <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden group-hover:border-brand-200 transition-colors">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-2xl font-black text-brand-600">
                            {brand.name[0]}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-700 group-hover:text-brand-600 transition-colors text-center leading-tight">
                        {brand.name}
                      </span>
                      {brand._count?.products > 0 && (
                        <span className="text-[10px] text-gray-400">
                          {brand._count.products} məh.
                        </span>
                      )}
                    </Link>
                  ))}

                  {/* "Hamısını gör" kartı */}
                  <Link
                    href="/brands"
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-2 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 hover:bg-brand-100 transition-colors min-w-[90px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-lg font-bold">
                      ›
                    </div>
                    <span className="text-xs font-semibold text-brand-600 text-center">Hamısı</span>
                  </Link>
                </div>
              </section>
            )}

            {/* ── POPULYAR MAĞAZALAR ── */}
            {stores.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-gray-900">Populyar Satıcılar</h2>
                  <Link
                    href="/stores"
                    className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Hamısı
                    <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs">›</span>
                  </Link>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                  {stores.map((store) => (
                    <Link
                      key={store.id}
                      href={`/stores/${store.slug}`}
                      className="flex-shrink-0 group flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200 min-w-[120px]"
                    >
                      <div className="relative w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden group-hover:border-brand-200 transition-colors">
                        {store.logoUrl ? (
                          <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-black text-brand-600">
                            {store.name[0]}
                          </span>
                        )}
                        {store.isVerified && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center text-white text-[8px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-700 group-hover:text-brand-600 transition-colors text-center leading-tight line-clamp-2">
                        {store.name}
                      </span>
                      {store._count?.products > 0 && (
                        <span className="text-[10px] text-gray-400">
                          {store._count.products} məh.
                        </span>
                      )}
                    </Link>
                  ))}

                  <Link
                    href="/stores"
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-2 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 hover:bg-brand-100 transition-colors min-w-[90px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-lg font-bold">
                      ›
                    </div>
                    <span className="text-xs font-semibold text-brand-600 text-center">Hamısı</span>
                  </Link>
                </div>
              </section>
            )}

            {/* ── KATEQORİYALAR ── */}
            <section>
              <h2 className="text-xl font-black text-gray-900 mb-6">Bütün Kateqoriyalar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                  const iconName = category.icon || iconMap[category.nameAz] || 'box';
                  const bgGradient = gradients[index % gradients.length];

                  return (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                    >
                      <div className={`h-24 bg-gradient-to-r ${bgGradient} relative overflow-hidden`}>
                        <div className="absolute right-4 top-4 text-white/20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                          <Icon name={iconName} size={80} />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-6 relative">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-800 -mt-12 mb-4 relative z-10 border border-gray-100 group-hover:text-brand-600 transition-colors">
                          <Icon name={iconName} size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                          {category.nameAz}
                        </h3>
                        <div className="flex items-center justify-between text-gray-500 text-sm">
                          <span className="flex items-center gap-1">
                            <Icon name="package" size={16} /> {category._count?.products || 0} məhsul
                          </span>
                          <span className="text-brand-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

          </div>
        </div>
        <SideBanner position="right" />
      </div>
    </div>
  );
}
