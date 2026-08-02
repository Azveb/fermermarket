"use client";
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { apiFetch } from '@/lib/apiClient';
import { useToast } from '@/components/ui/Toast';

export default function AdminOrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, ToastContainer } = useToast();

  useEffect(() => { 
    apiFetch("/api/orders").then(d => setItems(d.orders || [])).catch(e => toast(e.message, "error")).finally(() => setLoading(false)); 
  }, []);

  async function updateStatus(id, st) {
    try {
      await apiFetch(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status: st }) });
      setItems(p => p.map(o => o.id === id ? { ...o, status: st } : o));
      toast("Sifariş statusu yeniləndi", "success");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  const STATUS_LABELS = { PENDING: "Gözləyir", PAID: "Ödənilib", PROCESSING: "Hazırlanır", SHIPPED: "Göndərilib", DELIVERED: "Çatdırılıb", CANCELLED: "Ləğv edilib", REFUNDED: "Geri qaytarılıb" };
  const STATUS_COLORS = { PENDING: "bg-yellow-100 text-yellow-700", PAID: "bg-blue-100 text-blue-700", PROCESSING: "bg-purple-100 text-purple-700", SHIPPED: "bg-blue-100 text-blue-700", DELIVERED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-700", REFUNDED: "bg-gray-100 text-gray-700" };

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Sifarişlər</h1>
          <p className="text-gray-500 mt-1">Platforma üzərindən olan bütün sifarişləri idarə edin.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sifariş №</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müştəri</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Məbləğ</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarix</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Yüklənir...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Heç bir sifariş tapılmadı.</td></tr>
            ) : items.map(o => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 text-sm">#{o.id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900 text-sm">{o.buyer?.fullName || "Bilinmir"}</p>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{Number(o.total).toLocaleString("az-AZ")} ₼</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(o.createdAt).toLocaleDateString("az-AZ")}</td>
                <td className="px-6 py-4">
                  <select 
                    value={o.status} 
                    onChange={e => updateStatus(o.id, e.target.value)}
                    className={`border border-gray-100 rounded-full text-xs font-bold px-2 py-1 outline-none ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {Object.keys(STATUS_LABELS).map(k => (
                      <option key={k} value={k}>{STATUS_LABELS[k]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
