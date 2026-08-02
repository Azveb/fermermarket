"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import ProductCard from "@/components/ProductCard";
import Icon from "@/components/ui/Icon";
import HeroSlider from "@/components/home/HeroSlider";
import PromoSlider from "@/components/home/PromoSlider";
import StatsSection from "@/components/home/StatsSection";
import BlogSection from "@/components/home/BlogSection";
import BundleCard from "@/components/BundleCard";
import AdBanner from "@/components/AdBanner";
import CategoriesSlider from "@/components/home/CategoriesSlider";

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

export default function DynamicHomeRenderer({ initialBlocks, homeData, editMode }) {
  const [blocks, setBlocks] = useState(initialBlocks);

  useEffect(() => {
    if (!editMode) return;
    const handleMessage = (e) => {
      if (e.data?.type === "FMK_LIVE_UPDATE") {
        setBlocks(e.data.blocks);
      } else if (e.data?.type === "FMK_RELOAD_BLOCKS") {
        window.location.reload();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [editMode]);

  const onBlockClick = (index, e) => {
    if (editMode) {
      e.stopPropagation();
      e.preventDefault();
      window.parent.postMessage({ type: "FMK_BLOCK_CLICK", index }, "*");
    }
  };

  if (!blocks || blocks.length === 0) {
    return null; // Fallback handled by parent
  }

  return (
    <div className={`pb-28 md:pb-12 ${editMode ? "p-4" : ""}`}>
      {blocks.map((block, index) => {
        const p = block.props || {};
        let content = null;

        if (block.type === "HERO_SLIDER") {
          content = <HeroSlider />;
        } else if (block.type === "CATEGORIES") {
          content = <CategoriesSlider categories={homeData?.categories?.slice(0, p.count || 10)} title={p.title} subtitle={p.subtitle} />;
        } else if (block.type === "PREMIUM_ADS") {
          if (!homeData?.premiumListings?.length) return null;
          content = (
            <section className="max-w-6xl mx-auto px-4 mt-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500">
                      <Icon name="star" size={20} />
                    </div>
                    {p.title || "Premium Elanlar"}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">{p.subtitle || "Önə çıxan elanlar"}</p>
                </div>
                <Link href="/products?tier=premium" className="text-sm text-brand-600 font-semibold hover:text-brand-700"><span className="flex items-center gap-1">Hamısı <Icon name="arrowRight" size={14} /></span></Link>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 scroll-snap-x">
                {homeData.premiumListings.map((l) => (
                  <div key={l.id} className="scroll-snap-item shrink-0 w-44 sm:w-52">
                    <ProductCard
                      tier={l.tier}
                      product={{
                        id: l.product?.id || l.id,
                        slug: l.product?.slug,
                        title: l.product?.titleAz || "Elan",
                        price: Number(l.product?.price || 0),
                        coverImage: Array.isArray(l.product?.images) ? l.product.images[0]?.url : null,
                        region: l.product?.region,
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        } else if (block.type === "LATEST_ADS") {
          content = (
            <section className="max-w-6xl mx-auto px-4 mt-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                      <Icon name="tag" size={20} />
                    </div>
                    {p.title || "Yeni Elanlar"}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">{p.subtitle || "Ən son əlavə edilmiş məhsullar"}</p>
                </div>
                <Link href="/products" className="text-sm text-brand-600 font-semibold hover:text-brand-700"><span className="flex items-center gap-1">Hamısı <Icon name="arrowRight" size={14} /></span></Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {homeData?.latestProducts?.slice(0, p.count || 8).map((prod) => (
                   <ProductCard
                     key={prod.id}
                     product={{
                       id: prod.id,
                       slug: prod.slug,
                       title: prod.titleAz || "Elan",
                       price: Number(prod.price || 0),
                       coverImage: Array.isArray(prod.images) ? prod.images[0]?.url : null,
                       region: prod.region,
                     }}
                   />
                ))}
              </div>
            </section>
          );
        } else if (block.type === "BUNDLES") {
          if (!homeData?.bundles?.length) return null;
          content = (
            <section className="max-w-6xl mx-auto px-4 mt-10">
               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                 <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                   <Icon name="package" size={20} />
                 </div>
                 {p.title || "Bağlamalar"}
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                 {homeData.bundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
               </div>
            </section>
          );
        } else if (block.type === "BLOG") {
          if (!homeData?.blogPosts?.length) return null;
          content = <div className="max-w-6xl mx-auto px-4 mt-10"><BlogSection posts={homeData.blogPosts} /></div>;
        } else if (block.type === "AD_BANNER") {
           if (!homeData?.homepageAd) return null;
           content = <div className="max-w-6xl mx-auto px-4 mt-10"><AdBanner content={homeData.homepageAd} /></div>;
        } else {
          content = <div className="p-10 bg-gray-100 text-center rounded-2xl mx-4 mt-10">Bilinməyən modul: {block.type}</div>;
        }

        return (
          <div 
            key={index} 
            onClick={(e) => onBlockClick(index, e)}
            className={`${editMode ? 'relative cursor-pointer ring-2 ring-transparent hover:ring-brand-500 rounded-3xl transition group' : ''}`}
          >
            {editMode && (
              <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 rounded-3xl z-10 flex items-center justify-center transition pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 bg-brand-600 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-xl pointer-events-auto">
                  Redaktə et ({block.type})
                </span>
              </div>
            )}
            {content}
          </div>
        );
      })}
    </div>
  );
}
