"use client";
import { useState, useEffect } from "react";
import { apiFetch, getUser } from "@/lib/apiClient";
import Icon from "@/components/ui/Icon";
import toast from "react-hot-toast";

export default function AgroServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    farmLocation: "",
    cropType: "",
    area: "",
    notes: "",
    contactPhone: "",
  });

  const user = getUser();

  useEffect(() => {
    if (user) {
      apiFetch("/api/agro-services")
        .then((data) => setRequests(data.services || []))
        .catch(() => {});
    }
  }, []);

  const services = [
    {
      type: "soil_analysis",
      title: "Torpaq Analizi",
      icon: "flask",
      desc: "Torpağın kimyəvi tərkibini və qida elementlərini analiz edin. NPK, pH, humus, mikroelementlər.",
      color: "from-amber-500 to-orange-500",
      features: ["pH və humus təyini", "NPK səviyyəsi", "Mikroelement analizi", "Gübrə tövsiyəsi"],
    },
    {
      type: "leaf_analysis",
      title: "Yarpaq Analizi",
      icon: "leaf",
      desc: "Bitki yarpaqlarının qida tərkibini analiz edin. Çatışmayan elementləri müəyyən edin.",
      color: "from-green-500 to-emerald-500",
      features: ["Qida çatışmazlığı təyini", "Mikroelement analizi", "Saralma səbəbi", "Gübrə tövsiyəsi"],
    },
    {
      type: "consultation",
      title: "Aqronom Konsultasiyası",
      icon: "user",
      desc: "Peşəkar aqronomla telefon və ya online məsləhət. Əkin planı, xəstəlik mübarizəsi, gübrə proqramı.",
      color: "from-blue-500 to-indigo-500",
      features: ["Əkin planı", "Xəstəlik mübarizəsi", "Gübrə proqramı", "Məhsuldarlıq artırıcı məsləhətlər"],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Xidmət sifarişi üçün giriş edin");
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch("/api/agro-services", {
        method: "POST",
        body: JSON.stringify({
          serviceType: selectedService,
          ...form,
        }),
      });
      toast.success("Sorğunuz qeydə alındı! Aqronom sizinlə əlaqə saxlayacaq.");
      setRequests([result.service, ...requests]);
      setSelectedService(null);
      setForm({ farmLocation: "", cropType: "", area: "", notes: "", contactPhone: "" });
    } catch (err) {
      toast.error("Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const statusLabels = {
    PENDING: "Gözləyir",
    IN_PROGRESS: "İcrada",
    COMPLETED: "Tamamlandı",
    CANCELLED: "Ləğv edildi",
  };
  const statusColors = {
    PENDING: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
        <Icon name="grid" size={28} /> Aqro Xidmətlər
      </h1>
      <p className="text-gray-500 mb-6">Torpaq analizi, yarpaq analizi və aqronom konsultasiyası</p>

      {/* Service Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {services.map((s) => (
          <div
            key={s.type}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <Icon name={s.icon} size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-3">{s.desc}</p>
            <ul className="space-y-1 mb-4">
              {s.features.map((f, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                  <Icon name="check" size={14} className="text-brand-500" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedService(s.type)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors active:scale-95"
            >
              Sorğu göndər
            </button>
          </div>
        ))}
      </div>

      {/* Request Form Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedService(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">
              {services.find(s => s.type === selectedService)?.title} sorğusu
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Təsərrüfat ünvanı</label>
                <input
                  type="text"
                  value={form.farmLocation}
                  onChange={(e) => setForm({ ...form, farmLocation: e.target.value })}
                  placeholder="Məs: Şəki rayonu"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Bitki növü / əkin</label>
                <input
                  type="text"
                  value={form.cropType}
                  onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                  placeholder="Məs: Taxıl, Pambıq, Tərəvəz"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Sahə (ha)</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="Məs: 5 ha"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Əlaqə telefonu</label>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="+994..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Qeydlər</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Əlavə məlumat..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400 min-h-[80px] resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-xl"
                >
                  İmtina
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-600 text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-50"
                >
                  {loading ? "Göndərilir..." : "Sorğu göndər"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Requests */}
      {user && requests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mənim sorğularım</h2>
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon name={services.find(s => s.type === r.serviceType)?.icon || "fileText"} size={20} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {services.find(s => s.type === r.serviceType)?.title || r.serviceType}
                  </p>
                  <p className="text-xs text-gray-400">
                    {r.farmLocation} {r.cropType && `· ${r.cropType}`} {r.area && `· ${r.area}`}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[r.status] || statusColors.PENDING}`}>
                  {statusLabels[r.status] || r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
