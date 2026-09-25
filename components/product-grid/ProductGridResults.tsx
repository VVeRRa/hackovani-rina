'use client';

import type { DatoProduct } from '@/lib/datocms';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';

interface ProductGridResultsProps {
  products: DatoProduct[];
  showOnlyWishlist: boolean;
  searchTerm: string;
  activeFilterCount: number;
  onClearWishlistFilter?: () => void;
  onClearSearch?: () => void;
  onResetFilters: () => void;
}

export function ProductGridResults({
  products,
  showOnlyWishlist,
  searchTerm,
  activeFilterCount,
  onClearWishlistFilter,
  onClearSearch,
  onResetFilters,
}: ProductGridResultsProps) {
  const { t } = useLanguage();

  if (products.length > 0) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '28px',
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  if (showOnlyWishlist) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--card-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-medium)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❤️</div>
        <h3 style={{ color: 'var(--burgundy-deep)', marginBottom: '8px' }}>
          {t('wishlistEmptyTitle')}
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginBottom: '20px',
          }}
        >
          {t('wishlistEmptySub')}
        </p>
        {onClearWishlistFilter && (
          <button
            onClick={onClearWishlistFilter}
            style={{
              background:
                'linear-gradient(135deg, var(--burgundy-main) 0%, var(--burgundy-dark) 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-burgundy)',
            }}
          >
            {t('wishlistFilterClear')}
          </button>
        )}
      </div>
    );
  }

  const canReset = Boolean(searchTerm) || activeFilterCount > 0;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'var(--card-bg-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-medium)',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔎</div>
      <h3 style={{ color: 'var(--burgundy-deep)', marginBottom: '8px' }}>
        {t('noSearchResults')} {searchTerm ? `"${searchTerm}"` : ''}
      </h3>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: '20px',
        }}
      >
        {t('noSearchResultsSub')}
      </p>
      {canReset && (
        <button
          onClick={() => {
            onClearSearch?.();
            onResetFilters();
          }}
          style={{
            background:
              'linear-gradient(135deg, var(--burgundy-main) 0%, var(--burgundy-dark) 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-burgundy)',
          }}
        >
          ✕ {t('filterReset')}
        </button>
      )}
    </div>
  );
}
