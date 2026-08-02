"use client";
import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import SafeImage from "@/components/SafeImage";
import { Link } from "@/i18n/routing";

export default function AgronomPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image && !text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      if (text) formData.append("text", text);

      const res = await fetch("/api/ai/agronomist", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ disease: "Xəta", confidence: "0%", recommendation: "Serverə qoşulmaq mümkün olmadı.", products: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-700 via-green-600 to-emerald-600 text-white py-12 px-4 text-center rounded-b-3xl">
        <h1 className="text-2xl md:text-4xl font-black mb-3 flex items-center justify-center gap-2">
          <Icon name="sprout" size={36} /> FermerMarket AI Aqronom
        </h1>
        <p className="text-base text-teal-50 max-w-2xl mx-auto">
          📷 Şəkil yüklə · Xəstəliyi müəyyən et · Çatışmayan elementi göstər · Dozanı hesabla · Çiləmə vaxtını tövsiyə et · Uyğun məhsulları göstər
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📷 Bitki şəkli yüklə
              </label>
              <label className="block cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="border-2 border-dashed border-brand-200 rounded-2xl p-6 text-center hover:bg-brand-50 transition-colors">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-xl object-contain" />
                  ) : (
                    <>
                      <Icon name="zoomIn" size={36} strokeWidth={1.5} className="text-brand-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Şəkil seçmək üçün kliklə</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG · maks 5MB</p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Text Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ✏️ Simptomları təsvir et
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Məsələn: Yarpaqlar saralıb, ləkələr var, bitki zəif böyüyür..."
                className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 min-h-[120px] resize-none"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || (!image && !text.trim())}
                className="w-full mt-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Analiz edilir...
                  </>
                ) : (
                  <>
                    <Icon name="search" size={20} strokeWidth={2.5} />
                    Analiz et
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="mt-6 space-y-4">
            {/* Diagnosis Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center">
                  <Icon name="checkCircle" size={24} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">TƏSNİFAT</p>
                  <h3 className="text-lg font-bold text-gray-900">{result.disease}</h3>
                </div>
                <span className="ml-auto bg-brand-50 text-brand-700 text-sm font-bold px-3 py-1.5 rounded-full">
                  {result.confidence}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{result.recommendation}</p>
            </div>

            {/* Spray Time + Dose */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.sprayTime && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="clock" size={18} className="text-amber-500" />
                    <h4 className="font-bold text-gray-900 text-sm">Çiləmə Vaxtı Tövsiyəsi</h4>
                  </div>
                  <p className="text-sm text-gray-600">{result.sprayTime}</p>
                </div>
              )}
              {result.doseInfo && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="droplet" size={18} className="text-blue-500" />
                    <h4 className="font-bold text-gray-900 text-sm">Doza Tövsiyəsi</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{result.doseInfo.product}</span>: {result.doseInfo.norm}
                  </p>
                </div>
              )}
            </div>

            {/* Recommended Products */}
            {result.products && result.products.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="package" size={20} className="text-brand-600" />
                  Tövsiyə olunan məhsullar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-all border border-gray-100"
                    >
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        {p.coverImage ? (
                          <SafeImage src={p.coverImage} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Icon name="sprout" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">{p.name}</p>
                        <p className="text-sm font-bold text-brand-600 mt-1">{p.price} {p.currency}</p>
                        {p.manufacturer && <p className="text-[10px] text-gray-400 mt-0.5">{p.manufacturer}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Highlights */}
        {!result && !loading && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: "search", title: "Xəstəlik müəyyənetmə", desc: "Şəkildən xəstəlik təsbiti" },
              { icon: "droplet", title: "Çatışmayan element", desc: "Qida çatışmazlığı analizi" },
              { icon: "package", title: "Doza hesablama", desc: "Hektar üçün doza tövsiyəsi" },
              { icon: "clock", title: "Çiləmə vaxtı", desc: "Optimal sprey vaxtı tövsiyəsi" },
              { icon: "tag", title: "Uyğun məhsullar", desc: "DB-dən real məhsul tövsiyəsi" },
              { icon: "leaf", title: "Bitki qidalanması", desc: "Kompleks qidalanma məsləhəti" },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-2">
                  <Icon name={f.icon} size={20} className="text-brand-600" />
                </div>
                <p className="text-xs font-bold text-gray-900">{f.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
