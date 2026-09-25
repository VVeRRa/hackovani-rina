export interface ProductLike {
  id: string;
  price: number;
  quantity?: number | null;
  color?: unknown;
  size?: unknown;
  variants?: Array<{
    quantity?: number | null;
    color?: unknown;
    size?: unknown;
  }>;
}

export interface FilterStateLike {
  categorySlug: string;
  color: string;
  size: string;
  inStockOnly: boolean;
  customFields?: Record<string, string>;
}

export function matchesWishlist(
  productId: string,
  showOnlyWishlist: boolean,
  wishlist: string[],
): boolean;

export function matchesStock(
  product: ProductLike,
  inStockOnly: boolean,
): boolean;

export function matchesTranslatedField(
  product: ProductLike,
  field: 'color' | 'size',
  selectedValue: string,
  translate: (value: unknown) => string,
): boolean;

export function countActiveFilters(
  filters: FilterStateLike,
): number;

export function sortProductsByPrice<T extends { price: number }>(
  products: T[],
  sortBy: 'default' | 'price-low' | 'price-high',
): T[];
