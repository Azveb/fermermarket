"use client";
import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Xəta baş verdi");
      }
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3"></div>
          <h1 className="text-2xl font-black text-gray-900">Şifrəni Yenilə</h1>
          <p className="text-gray-500 text-sm mt-1">E-poçtunuzu daxil edin, link göndərəcəyik</p>
        </div>

        {done ? (
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3"></div>
            <p className="font-bold text-gray-900 mb-2">Link göndərildi!</p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>{email}</strong> ünvanına şifrə sıfırlama linki göndərildi. Zəhmət olmasa yoxlayın.
            </p>
            <Link href="/login" className="btn-primary w-full text-center block">Giriş səhifəsinə qayıt</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-poçt ünvanı</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="siz@example.com"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Göndərilir..." : "Link göndər →"}
            </button>
            <p className="text-center text-sm text-gray-500">
              Yadınıza düşdü?{" "}
              <Link href="/login" className="text-brand-600 font-semibold hover:underline">Giriş et</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
