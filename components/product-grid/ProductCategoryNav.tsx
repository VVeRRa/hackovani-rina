'use client';

import type { CSSProperties } from 'react';
import type { DatoProduct } from '@/lib/datocms';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryBadgeIcon } from '@/lib/i18n';
import {
  countProductsInCategory,
  type ProductCategoryOption,
} from '@/lib/productGridUtils';

interface ProductCategoryNavProps {
  products: DatoProduct[];
  categories: ProductCategoryOption[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
}

export function ProductCategoryNav({
  products,
  categories,
  selectedCategorySlug,
  onSelectCategory,
}: ProductCategoryNavProps) {
  const { lang, t } = useLanguage();

  if (categories.length === 0) return null;

  const buttonStyle = (active: boolean): CSSProperties => ({
    padding: '10px 22px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    fontSize: '0.9rem',
    background: active
      ? 'linear-gradient(135deg, var(--burgundy-main) 0%, var(--burgundy-dark) 100%)'
      : 'var(--card-bg-subtle)',
    color: active ? 'white' : 'var(--text-primary)',
    border: `1px solid ${active ? 'transparent' : 'var(--border-light)'}`,
    boxShadow: active ? 'var(--shadow-burgundy)' : 'none',
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '32px',
      }}
    >
      <button
        onClick={() => onSelectCategory('all')}
        style={buttonStyle(selectedCategorySlug === 'all')}
      >
        {t('allCategories')} ({products.length})
      </button>

      {categories.map((category) => {
        const count = countProductsInCategory(products, category.slug, lang);
        const active = selectedCategorySlug === category.slug;
        const icon = getCategoryBadgeIcon(category.name);

        return (
          <button
            key={category.slug}
            onClick={() => onSelectCategory(category.slug)}
            style={buttonStyle(active)}
          >
            {icon} {category.name} ({count})
          </button>
        );
      })}
    </div>
  );
}
