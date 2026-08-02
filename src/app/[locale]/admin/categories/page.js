"use client";
import React, { useState, useEffect } from 'react';
import Icon, { ICONS } from '@/components/ui/Icon';
import { apiFetch } from '@/lib/apiClient';
import { useToast } from '@/components/ui/Toast';

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nameAz: "", slug: "", icon: "", isActive: true, parentId: "" });
  const [err, setErr] = useState("");
  const { toast, ToastContainer } = useToast();

  useEffect(() => { 
    apiFetch("/api/categories?all=true")
      .then(d => setItems(d.categories || []))
      .catch(e => toast(e.message, "error"))
      .finally(() => setLoading(false)); 
  }, []);

  async function create(e) { 
    e.preventDefault(); 
    setErr(""); 
    try { 
      const payload = { ...form };
      if (!payload.parentId) payload.parentId = null; // Fix validation error for empty string
      const d = await apiFetch("/api/categories", { method: "POST", body: JSON.stringify(payload) }); 
      setItems(p => [...p, { ...d.category, name: d.category.nameAz }]); 
      setForm({ nameAz: "", slug: "", icon: "", isActive: true, parentId: "" }); 
      toast("Kateqoriya əlavə edildi", "success"); 
    } catch(e) { 
      setErr(e.message); 
      toast(e.message, "error");
    } 
  }

  async function toggleActive(id, val) { 
    try { 
      await apiFetch(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify({ isActive: val }) }); 
      setItems(p => p.map(c => c.id === id ? { ...c, isActive: val } : c)); 
      toast("Yeniləndi", "success"); 
    } catch(e) { 
      toast(e.message, "error"); 
    } 
  }

  const parents = items.filter(c => !c.parentId);

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Kateqoriyalar</h1>
          <p className="text-gray-500 mt-1">Sistemdəki bütün məhsul kateqoriyalarını idarə edin.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Yeni Kateqoriya Əlavə Et</h2>
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad (AZ)</label>
            <input required value={form.nameAz} onChange={e => setForm(p => ({ ...p, nameAz: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
          </div>
          <div className="relative group hover:z-50 focus-within:z-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">İkon seçin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icon name={form.icon || "search"} size={16} />
              </div>
              <input 
                value={form.icon} 
                onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} 
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none" 
                placeholder="İkon adı (məs: tractor) və ya şəkil linki (http...)" 
              />
            </div>
            
            {/* Dropdown for icons */}
            <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl p-3 z-50 hidden group-focus-within:block hover:block transition-all max-h-60 overflow-y-auto no-scrollbar">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Mövcud İkonlar</p>
              <div className="grid grid-cols-6 gap-1">
                {Object.keys(ICONS).map(iconName => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      setForm(p => ({ ...p, icon: iconName }));
                      document.activeElement.blur(); // close dropdown
                    }}
                    title={iconName}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95 ${form.icon === iconName ? 'bg-brand-100 text-brand-700 border border-brand-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-200 border border-transparent'}`}
                  >
                    <Icon name={iconName} size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valideyn Kateqoriya</label>
            <select value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white">
              <option value="">-- Əsas Kateqoriya --</option>
              {parents.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="lg:col-span-3 flex justify-end">
            <button type="submit" className="bg-brand-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700">Yarat</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">İkon / Ad</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Növ</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Yüklənir...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Heç bir kateqoriya tapılmadı.</td></tr>
            ) : items.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
                      <Icon name={c.icon || "grid"} size={20} />
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {c.parentId ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Alt Kateqoriya</span> : <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">Əsas</span>}
                </td>
                <td className="px-6 py-4">
                  {c.isActive ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Aktiv</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Deaktiv</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleActive(c.id, !c.isActive)} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${c.isActive ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                  >
                    {c.isActive ? "Deaktiv et" : "Aktiv et"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
