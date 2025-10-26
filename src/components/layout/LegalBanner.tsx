'use client';

import { useTranslations } from 'next-intl';

export function LegalBanner() {
  const t = useTranslations('legal');

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-yellow-800">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  );
}
