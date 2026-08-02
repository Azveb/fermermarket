"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { setError("Şifrələr uyğun gəlmir"); return; }
    if (password.length < 8) { setError("Şifrə minimum 8 simvol olmalıdır"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Xəta baş verdi");
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="card p-6 text-center">
        <p className="text-4xl mb-3">️</p>
        <p className="font-bold text-red-600">Keçərsiz link</p>
        <p className="text-sm text-gray-500 mt-2">Bu link etibarsız və ya müddəti bitib.</p>
        <Link href="/forgot-password" className="btn-primary mt-4 inline-block">Yenidən cəhd edin</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-6 text-center">
        <div className="text-4xl mb-3"></div>
        <p className="font-bold text-gray-900">Şifrəniz yeniləndi!</p>
        <p className="text-sm text-gray-500 mt-2">Giriş səhifəsinə yönləndirilirsiniz...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Yeni şifrə</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="Minimum 8 simvol"
          required
          minLength={8}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Şifrəni təsdiqləyin</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input-field"
          placeholder="Şifrəni yenidən daxil edin"
          required
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Yenilənir..." : "Şifrəni yenilə →"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3"></div>
          <h1 className="text-2xl font-black text-gray-900">Yeni Şifrə</h1>
          <p className="text-gray-500 text-sm mt-1">Hesabınız üçün yeni şifrə seçin</p>
        </div>
        <Suspense fallback={<div className="card p-6 text-center"><div className="h-8 bg-gray-100 rounded animate-pulse" /></div>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
