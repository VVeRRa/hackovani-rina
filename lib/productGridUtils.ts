import type { DatoCategory, DatoProduct } from '@/lib/datocms';
import {
  getAllSearchableStrings,
  getProductCategoryLabels,
  normalizeForSearch,
  slugify,
  type Language,
} from '@/lib/i18n';
import { isStandardKey } from '@/lib/productUtils';
import {
  countActiveFilters,
  matchesStock,
  matchesTranslatedField,
  matchesWishlist,
  sortProductsByPrice,
} from '@/lib/productFilterCore.mjs';

export type TranslateProductValue = (value: unknown) => string;
export type ProductSortOption = 'default' | 'price-low' | 'price-high';

export interface ProductCategoryOption {
  slug: string;
  name: string;
}

export interface ProductCustomFieldFilter {
  label: string;
  options: string[];
}

export interface ProductFilterState {
  categorySlug: string;
  color: string;
  size: string;
  inStockOnly: boolean;
  customFields: Record<string, string>;
}

export interface ProductFilterCriteria extends ProductFilterState {
  searchTerm: string;
  showOnlyWishlist: boolean;
  wishlist: string[];
  sortBy: ProductSortOption;
}

export function doesProductMatchSearch(
  product: DatoProduct,
  searchTerm: string,
): boolean {
  if (!searchTerm.trim()) return true;

  const tokens = normalizeForSearch(searchTerm).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const searchableTexts: string[] = [
    ...getAllSearchableStrings(product.title),
    ...getAllSearchableStrings(product.description),
  ];

  if (product.slug) searchableTexts.push(product.slug);
  if (product.color) searchableTexts.push(...getAllSearchableStrings(product.color));
  if (product.size) searchableTexts.push(...getAllSearchableStrings(product.size));

  product.categoryNames.forEach((name) => {
    searchableTexts.push(...getAllSearchableStrings(name));
  });
  product.categorySlugs.forEach((slug) => searchableTexts.push(slug));

  const addCustomFields = (fields: DatoProduct['customFields']) => {
    fields?.forEach((field) => {
      if (isStandardKey(field.key) || isStandardKey(field.label)) return;
      searchableTexts.push(...getAllSearchableStrings(field.label));
      searchableTexts.push(...getAllSearchableStrings(field.value));
    });
  };

  addCustomFields(product.customFields);

  product.variants.forEach((variant) => {
    if (variant.color) searchableTexts.push(...getAllSearchableStrings(variant.color));
    if (variant.size) searchableTexts.push(...getAllSearchableStrings(variant.size));
    addCustomFields(variant.customFields);
  });

  const normalizedBlob = searchableTexts.map(normalizeForSearch).join(' ');
  return tokens.every((token) => normalizedBlob.includes(token));
}

export function getAvailableProductValues(
  products: DatoProduct[],
  field: 'color' | 'size',
  translate: TranslateProductValue,
): string[] {
  const values = new Set<string>();

  products.forEach((product) => {
    const productValue = product[field];
    if (productValue) values.add(translate(productValue));

    product.variants.forEach((variant) => {
      const variantValue = variant[field];
      if (variantValue) values.add(translate(variantValue));
    });
  });

  return Array.from(values).filter(Boolean);
}

export function buildAvailableCategories(
  products: DatoProduct[],
  categories: DatoCategory[],
  lang: Language,
  translate: TranslateProductValue,
): ProductCategoryOption[] {
  const options = new Map<string, ProductCategoryOption>();

  categories.forEach((category) => {
    const name = translate(category.name);
    const slug = category.slug || slugify(name);
    if (slug && name) options.set(slug, { slug, name });
  });

  products.forEach((product) => {
    getProductCategoryLabels(product, lang).forEach((label) => {
      const slug = slugify(label);
      if (slug && !options.has(slug)) {
        options.set(slug, { slug, name: label });
      }
    });

    product.categoryNames.forEach((categoryName, index) => {
      const name = translate(categoryName);
      const slug = product.categorySlugs[index] || slugify(name);
      if (slug && !options.has(slug)) {
        options.set(slug, { slug, name });
      }
    });
  });

  return Array.from(options.values());
}

export function buildCustomFieldFilters(
  products: DatoProduct[],
  translate: TranslateProductValue,
): ProductCustomFieldFilter[] {
  const optionsByLabel = new Map<string, Set<string>>();

  products.forEach((product) => {
    const fields = [
      ...(product.customFields ?? []),
      ...product.variants.flatMap((variant) => variant.customFields ?? []),
    ];

    fields.forEach((field) => {
      if (isStandardKey(field.key) || isStandardKey(field.label)) return;

      const label = translate(field.label);
      const value = translate(field.value);
      if (!label || !value) return;

      const values = optionsByLabel.get(label) ?? new Set<string>();
      values.add(value);
      optionsByLabel.set(label, values);
    });
  });

  return Array.from(optionsByLabel.entries())
    .map(([label, values]) => ({
      label,
      options: Array.from(values).filter(Boolean),
    }))
    .filter(({ options }) => options.length > 0);
}

export function countActiveProductFilters(filters: ProductFilterState): number {
  return countActiveFilters(filters);
}

export function productMatchesCategory(
  product: DatoProduct,
  categorySlug: string,
  lang: Language,
): boolean {
  if (categorySlug === 'all') return true;
  if (product.categorySlugs.includes(categorySlug)) return true;
  if (product.categoryNames.some((name) => slugify(name) === categorySlug)) return true;

  return getProductCategoryLabels(product, lang)
    .some((label) => slugify(label) === categorySlug);
}

function productMatchesCustomFields(
  product: DatoProduct,
  selectedCustomFields: Record<string, string>,
  translate: TranslateProductValue,
): boolean {
  return Object.entries(selectedCustomFields).every(([selectedLabel, selectedValue]) => {
    if (!selectedValue || selectedValue === 'all') return true;

    const matchesField = (field: NonNullable<DatoProduct['customFields']>[number]) =>
      !isStandardKey(field.key) &&
      !isStandardKey(field.label) &&
      translate(field.label) === selectedLabel &&
      translate(field.value) === selectedValue;

    if (product.customFields?.some(matchesField)) return true;
    return product.variants.some((variant) => variant.customFields?.some(matchesField));
  });
}

export function filterAndSortProducts(
  products: DatoProduct[],
  criteria: ProductFilterCriteria,
  lang: Language,
  translate: TranslateProductValue,
): DatoProduct[] {
  const filtered = products.filter((product) => {
    const matchesWishlistFilter = matchesWishlist(
      product.id,
      criteria.showOnlyWishlist,
      criteria.wishlist,
    );
    const matchesStockFilter = matchesStock(product, criteria.inStockOnly);
    const matchesColor = matchesTranslatedField(
      product,
      'color',
      criteria.color,
      translate,
    );
    const matchesSize = matchesTranslatedField(
      product,
      'size',
      criteria.size,
      translate,
    );

    return (
      productMatchesCategory(product, criteria.categorySlug, lang) &&
      doesProductMatchSearch(product, criteria.searchTerm) &&
      matchesWishlistFilter &&
      matchesStockFilter &&
      matchesColor &&
      matchesSize &&
      productMatchesCustomFields(product, criteria.customFields, translate)
    );
  });

  return sortProductsByPrice(filtered, criteria.sortBy);
}

export function countProductsInCategory(
  products: DatoProduct[],
  categorySlug: string,
  lang: Language,
): number {
  return products.filter((product) =>
    productMatchesCategory(product, categorySlug, lang),
  ).length;
}
