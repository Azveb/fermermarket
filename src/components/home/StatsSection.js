"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 15000, suffix: "+", label: "Aktiv Elan", icon: "📋" },
  { value: 4500,  suffix: "+", label: "Fermer",     icon: "👨‍🌾" },
  { value: 1200,  suffix: "+", label: "Mağaza",     icon: "🏪" },
  { value: 98,    suffix: "%", label: "Məmnun İstifadəçi", icon: "⭐" },
];

function useCountUp(target, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);
  return count;
}

function StatCard({ stat, started }) {
  const count = useCountUp(stat.value, started);
  return (
    <div className="card p-5 text-center hover:shadow-md transition-shadow">
      <div className="text-3xl mb-2">{stat.icon}</div>
      <div className="text-2xl md:text-3xl font-extrabold text-brand-700">
        {count.toLocaleString("az-AZ")}{stat.suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
    </div>
  );
}

export default function StatsSection() {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
      <div className="mb-4">
        <h2 className="section-title">Niyə FermerMarket?</h2>
        <p className="section-subtitle">Azərbaycanlı fermerlər bizi seçir</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map((s) => <StatCard key={s.label} stat={s} started={started} />)}
      </div>
    </section>
  );
}
