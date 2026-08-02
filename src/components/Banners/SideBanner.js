"use client";
import React from "react";
import SafeImage from "@/components/SafeImage";
import { Link } from "@/i18n/routing";

export default function SideBanner({ position = "left" }) {
  // In a real app, you could fetch specific campaigns for "LEFT_SIDE" or "RIGHT_SIDE"
  // Here we use a placeholder styling for demonstration
  return (
    <div className={`hidden xl:block w-[160px] flex-shrink-0 sticky top-24 h-[600px] bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm`}>
      <Link href="/campaigns" className="block w-full h-full relative group">
        <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-brand-900/0 transition-colors z-10" />
        <div className="flex flex-col h-full justify-between p-4 relative z-20">
          <div>
            <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Reklam</span>
            <h3 className="mt-4 font-black text-brand-800 text-xl leading-tight">Mövsümün<br/>Fürsəti!</h3>
            <p className="mt-2 text-xs text-gray-600 font-medium">Bütün gübrələrdə 20% endirim</p>
          </div>
          <div className="text-center">
            <span className="inline-block bg-white text-brand-700 text-xs font-bold px-4 py-2 rounded-xl shadow-sm border border-brand-100 group-hover:scale-105 transition-transform">
              Ətraflı
            </span>
          </div>
        </div>
        {/* Placeholder background graphic */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-brand-600">
            <path d="M0,100 C30,80 70,120 100,60 L100,100 Z" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
