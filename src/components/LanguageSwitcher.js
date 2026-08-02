"use client";

import React, { useState, useEffect } from 'react';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n';
import Icon from '@/components/ui/Icon';

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState('az');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Component mounted, get saved locale from localStorage if exists
    const saved = localStorage.getItem('fm_locale');
    if (saved && LOCALES.includes(saved)) {
      setCurrentLocale(saved);
    }
  }, []);

  const handleLanguageChange = (locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('fm_locale', locale);
    // document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    setIsOpen(false);
    
    // In a full Next.js i18n setup we would router.push() to the locale path
    // For this demonstration, we just reload to apply the language across the client
    window.location.reload();
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors bg-gray-50 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-gray-200"
      >
        <span>{LOCALE_LABELS[currentLocale].split(' ')[1]}</span>
        <span>{currentLocale.toUpperCase()}</span>
        <Icon name="chevron-down" size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 py-2">
          {LOCALES.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                currentLocale === locale ? 'text-brand-600 font-bold bg-brand-50' : 'text-gray-700'
              }`}
            >
              <span>{LOCALE_LABELS[locale]}</span>
              {currentLocale === locale && <Icon name="check" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
