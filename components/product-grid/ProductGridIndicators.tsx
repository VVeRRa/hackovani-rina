'use client';

import { useLanguage } from '@/context/LanguageContext';

interface ProductGridIndicatorsProps {
  showOnlyWishlist: boolean;
  onClearWishlistFilter?: () => void;
  searchTerm: string;
  onClearSearch?: () => void;
}

export function ProductGridIndicators({
  showOnlyWishlist,
  onClearWishlistFilter,
  searchTerm,
  onClearSearch,
}: ProductGridIndicatorsProps) {
  const { t } = useLanguage();

  return (
    <>
      {showOnlyWishlist && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #6B1426 0%, #4A0E17 100%)',
            color: '#F7E9B8',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #F7E9B8',
            marginBottom: '24px',
            boxShadow: '0 4px 14px rgba(74, 14, 23, 0.25)',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            <span>❤️</span>
            <span>{t('wishlistFilterActiveTitle')}</span>
          </div>

          {onClearWishlistFilter && (
            <button
              onClick={onClearWishlistFilter}
              style={{
                background: 'rgba(247, 233, 184, 0.2)',
                border: '1px solid #F7E9B8',
                color: '#F7E9B8',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ✕ {t('wishlistFilterClear')}
            </button>
          )}
        </div>
      )}

      {searchTerm.trim() !== '' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #4A0E17 0%, #2A060C 100%)',
            color: '#F7E9B8',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #F7E9B8',
            marginBottom: '24px',
            boxShadow: '0 4px 14px rgba(74, 14, 23, 0.25)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            <span>🔍</span>
            <span>
              {t('searchResultsFor')} <strong>&quot;{searchTerm}&quot;</strong>
            </span>
          </div>

          {onClearSearch && (
            <button
              onClick={onClearSearch}
              style={{
                background: 'rgba(247, 233, 184, 0.2)',
                border: '1px solid #F7E9B8',
                color: '#F7E9B8',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ✕ {t('clearSearch')}
            </button>
          )}
        </div>
      )}
    </>
  );
}
