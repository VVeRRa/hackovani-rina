'use client';

import type { CSSProperties } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type {
  ProductCategoryOption,
  ProductCustomFieldFilter,
} from '@/lib/productGridUtils';

interface ProductFilterPanelProps {
  isOpen: boolean;
  activeFilterCount: number;
  categories: ProductCategoryOption[];
  colors: string[];
  sizes: string[];
  customFieldFilters: ProductCustomFieldFilter[];
  selectedCategorySlug: string;
  selectedColor: string;
  selectedSize: string;
  selectedCustomFields: Record<string, string>;
  inStockOnly: boolean;
  onCategoryChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onCustomFieldChange: (label: string, value: string) => void;
  onStockChange: (value: boolean) => void;
  onReset: () => void;
}

const selectStyle: CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-medium)',
  background: 'white',
  fontSize: '0.85rem',
  color: 'var(--text-primary)',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--burgundy-deep)',
  marginBottom: '6px',
};

export function ProductFilterPanel({
  isOpen,
  activeFilterCount,
  categories,
  colors,
  sizes,
  customFieldFilters,
  selectedCategorySlug,
  selectedColor,
  selectedSize,
  selectedCustomFields,
  inStockOnly,
  onCategoryChange,
  onColorChange,
  onSizeChange,
  onCustomFieldChange,
  onStockChange,
  onReset,
}: ProductFilterPanelProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      id="product-filter-panel"
      style={{
        background: 'var(--bg-cream)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.05rem',
            color: 'var(--burgundy-deep)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🎛️</span>
          <span>{t('filterTitle')}</span>
          {activeFilterCount > 0 && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--burgundy-rose)',
              }}
            >
              ({activeFilterCount} {t('filterActiveCount')})
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            style={{
              background: 'white',
              border: '1px solid var(--border-medium)',
              color: 'var(--burgundy-main)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✕ {t('filterReset')}
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {categories.length > 0 && (
          <div>
            <label htmlFor="product-filter-category" style={labelStyle}>
              📂 {t('navCatalog')}
            </label>
            <select
              id="product-filter-category"
              value={selectedCategorySlug}
              onChange={(event) => onCategoryChange(event.target.value)}
              style={{
                ...selectStyle,
                fontWeight: selectedCategorySlug !== 'all' ? 700 : 400,
              }}
            >
              <option value="all">{t('filterAll')}</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {colors.length > 0 && (
          <div>
            <label htmlFor="product-filter-color" style={labelStyle}>
              🎨 {t('specColor')}
            </label>
            <select
              id="product-filter-color"
              value={selectedColor}
              onChange={(event) => onColorChange(event.target.value)}
              style={{
                ...selectStyle,
                fontWeight: selectedColor !== 'all' ? 700 : 400,
              }}
            >
              <option value="all">{t('filterAll')}</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        )}

        {sizes.length > 0 && (
          <div>
            <label htmlFor="product-filter-size" style={labelStyle}>
              📏 {t('specSize')}
            </label>
            <select
              id="product-filter-size"
              value={selectedSize}
              onChange={(event) => onSizeChange(event.target.value)}
              style={{
                ...selectStyle,
                fontWeight: selectedSize !== 'all' ? 700 : 400,
              }}
            >
              <option value="all">{t('filterAll')}</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {customFieldFilters.map(({ label, options }, index) => {
          const currentValue = selectedCustomFields[label] || 'all';
          const inputId = `product-filter-custom-${index}`;

          return (
            <div key={label}>
              <label htmlFor={inputId} style={labelStyle}>
                🏷️ {label}
              </label>
              <select
                id={inputId}
                value={currentValue}
                onChange={(event) =>
                  onCustomFieldChange(label, event.target.value)
                }
                style={{
                  ...selectStyle,
                  fontWeight: currentValue !== 'all' ? 700 : 400,
                }}
              >
                <option value="all">{t('filterAll')}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={() => onStockChange(!inStockOnly)}
            aria-pressed={inStockOnly}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: inStockOnly
                ? '2px solid #1B5E20'
                : '1px solid var(--border-medium)',
              background: inStockOnly ? '#E8F5E9' : 'white',
              color: inStockOnly ? '#1B5E20' : 'var(--text-primary)',
              fontWeight: inStockOnly ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '38px',
            }}
          >
            <span>{inStockOnly ? '✓' : '☐'}</span>
            <span>{t('filterInStockOnly')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
