import React from 'react';
import { Link } from "@/i18n/routing";
import Icon from '@/components/ui/Icon';
import AdminSidebarNav from '@/components/dashboard/AdminSidebarNav';
export const metadata = {
  title: 'Admin Panel | FermerMarket',
  description: 'FermerMarket İdarəetmə Paneli',
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/admin" className="font-extrabold text-2xl text-brand-600 tracking-tight">
            FM Admin
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <AdminSidebarNav />
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 rounded-xl font-medium transition-colors">
            <Icon name="log-out" size={20} />
            Sayta Qayıt
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">İdarəetmə Paneli</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Bütün bildirişlər oxunub">
              <Icon name="bell" size={24} />
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
