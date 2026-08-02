import React from 'react';
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import Icon from '@/components/ui/Icon';
import SideBanner from "@/components/Banners/SideBanner";

export const metadata = {
  title: 'Bütün Kateqoriyalar | FermerMarket',
  description: 'FermerMarket - Gübrələr, toxumlar, bitki mühafizə vasitələri və digər aqrar kateqoriyalar.',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  // Assign icons based on known names if not provided
  const iconMap = {
    'Bitki Mühafizə': 'bug',
    'Gübrələr': 'sprout',
    'Toxum və Ting': 'leaf',
    'Aqrotexnika': 'tractor',
    'Suvarma': 'droplets',
    'Alət və Avadanlıqlar': 'hammer',
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-[1600px] mx-auto flex gap-6 px-4">
        <SideBanner position="left" />
        <div className="flex-1 min-w-0 w-full">
          <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Məhsul <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-green-400">Kateqoriyaları</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Axtardığınız hər növ aqrar məhsulu, texnikanı və xidməti tapmaq üçün müvafiq bölməni seçin.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {categories.map((category, index) => {
            const iconName = category.icon || iconMap[category.nameAz] || 'box';
            // Array of gradients for visual variety
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
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6 relative">
                  <div className={`w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-800 -mt-12 mb-4 relative z-10 border border-gray-100 group-hover:text-brand-600 transition-colors`}>
                    <Icon name={iconName} size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">{category.nameAz}</h3>
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><Icon name="package" size={16} /> {category._count?.products || 0} məhsul</span>
                    <span className="text-brand-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}

        </div>
          </div>
        </div>
        <SideBanner position="right" />
      </div>
    </div>
  );
}
