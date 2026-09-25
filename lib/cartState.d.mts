export interface CartProductLike {
  id: string;
  price?: number | null;
}

export interface CartVariantLike {
  id: string;
  price?: number | null;
}

export interface CartStateItem<
  TProduct extends CartProductLike = CartProductLike,
  TVariant extends CartVariantLike = CartVariantLike,
> {
  id: string;
  product: TProduct;
  selectedVariant?: TVariant;
  quantity: number;
}

export function parseStoredArray<T = unknown>(rawValue: string | null): T[];

export function addCartItem<
  TProduct extends CartProductLike,
  TVariant extends CartVariantLike,
>(
  cart: CartStateItem<TProduct, TVariant>[],
  product: TProduct,
  selectedVariant?: TVariant,
  quantity?: number,
): CartStateItem<TProduct, TVariant>[];

export function removeCartItem<T extends { id: string }>(
  cart: T[],
  cartItemId: string,
): T[];

export function updateCartItemQuantity<T extends { id: string; quantity: number }>(
  cart: T[],
  cartItemId: string,
  delta: number,
): T[];

export function toggleWishlistItem(
  wishlist: string[],
  productId: string,
): string[];

export function calculateCartTotals(
  cart: Array<{
    product: { price?: number | null };
    selectedVariant?: { price?: number | null };
    quantity: number;
  }>,
): { items: number; price: number };
