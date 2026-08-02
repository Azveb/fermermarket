"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { apiFetch } from "@/lib/apiClient";
import Icon from "@/components/ui/Icon";

// Existing subcomponents
import StoreProfileHeader from "@/components/dashboard/store/StoreProfileHeader";
import StoreAnalytics from "@/components/dashboard/store/StoreAnalytics";
import MessagingPanel from "@/components/chat/MessagingPanel";

// Created subcomponents
import StoreSidebar from "@/components/dashboard/store/StoreSidebar";
import ProductFilters from "@/components/dashboard/store/ProductFilters";
import ProductGrid from "@/components/dashboard/store/ProductGrid";
import StoreSettings from "@/components/dashboard/store/StoreSettings";

export default function StoreDashboard({ user }) {
  const router = useRouter();

  const [store, setStore] = useState(null);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    sort: "-createdAt",
    view: "grid",
  });

  const [toastMsg, setToastMsg] = useState(null);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  // Load initial store, stats, categories, products
  useEffect(() => {
    async function loadInitialData() {
      setLoadingStore(true);
      try {
        const storeRes = await apiFetch("/api/stores/me");
        if (storeRes?.store) {
          setStore(storeRes.store);
        }
      } catch (err) {
        console.error("Error loading store:", err);
      } finally {
        setLoadingStore(false);
      }

      try {
        const statsRes = await apiFetch("/api/stores/me/stats");
        if (statsRes) {
          setStats(statsRes);
        }
      } catch (err) {
        console.error("Error loading stats:", err);
      }

      try {
        const catRes = await apiFetch("/api/categories");
        if (Array.isArray(catRes)) {
          setCategories(catRes);
        } else if (catRes?.categories) {
          setCategories(catRes.categories);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }

      loadProducts();
    }

    loadInitialData();
  }, []);

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const prodRes = await apiFetch("/api/products?mine=1&pageSize=100");
      if (prodRes?.products) {
        setProducts(prodRes.products);
      } else if (Array.isArray(prodRes)) {
        setProducts(prodRes);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }

  // Handle product actions
  async function handleProductAction(action, target) {
    if (action === "edit") {
      router.push(`/dashboard/products/${target.id}/edit`);
    } else if (action === "preview") {
      if (typeof window !== "undefined") {
        window.open(`/products/${target.slug || target.id}`, "_blank");
      }
    } else if (action === "archive") {
      try {
        await apiFetch(`/api/products/${target.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "EXPIRED" }),
        });
        showToast("Məhsul arxivləşdirildi");
        loadProducts();
      } catch (err) {
        showToast(err.message || "Xəta baş verdi");
      }
    } else if (action === "toggle-status") {
      const newStatus = target.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
      try {
        await apiFetch(`/api/products/${target.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        });
        showToast(
          newStatus === "ACTIVE"
            ? "Məhsul aktivləşdirildi"
            : "Məhsul passivləşdirildi"
        );
        loadProducts();
      } catch (err) {
        showToast(err.message || "Xəta baş verdi");
      }
    } else if (action === "share") {
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/products/${target.slug || target.id}`
          : "";
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(shareUrl);
        showToast("Məhsul keçidi kopyalandı!");
      }
    } else if (action === "delete") {
      if (!confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;
      try {
        await apiFetch(`/api/products/${target.id}`, {
          method: "DELETE",
        });
        showToast("Məhsul silindi");
        setSelectedProductIds((prev) => prev.filter((id) => id !== target.id));
        loadProducts();
      } catch (err) {
        showToast(err.message || "Xəta baş verdi");
      }
    } else if (action === "bulk") {
      const { action: bulkAction, ids } = target;
      try {
        await apiFetch("/api/products/bulk", {
          method: "POST",
          body: JSON.stringify({ ids, action: bulkAction }),
        });
        showToast("Toplu əməliyyat uğurla icra olundu!");
        setSelectedProductIds([]);
        loadProducts();
      } catch (err) {
        showToast(err.message || "Toplu əməliyyatda xəta baş verdi");
      }
    }
  }

  // Handle Save Settings
  async function handleSaveSettings(formData) {
    setSavingSettings(true);
    try {
      const res = await apiFetch("/api/stores/me", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      if (res?.store) {
        setStore(res.store);
      }
      showToast("Tənzimləmələr uğurla saxlanıldı!");
    } catch (err) {
      console.error("Save settings error:", err);
      showToast(err.message || "Məlumatlar saxlanılarkən xəta baş verdi");
    } finally {
      setSavingSettings(false);
    }
  }

  // Filtered & Sorted products calculation
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const title = (prod.titleAz || prod.title || prod.name || "").toLowerCase();
          if (!title.includes(q)) return false;
        }
        if (filters.category) {
          const catId = prod.categoryId || prod.category?.id || prod.category;
          if (catId !== filters.category) return false;
        }
        if (filters.status) {
          if (prod.status !== filters.status) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sort === "-createdAt") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (filters.sort === "createdAt") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (filters.sort === "-viewCount") {
          return (b.viewCount || 0) - (a.viewCount || 0);
        }
        if (filters.sort === "price_asc") {
          return Number(a.price || 0) - Number(b.price || 0);
        }
        if (filters.sort === "price_desc") {
          return Number(b.price || 0) - Number(a.price || 0);
        }
        return 0;
      });
  }, [products, filters]);

  // Loading skeleton state for entire store dashboard
  if (loadingStore && !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="h-96 bg-gray-200 rounded-3xl" />
          <div className="lg:col-span-3 space-y-4">
            <div className="h-12 bg-gray-200 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-bounce">
          <Icon name="checkCircle" size={18} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP: Store Profile Header */}
      <StoreProfileHeader
        store={store}
        user={user}
        stats={stats}
        onEdit={() => setActiveTab("settings")}
      />

      {/* MAIN CONTENT: Sidebar + Tab Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <StoreSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          store={store}
          user={user}
        />

        {/* Right Tab Content */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-xs font-bold">Məhsullar</span>
                    <Icon name="package" size={18} className="text-brand-600" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">
                    {stats?.totalProducts ?? products.length}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    {stats?.activeProducts ?? 0} aktiv məhsul
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-xs font-bold">Baxışlar</span>
                    <Icon name="eye" size={18} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">
                    {stats?.totalViews ?? store?.storeViewCount ?? 0}
                  </div>
                  <p className="text-[10px] text-gray-400">Ümumi baxış</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-xs font-bold">Bəyənmələr</span>
                    <Icon name="heart" size={18} className="text-rose-500" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">
                    {stats?.totalFavorites ?? 0}
                  </div>
                  <p className="text-[10px] text-gray-400">Alıcı seçimləri</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-xs font-bold">Reytinq</span>
                    <Icon name="star" size={18} className="text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">
                    {stats?.averageRating
                      ? Number(stats.averageRating).toFixed(1)
                      : "5.0"}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {stats?.reviewCount ?? 0} rəy əsasında
                  </p>
                </div>
              </div>

              {/* Recent 4 Products Section */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      Son Əlavə Olunan Məhsullar
                    </h3>
                    <p className="text-xs text-gray-500">
                      Mağazanızdakı ən son elanlar
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("products")}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Hamısına bax</span>
                    <Icon name="arrowRight" size={14} />
                  </button>
                </div>

                <ProductGrid
                  products={products.slice(0, 4)}
                  loading={loadingProducts}
                  onProductAction={handleProductAction}
                  selectedIds={[]}
                  onSelectChange={() => {}}
                  view="grid"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <ProductFilters
                onFilterChange={setFilters}
                categories={categories}
              />
              <ProductGrid
                products={filteredProducts}
                loading={loadingProducts}
                onProductAction={handleProductAction}
                selectedIds={selectedProductIds}
                onSelectChange={setSelectedProductIds}
                view={filters.view}
              />
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === "analytics" && (
            <StoreAnalytics storeId={store?.id} />
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <StoreSettings
              store={store}
              onSave={handleSaveSettings}
              loading={savingSettings}
            />
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === "messages" && (
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
              <MessagingPanel />
            </div>
          )}

          {/* TAB 6: WALLET */}
          {activeTab === "wallet" && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Balans & Maliyyə Kisəsi
                  </h3>
                  <p className="text-xs text-gray-500">
                    Hesab balansınız və məxaric əməliyyatları
                  </p>
                </div>
                <Icon name="wallet" size={24} className="text-brand-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-brand-600 to-emerald-600 text-white p-5 rounded-2xl shadow-lg space-y-2">
                  <span className="text-xs font-semibold opacity-90">
                    Ümumi Balans
                  </span>
                  <div className="text-3xl font-black">
                    {stats?.totalRevenue ? Number(stats.totalRevenue).toFixed(2) : "0.00"} ₼
                  </div>
                  <p className="text-[10px] opacity-80">
                    Çıxarış üçün əlçatan məbləğ
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Gözləyən Ödənişlər
                  </span>
                  <div className="text-2xl font-black text-gray-900">0.00 ₼</div>
                  <p className="text-[10px] text-gray-400">Tranzit hesabda</p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Xidmət Haqqı
                  </span>
                  <div className="text-2xl font-black text-gray-900">0%</div>
                  <p className="text-[10px] text-gray-400">Komissiyasız tarif</p>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS PLACEHOLDER */}
          {![
            "overview",
            "products",
            "analytics",
            "settings",
            "messages",
            "wallet",
          ].includes(activeTab) && (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
                <Icon name="dashboard" size={32} />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-extrabold text-gray-900 capitalize">
                  {activeTab} Bölməsi
                </h3>
                <p className="text-xs text-gray-500">
                  Bu bölmə hazırda aktiv şəkildə yenilənir və tezliklə tam funksionallıqla istifadəyə veriləcək.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
