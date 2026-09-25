export function parseStoredArray(rawValue) {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addCartItem(cart, product, selectedVariant, quantity = 1) {
  const variantId = selectedVariant ? selectedVariant.id : 'main';
  const cartItemId = `${product.id}-${variantId}`;
  const existingIndex = cart.findIndex((item) => item.id === cartItemId);

  if (existingIndex > -1) {
    return cart.map((item, index) =>
      index === existingIndex
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [
    ...cart,
    {
      id: cartItemId,
      product,
      selectedVariant,
      quantity,
    },
  ];
}

export function removeCartItem(cart, cartItemId) {
  return cart.filter((item) => item.id !== cartItemId);
}

export function updateCartItemQuantity(cart, cartItemId, delta) {
  return cart
    .map((item) => {
      if (item.id !== cartItemId) return item;

      const nextQuantity = item.quantity + delta;
      return nextQuantity > 0
        ? { ...item, quantity: nextQuantity }
        : null;
    })
    .filter(Boolean);
}

export function toggleWishlistItem(wishlist, productId) {
  return wishlist.includes(productId)
    ? wishlist.filter((id) => id !== productId)
    : [...wishlist, productId];
}

export function calculateCartTotals(cart) {
  return cart.reduce(
    (totals, item) => {
      const unitPrice = item.selectedVariant?.price || item.product.price || 0;
      return {
        items: totals.items + item.quantity,
        price: totals.price + unitPrice * item.quantity,
      };
    },
    { items: 0, price: 0 }
  );
}
