'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { ProductSortOption } from '@/lib/productGridUtils';

interface ProductGridControlBarProps {
  filteredCount: number;
  isFilterPanelOpen: boolean;
  activeFilterCount: number;
  sortBy: ProductSortOption;
  onToggleFilterPanel: () => void;
  onSortChange: (sort: ProductSortOption) => void;
}

export function ProductGridControlBar({
  filteredCount,
  isFilterPanelOpen,
  activeFilterCount,
  sortBy,
  onToggleFilterPanel,
  onSortChange,
}: ProductGridControlBarProps) {
  const { t } = useLanguage();
  const filtersActive = isFilterPanelOpen || activeFilterCount > 0;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        padding: '14px 20px',
        background: 'var(--card-bg-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          background: 'var(--bg-cream)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-medium)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        <span>📦</span>
        <span>
          {t('showingProducts')}{' '}
          <strong style={{ color: 'var(--burgundy-main)', fontWeight: 800 }}>
            {filteredCount}
          </strong>{' '}
          {t('productsCountLabel')}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={onToggleFilterPanel}
          aria-expanded={isFilterPanelOpen}
          aria-controls="product-filter-panel"
          style={{
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            border: filtersActive
              ? '2px solid var(--burgundy-main)'
              : '1px solid var(--border-medium)',
            background: filtersActive ? 'var(--burgundy-subtle)' : '#FAF8F5',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--burgundy-deep)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          }}
        >
          <span>🎛️</span>
          <span>{t('filterToggleBtn')}</span>
          {activeFilterCount > 0 && (
            <span
              style={{
                background: 'var(--burgundy-main)',
                color: 'white',
                borderRadius: '10px',
                padding: '1px 7px',
                fontSize: '0.74rem',
                fontWeight: 800,
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            {t('sortLabel')}
          </span>
          <select
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as ProductSortOption)
            }
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-medium)',
              background: '#FAF8F5',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--burgundy-deep)',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <option value="default">{t('sortDefault')}</option>
            <option value="price-low">{t('sortPriceLow')}</option>
            <option value="price-high">{t('sortPriceHigh')}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
