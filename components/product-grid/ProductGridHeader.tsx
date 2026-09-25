'use client';

import { useLanguage } from '@/context/LanguageContext';

export function ProductGridHeader() {
  const { t } = useLanguage();

  return (
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <span
        style={{
          fontSize: '0.85rem',
          color: 'var(--burgundy-rose)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}
      >
        {t('catalogCategoryTag')}
      </span>
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.4rem',
          color: 'var(--burgundy-deep)',
          marginTop: '6px',
        }}
      >
        {t('catalogTitle')}
      </h2>
      <p
        style={{
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '8px auto 0 auto',
        }}
      >
        {t('catalogSubtitle')}
      </p>
    </div>
  );
}
