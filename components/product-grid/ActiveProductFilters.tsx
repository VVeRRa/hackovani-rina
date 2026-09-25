'use client';

import type { CSSProperties } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { ProductCategoryOption } from '@/lib/productGridUtils';

interface ActiveProductFiltersProps {
  activeFilterCount: number;
  categories: ProductCategoryOption[];
  selectedCategorySlug: string;
  selectedColor: string;
  selectedSize: string;
  selectedCustomFields: Record<string, string>;
  inStockOnly: boolean;
  onCategoryClear: () => void;
  onColorClear: () => void;
  onSizeClear: () => void;
  onCustomFieldClear: (label: string) => void;
  onStockClear: () => void;
  onReset: () => void;
}

const filterPillStyle: CSSProperties = {
  padding: '4px 10px',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.78rem',
  fontWeight: 600,
  background: 'var(--burgundy-subtle)',
  color: 'var(--burgundy-deep)',
  border: '1px solid var(--burgundy-main)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
};

export function ActiveProductFilters({
  activeFilterCount,
  categories,
  selectedCategorySlug,
  selectedColor,
  selectedSize,
  selectedCustomFields,
  inStockOnly,
  onCategoryClear,
  onColorClear,
  onSizeClear,
  onCustomFieldClear,
  onStockClear,
  onReset,
}: ActiveProductFiltersProps) {
  const { t } = useLanguage();

  if (activeFilterCount === 0) return null;

  const categoryName =
    categories.find((category) => category.slug === selectedCategorySlug)?.name ??
    selectedCategorySlug;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}
      >
        {t('activeFiltersLabel')}
      </span>

      {selectedCategorySlug !== 'all' && (
        <button onClick={onCategoryClear} style={filterPillStyle}>
          📂 {t('navCatalog')}: {categoryName} ✕
        </button>
      )}

      {selectedColor !== 'all' && (
        <button onClick={onColorClear} style={filterPillStyle}>
          🎨 {t('specColor')}: {selectedColor} ✕
        </button>
      )}

      {selectedSize !== 'all' && (
        <button onClick={onSizeClear} style={filterPillStyle}>
          📏 {t('specSize')}: {selectedSize} ✕
        </button>
      )}

      {inStockOnly && (
        <button
          onClick={onStockClear}
          style={{
            ...filterPillStyle,
            background: '#E8F5E9',
            color: '#1B5E20',
            border: '1px solid #C8E6C9',
          }}
        >
          ✓ {t('filterInStockOnly')} ✕
        </button>
      )}

      {Object.entries(selectedCustomFields).map(([label, value]) => {
        if (!value || value === 'all') return null;

        return (
          <button
            key={label}
            onClick={() => onCustomFieldClear(label)}
            style={filterPillStyle}
          >
            🏷️ {label}: {value} ✕
          </button>
        );
      })}

      <button
        onClick={onReset}
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--burgundy-main)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        {t('filterReset')}
      </button>
    </div>
  );
}
