"use client";
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { apiFetch } from '@/lib/apiClient';
import { useToast } from '@/components/ui/Toast';

export default function AdminCampaignsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", type: "HOMEPAGE_BANNER", targetUrl: "", imageUrl: "", startDate: "", endDate: "", status: "ACTIVE" });
  const [showForm, setShowForm] = useState(false);
  const { toast, ToastContainer } = useToast();

  const TYPES = ["HOMEPAGE_BANNER", "CATEGORY_BANNER", "STORE_PROMOTION", "FLASH_SALE", "DAILY_DEAL", "SPONSORED_PRODUCT", "REGIONAL"];

  useEffect(() => { 
    apiFetch("/api/campaigns").then(d => setItems(d.campaigns || [])).catch(e => toast(e.message, "error")).finally(() => setLoading(false)); 
  }, []);

  async function create(e) {
    e.preventDefault();
    try {
      const d = await apiFetch("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null
        })
      });
      setItems(p => [d.campaign, ...p]);
      setShowForm(false);
      setForm({ title: "", type: "HOMEPAGE_BANNER", targetUrl: "", imageUrl: "", startDate: "", endDate: "", status: "ACTIVE" });
      toast("Kampaniya əlavə edildi", "success");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  async function toggleStatus(id, st) {
    try {
      await apiFetch(`/api/campaigns/${id}`, { method: "PATCH", body: JSON.stringify({ status: st }) });
      setItems(p => p.map(c => c.id === id ? { ...c, status: st } : c));
      toast("Yeniləndi", "success");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Kampaniyalar</h1>
          <p className="text-gray-500 mt-1">Sistemdəki bütün reklam və kampaniyaları idarə edin.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
          {showForm ? "Ləğv Et" : "Yeni Kampaniya"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Başlıq</label><input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Növ</label><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white">{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Şəkil URL</label><input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hədəf URL</label><input value={form.targetUrl} onChange={e => setForm(p => ({ ...p, targetUrl: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Başlama Tarixi</label><input type="datetime-local" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Bitmə Tarixi</label><input type="datetime-local" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl" /></div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-brand-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700">Yarat</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kampaniya</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Növ</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müddət</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Yüklənir...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Heç bir kampaniya tapılmadı.</td></tr>
            ) : items.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500"><Icon name="megaphone" size={20} /></div>}
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.targetUrl || "Link yoxdur"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.type}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{c.startDate ? new Date(c.startDate).toLocaleDateString() : "—"} -</p>
                  <p className="text-xs text-gray-500">{c.endDate ? new Date(c.endDate).toLocaleDateString() : "Limitsiz"}</p>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={c.status} 
                    onChange={e => toggleStatus(c.id, e.target.value)}
                    className={`border border-gray-100 rounded-full text-xs font-bold px-2 py-1 outline-none ${c.status === "ACTIVE" ? "bg-green-100 text-green-700" : c.status === "PAUSED" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    <option value="ACTIVE">AKTİV</option>
                    <option value="PAUSED">PAUZADADIR</option>
                    <option value="COMPLETED">BİTDİ</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                    <Icon name="trash" size={18} />
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
