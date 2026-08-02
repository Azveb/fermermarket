'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-8">
      <div className="card p-8 max-w-md text-center">
        <h2 className="heading-lg text-red-600 mb-4">Xəta baş verdi!</h2>
        <p className="text-gray-700 mb-6">Səhifəni yükləyərkən gözlənilməz bir xəta oldu. Zəhmət olmasa yenidən cəhd edin.</p>
        <button className="btn-primary w-full" onClick={() => reset()}>
          Yenidən yoxla
        </button>
      </div>
    </div>
  );
}
