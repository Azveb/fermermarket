"use client";
import React, { useState } from "react";
import Icon from "@/components/ui/Icon";

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
      console.error(err);
      setResult({ disease: "Xəta", confidence: "0%", recommendation: "Serverə qoşulmaq mümkün olmadı.", products: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-700 to-green-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
          <Icon name="bot" size={40} /> Süni İntellekt Aqronom
        </h1>
        <p className="text-lg text-teal-50 max-w-2xl mx-auto">
          Bitkiniz xəstədir? Şəklini çəkin, süni intellektimiz dərhal xəstəliyi tapsın və ən uyğun dərmanı sizə təklif etsin.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Upload Area */}
            <div>
              <h2 className="font-bold text-xl mb-4 text-gray-800">1. Şəkil yüklə və ya Sual yaz</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors relative mb-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {preview ? (
                  <div className="relative aspect-square w-full max-w-xs mx-auto rounded-xl overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="camera" size={32} />
                    </div>
                    <p className="font-medium text-gray-700">Bitkinin və ya yarpağın şəklini bura yükləyin</p>
                    <p className="text-xs text-gray-500 mt-2">və ya telefonun kamerası ilə şəkli çəkin</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <textarea 
                  rows="3" 
                  placeholder="Problemi yazaraq izah edin (məs: Yarpaqlarda saralma var...)"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>

              {(preview || text.trim()) && (
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <><Icon name="loader-2" className="animate-spin" /> Analiz edilir...</>
                  ) : (
                    <><Icon name="search" /> Xəstəliyi Təyin Et</>
                  )}
                </button>
              )}
            </div>

            {/* Results Area */}
            <div>
              <h2 className="font-bold text-xl mb-4 text-gray-800">2. Nəticə və Həll</h2>
              
              {!result && !loading && (
                <div className="h-full min-h-[300px] border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 p-8 text-center bg-gray-50">
                  Məlumat daxil etdikdən sonra analiz nəticəsi burada görünəcək.
                </div>
              )}

              {loading && (
                <div className="h-full min-h-[300px] border border-gray-100 rounded-2xl flex flex-col items-center justify-center text-brand-600 p-8 text-center bg-brand-50">
                  <Icon name="bot" size={48} className="animate-bounce mb-4" />
                  <p className="font-medium">Süni intellekt şəkli incələyir...</p>
                  <p className="text-sm text-gray-500 mt-2">Bu bir neçə saniyə çəkə bilər</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <p className="text-sm text-red-600 font-bold uppercase tracking-wider mb-1">Təyin olunan problem</p>
                    <h3 className="text-xl font-black text-gray-900">{result.disease}</h3>
                    <p className="text-sm text-gray-600 mt-1">Dəqiqlik: {result.confidence}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                    <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Icon name="info" size={16} /> Tövsiyə
                    </p>
                    <p className="text-gray-800 text-sm leading-relaxed">{result.recommendation}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Icon name="shopping-bag" size={16} className="text-brand-600" /> Təklif olunan məhsullar
                    </p>
                    <ul className="space-y-2">
                      {result.products.map((p, i) => (
                        <li key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-brand-700 font-bold">{p.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
