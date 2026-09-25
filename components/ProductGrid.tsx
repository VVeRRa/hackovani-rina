'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DatoCategory, DatoProduct } from '@/lib/datocms';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import {
  buildAvailableCategories,
  buildCustomFieldFilters,
  countActiveProductFilters,
  filterAndSortProducts,
  getAvailableProductValues,
  type ProductSortOption,
} from '@/lib/productGridUtils';
import { ProductGridHeader } from './product-grid/ProductGridHeader';
import { ProductCategoryNav } from './product-grid/ProductCategoryNav';
import { ProductGridIndicators } from './product-grid/ProductGridIndicators';
import { ProductGridControlBar } from './product-grid/ProductGridControlBar';
import { ProductFilterPanel } from './product-grid/ProductFilterPanel';
import { ActiveProductFilters } from './product-grid/ActiveProductFilters';
import { ProductGridResults } from './product-grid/ProductGridResults';

interface ProductGridProps {
  products: DatoProduct[];
  categories: DatoCategory[];
  searchTerm?: string;
  onClearSearch?: () => void;
  showOnlyWishlist?: boolean;
  onClearWishlistFilter?: () => void;
}

export function ProductGrid({
  products,
  categories,
  searchTerm = '',
  onClearSearch,
  showOnlyWishlist = false,
  onClearWishlistFilter,
}: ProductGridProps) {
  const { lang, translate } = useLanguage();
  const { wishlist } = useCart();

  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');
  const [sortBy, setSortBy] = useState<ProductSortOption>('default');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCustomFields, setSelectedCustomFields] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedCategorySlug('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setSelectedCustomFields({});
  }, [lang]);

  const availableColors = useMemo(
    () => getAvailableProductValues(products, 'color', translate),
    [products, translate],
  );

  const availableSizes = useMemo(
    () => getAvailableProductValues(products, 'size', translate),
    [products, translate],
  );

  const availableCategories = useMemo(
    () => buildAvailableCategories(products, categories, lang, translate),
    [products, categories, lang, translate],
  );

  const customFieldFilters = useMemo(
    () => buildCustomFieldFilters(products, translate),
    [products, translate],
  );

  const activePropertyFiltersCount = useMemo(
    () =>
      countActiveProductFilters({
        categorySlug: selectedCategorySlug,
        color: selectedColor,
        size: selectedSize,
        inStockOnly,
        customFields: selectedCustomFields,
      }),
    [
      selectedCategorySlug,
      selectedColor,
      selectedSize,
      inStockOnly,
      selectedCustomFields,
    ],
  );

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(
        products,
        {
          categorySlug: selectedCategorySlug,
          color: selectedColor,
          size: selectedSize,
          inStockOnly,
          customFields: selectedCustomFields,
          searchTerm,
          showOnlyWishlist,
          wishlist,
          sortBy,
        },
        lang,
        translate,
      ),
    [
      products,
      selectedCategorySlug,
      selectedColor,
      selectedSize,
      inStockOnly,
      selectedCustomFields,
      searchTerm,
      showOnlyWishlist,
      wishlist,
      sortBy,
      lang,
      translate,
    ],
  );

  const resetAllPropertyFilters = () => {
    setSelectedCategorySlug('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setSelectedCustomFields({});
  };

  const setCustomFieldFilter = (label: string, value: string) => {
    setSelectedCustomFields((previous) => ({
      ...previous,
      [label]: value,
    }));
  };

  return (
    <section
      id="products"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '60px 24px 80px 24px',
        width: '100%',
      }}
    >
      <ProductGridHeader />

      <ProductCategoryNav
        products={products}
        categories={availableCategories}
        selectedCategorySlug={selectedCategorySlug}
        onSelectCategory={setSelectedCategorySlug}
      />

      <ProductGridIndicators
        showOnlyWishlist={showOnlyWishlist}
        onClearWishlistFilter={onClearWishlistFilter}
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
      />

      <ProductGridControlBar
        filteredCount={filteredProducts.length}
        isFilterPanelOpen={isFilterPanelOpen}
        activeFilterCount={activePropertyFiltersCount}
        sortBy={sortBy}
        onToggleFilterPanel={() => setIsFilterPanelOpen((open) => !open)}
        onSortChange={setSortBy}
      />

      <ProductFilterPanel
        isOpen={isFilterPanelOpen}
        activeFilterCount={activePropertyFiltersCount}
        categories={availableCategories}
        colors={availableColors}
        sizes={availableSizes}
        customFieldFilters={customFieldFilters}
        selectedCategorySlug={selectedCategorySlug}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        selectedCustomFields={selectedCustomFields}
        inStockOnly={inStockOnly}
        onCategoryChange={setSelectedCategorySlug}
        onColorChange={setSelectedColor}
        onSizeChange={setSelectedSize}
        onCustomFieldChange={setCustomFieldFilter}
        onStockChange={setInStockOnly}
        onReset={resetAllPropertyFilters}
      />

      <ActiveProductFilters
        activeFilterCount={activePropertyFiltersCount}
        categories={availableCategories}
        selectedCategorySlug={selectedCategorySlug}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        selectedCustomFields={selectedCustomFields}
        inStockOnly={inStockOnly}
        onCategoryClear={() => setSelectedCategorySlug('all')}
        onColorClear={() => setSelectedColor('all')}
        onSizeClear={() => setSelectedSize('all')}
        onCustomFieldClear={(label) => setCustomFieldFilter(label, 'all')}
        onStockClear={() => setInStockOnly(false)}
        onReset={resetAllPropertyFilters}
      />

      <ProductGridResults
        products={filteredProducts}
        showOnlyWishlist={showOnlyWishlist}
        searchTerm={searchTerm}
        activeFilterCount={activePropertyFiltersCount}
        onClearWishlistFilter={onClearWishlistFilter}
        onClearSearch={onClearSearch}
        onResetFilters={resetAllPropertyFilters}
      />
    </section>
  );
}
