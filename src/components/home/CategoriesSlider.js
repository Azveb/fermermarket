"use client";
import { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Icon from "@/components/ui/Icon";

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

export default function CategoriesSlider({ categories, title, subtitle }) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    let animationId;
    const scrollContainer = scrollRef.current;
    
    const scroll = () => {
      if (!isHovered && scrollContainer) {
        scrollContainer.scrollLeft += 1;
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // Duplicate categories to make infinite scrolling smoother
  const displayCategories = [...(categories || []), ...(categories || [])];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-4 relative z-10">
      <div className="flex flex-col items-center justify-center text-center relative mb-6 px-2">
        <h2 className="text-2xl font-bold text-gray-900">{title || "Kateqoriyalar"}</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">{subtitle || "Məhsul növünü seçin"}</p>
        <Link href="/products" className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-brand-600 font-semibold hover:text-brand-700 hidden sm:block"><span className="flex items-center gap-1">Hamısı <Icon name="arrowRight" size={14} /></span></Link>
      </div>

      <div 
        className="relative group"
        onMouseEnter={() => { setIsHovered(true); setShowArrows(true); }}
        onMouseLeave={() => { setIsHovered(false); setShowArrows(false); }}
        onTouchStart={() => setIsHovered(true)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-2 snap-x"
          style={{ scrollBehavior: isHovered ? 'smooth' : 'auto' }}
        >
          {displayCategories.map((c, i) => {
            const theme = CATEGORY_THEMES[c.slug] || DEFAULT_THEME;
            return (
              <Link
                key={`${c.id}-${i}`}
                href={`/products?category=${c.slug}`}
                className={`snap-center shrink-0 w-64 group/card flex items-center gap-3.5 p-4 rounded-2xl border bg-gradient-to-br ${theme.bg} ${theme.border} hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
              >
                <span className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${theme.iconBg} group-hover/card:scale-110 transition-transform duration-300`}>
                  {c.icon && (c.icon.length <= 2 || c.icon.includes("http")) ? (
                    c.icon.includes("http") ? <img src={c.icon} alt="" className="w-8 h-8 object-contain" /> : <span className="text-2xl">{c.icon}</span>
                  ) : (
                    <Icon name={c.icon || CATEGORY_ICONS[c.slug] || "sprout"} size={26} strokeWidth={1.5} />
                  )}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={`text-sm font-bold leading-tight ${theme.text} line-clamp-2`}>{c.nameAz}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Left Arrow */}
        <button 
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-all z-20 ${showArrows ? 'opacity-100 translate-x-1' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
        >
          <Icon name="chevron-left" size={24} />
        </button>
        
        {/* Right Arrow */}
        <button 
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-all z-20 ${showArrows ? 'opacity-100 -translate-x-1' : 'opacity-0 translate-x-4 pointer-events-none'}`}
        >
          <Icon name="chevron-right" size={24} />
        </button>
      </div>
    </section>
  );
}
