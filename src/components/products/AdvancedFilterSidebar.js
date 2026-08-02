"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useCallback, useState, useEffect } from "react";
import CategorySelector from "@/components/ui/CategorySelector";
import Icon from "@/components/ui/Icon";

export default function AdvancedFilterSidebar({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create local state for debounce
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    regions: searchParams.get("regions") ? searchParams.get("regions").split(",") : (searchParams.get("region") ? [searchParams.get("region")] : []),
    sort: searchParams.get("sort") || "",
    isCorporate: searchParams.get("isCorporate") || "",
    isOrganic: searchParams.get("isOrganic") === "true",
    isDiscounted: searchParams.get("isDiscounted") === "true",
    hasInstallment: searchParams.get("hasInstallment") === "true",
    hasDelivery: searchParams.get("hasDelivery") === "true",
    tags: searchParams.get("tags") || "",
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [isRegionOpen, setIsRegionOpen] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const regionList = ["Bakı", "Abşeron", "Gəncə", "Naxçıvan", "Qazax", "Ağstafa", "Tovuz", "Sumqayıt", "Bərdə", "Lənkəran", "Şəki", "Cəlilabad", "Xaçmaz"];
  const filteredRegions = regionList.filter(r => r.toLowerCase().includes(regionSearch.toLowerCase()));

  // Sync state if URL changes externally
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      regions: searchParams.get("regions") ? searchParams.get("regions").split(",") : (searchParams.get("region") ? [searchParams.get("region")] : []),
      sort: searchParams.get("sort") || "",
      isCorporate: searchParams.get("isCorporate") || "",
      isOrganic: searchParams.get("isOrganic") === "true",
      isDiscounted: searchParams.get("isDiscounted") === "true",
      hasInstallment: searchParams.get("hasInstallment") === "true",
      hasDelivery: searchParams.get("hasDelivery") === "true",
      tags: searchParams.get("tags") || "",
    });
  }, [searchParams]);

  const updateFilters = useCallback((newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (key === 'regions') {
        if (value && value.length > 0) {
          params.set(key, value.join(","));
        }
      } else if (value) {
        params.set(key, value);
      }
    });

    // Reset page to 1 on filter change
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }, [filters, router]);

  // Debounced input handler for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFilters({ [e.target.name]: e.target.value });
    }
  };

  const handleRegionChange = (region, checked) => {
    let newRegions = [...filters.regions];
    if (checked) newRegions.push(region);
    else newRegions = newRegions.filter(r => r !== region);
    updateFilters({ regions: newRegions });
  };

  const clearAll = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      regions: [],
      sort: "",
      isCorporate: "",
      isOrganic: false,
      isDiscounted: false,
      hasInstallment: false,
      hasDelivery: false,
      tags: "",
    });
    router.push("/products");
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden w-full mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between font-semibold text-gray-700 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Icon name="filter" size={20} className="text-brand-600" />
          Filtrlər və Sıralama
        </div>
        <Icon name="chevronDown" size={20} className="text-gray-400" />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        md:relative md:w-72 md:translate-x-0 md:shadow-sm md:border md:border-gray-100 md:rounded-2xl md:z-0 md:bg-white
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header (Mobile only) */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 md:hidden">
            <h2 className="text-lg font-bold text-gray-900">Ətraflı Axtarış</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearAll} 
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg transition-colors"
              >
                Sıfırla
              </button>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg">
                <Icon name="x" size={20} />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between p-5 pb-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Ətraflı Axtarış</h2>
              <p className="text-xs text-gray-400 mb-2">Nəticələri dəqiqləşdirin</p>
            </div>
            <button 
              onClick={clearAll} 
              className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg transition-colors mb-3"
            >
              Sıfırla
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
            
            {/* Axtarış */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Axtarış sözü</label>
              <div className="relative">
                <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="search" 
                  value={filters.search}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Nə axtarırsınız?" 
                  className="input-field pl-10 w-full text-sm bg-gray-50/50" 
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Teqlər (vergüllə ayırın)</label>
              <div className="relative">
                <Icon name="tag" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="tags" 
                  value={filters.tags}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="məs: orqanik, toxum" 
                  className="input-field pl-10 w-full text-sm bg-gray-50/50" 
                />
              </div>
            </div>

            {/* Kateqoriya */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Kateqoriya</label>
              <CategorySelector 
                categories={categories} 
                defaultValue={filters.category} 
                onChange={(slug) => updateFilters({ category: slug })}
              />
            </div>

            {/* Əlavə Seçimlər (Discount, Installment, Delivery) */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.isDiscounted}
                  onChange={(e) => updateFilters({ isDiscounted: e.target.checked })}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Endirimli</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.hasInstallment}
                  onChange={(e) => updateFilters({ hasInstallment: e.target.checked })}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Taksitli ödəniş</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.hasDelivery}
                  onChange={(e) => updateFilters({ hasDelivery: e.target.checked })}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Çatdırılma edilir</span>
              </label>
            </div>

            <hr className="border-gray-100" />

            {/* Rayon */}
            <div className="space-y-3">
              <button 
                onClick={() => setIsRegionOpen(!isRegionOpen)} 
                className="w-full flex justify-between items-center text-sm font-semibold text-gray-800"
              >
                <span>Rayon</span>
                <Icon name={isRegionOpen ? "chevronUp" : "chevronDown"} size={16} className="text-gray-500" />
              </button>
              
              {isRegionOpen && (
                <div className="space-y-3">
                  <div className="relative">
                    <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Rayonu axtar" 
                      value={regionSearch}
                      onChange={(e) => setRegionSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 no-scrollbar px-1 py-1">
                    {filteredRegions.map(region => (
                      <label key={region} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.regions.includes(region)}
                          onChange={(e) => handleRegionChange(region, e.target.checked)}
                          className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Mağaza */}
            <div className="space-y-3">
              <button 
                onClick={() => setIsStoreOpen(!isStoreOpen)} 
                className="w-full flex justify-between items-center text-sm font-semibold text-gray-800"
              >
                <span>Mağaza</span>
                <Icon name={isStoreOpen ? "chevronUp" : "chevronDown"} size={16} className="text-gray-500" />
              </button>
              
              {isStoreOpen && (
                <div className="space-y-3">
                   <p className="text-xs text-gray-500">Tezliklə...</p>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Qiymət */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 flex justify-between">
                <span>Qiymət aralığı</span>
                <span className="text-gray-400 font-normal text-xs">AZN</span>
              </label>
              <div className="flex items-center gap-3">
                <input 
                  name="minPrice" 
                  value={filters.minPrice}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Min" 
                  type="number" 
                  className="input-field text-sm w-full bg-gray-50/50" 
                />
                <span className="text-gray-300">-</span>
                <input 
                  name="maxPrice" 
                  value={filters.maxPrice}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Max" 
                  type="number" 
                  className="input-field text-sm w-full bg-gray-50/50" 
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Satış Növü (Corporate / Retail) */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800">Satış Növü</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="isCorporate" 
                    value=""
                    checked={filters.isCorporate === ""}
                    onChange={(e) => updateFilters({ isCorporate: "" })}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Hər ikisi</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="isCorporate" 
                    value="false"
                    checked={filters.isCorporate === "false"}
                    onChange={(e) => updateFilters({ isCorporate: "false" })}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Pərakəndə (Retail)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="isCorporate" 
                    value="true"
                    checked={filters.isCorporate === "true"}
                    onChange={(e) => updateFilters({ isCorporate: "true" })}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Topdan (Corporate)</span>
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Xüsusiyyətlər */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800">Xüsusiyyətlər</label>
              <label className="flex items-center gap-3 cursor-pointer group p-3 bg-brand-50/50 rounded-xl border border-brand-100/50 hover:bg-brand-50 transition-colors">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={filters.isOrganic}
                    onChange={(e) => updateFilters({ isOrganic: e.target.checked })}
                    className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                  />
                  <div className="w-5 h-5 border-2 border-brand-300 rounded peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-all flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-brand-900 flex items-center gap-1">
                    🌱 Orqanik / Təbii
                  </span>
                  <span className="text-xs text-brand-600/80">Yalnız kimyəvi qatqısız məhsullar</span>
                </div>
              </label>
            </div>

            <hr className="border-gray-100" />

            {/* Sıralama */}
            <div className="space-y-2 pb-6">
              <label className="text-sm font-semibold text-gray-800">Sıralama</label>
              <div className="relative">
                <select 
                  name="sort" 
                  value={filters.sort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="input-field w-full text-sm bg-gray-50/50 appearance-none font-medium"
                >
                  <option value="">🕐 Ən yeni</option>
                  <option value="price_asc">💰 Ucuzdan baha</option>
                  <option value="price_desc">💎 Bahadan ucuz</option>
                  <option value="oldest">📅 Ən köhnə</option>
                </select>
                <Icon name="chevronDown" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

          </div>
          
          {/* Mobile Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 md:hidden">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="btn-primary w-full shadow-lg"
            >
              Nəticələrə Bax
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
