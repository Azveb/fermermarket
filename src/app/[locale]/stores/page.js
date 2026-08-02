import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import Icon from "@/components/ui/Icon";
import SideBanner from "@/components/Banners/SideBanner";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Satış Nöqtələri və Mağazalar — FermerMarket",
    description: "Sizə ən yaxın kənd təsərrüfatı mağazalarını, apteklərini və satış nöqtələrini xəritədə tapın.",
  };
}

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      phone: true,
      logoUrl: true,
      isVerified: true,
      _count: { select: { products: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto flex gap-6 px-4 py-8">
        <SideBanner position="left" />
        <div className="flex-1 min-w-0 w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Satış Nöqtələri və Mağazalar</h1>
            <p className="text-gray-500">Sizə ən yaxın kənd təsərrüfatı apteklərini və rəsmi dilerləri tapın.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard" className="bg-gray-100 text-gray-800 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-200 font-semibold border border-gray-200">
              <Icon name="store" size={18} /> Mağaza Aç
            </Link>
            <button className="bg-brand-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-brand-700 font-semibold">
              <Icon name="map" size={18} /> Xəritədə Bax
            </button>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-[400px] bg-gray-200 relative">
        {/* Mock Map Image or iframe */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Azerbaijan&zoom=7&size=1200x400&maptype=roadmap&style=feature:all|element:labels|visibility:off&client=gme-dummy')] bg-cover bg-center">
          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-white text-center">
            <Icon name="map-pin" size={32} className="text-brand-600 mx-auto mb-2" />
            <p className="font-bold text-gray-800">İnteraktiv Xəritə Tezliklə!</p>
            <p className="text-sm text-gray-500">Hazırda xəritə API inteqrasiyası davam edir.</p>
          </div>
        </div>
      </div>

      {/* Stores List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">Bütün Mağazalar ({stores.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map(store => (
            <div key={store.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 border border-gray-200 overflow-hidden">
                  {store.logoUrl ? (
                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon name="store" size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 flex items-center gap-1">
                    {store.name}
                    {store.isVerified && <span title="Rəsmi Mağaza" className="text-blue-500 text-base">✔</span>}
                  </h3>
                  <p className="text-sm text-brand-600 font-medium">{store._count.products} məhsul</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                {store.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Icon name="map-pin" size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span>{store.address}</span>
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="phone" size={16} className="text-gray-400 shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                )}
              </div>

              <Link href={`/stores/${store.slug}`} className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold py-2.5 rounded-xl transition-colors">
                Mağazaya Keç
              </Link>
            </div>
          ))}
        </div>

        {stores.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Hələlik heç bir mağaza qeydiyyatdan keçməyib.
          </div>
        )}
      </div>
        </div>
        <SideBanner position="right" />
      </div>
    </div>
  );
}
