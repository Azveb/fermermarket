"use client";
import React from 'react';
import { Link, usePathname } from "@/i18n/routing";
import Icon from '@/components/ui/Icon';

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", icon: "grid", label: "Dashboard", exact: true },
    { href: "/admin/products", icon: "package", label: "Məhsullar" },
    { href: "/admin/categories", icon: "folder", label: "Kateqoriyalar" },
    { href: "/admin/orders", icon: "shopping-cart", label: "Sifarişlər" },
    { href: "/admin/users", icon: "users", label: "İstifadəçilər" },
    { href: "/admin/campaigns", icon: "tag", label: "Kampaniyalar" },
    { href: "/admin/active-ingredients", icon: "flask-conical", label: "Aktiv Maddələr" },
    { href: "/admin/translations", icon: "globe", label: "Tərcümələr" },
    { href: "/admin/settings", icon: "settings", label: "Tənzimləmələr" },
  ];

  return (
    <nav className="space-y-1 px-3">
      {links.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);
          
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive 
                ? 'bg-brand-50 text-brand-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon name={link.icon} size={20} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
