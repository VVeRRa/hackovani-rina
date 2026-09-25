export function matchesWishlist(productId, showOnlyWishlist, wishlist) {
  return !showOnlyWishlist || wishlist.includes(productId);
}

export function matchesStock(product, inStockOnly) {
  if (!inStockOnly) return true;

  const productStock = product.quantity ?? 0;
  const hasVariantStock = (product.variants ?? []).some(
    (variant) => (variant.quantity ?? 0) > 0
  );

  return productStock > 0 || hasVariantStock;
}

export function matchesTranslatedField(
  product,
  field,
  selectedValue,
  translate
) {
  if (selectedValue === 'all') return true;

  const productValue = product[field];
  if (productValue && translate(productValue) === selectedValue) {
    return true;
  }

  return (product.variants ?? []).some((variant) => {
    const variantValue = variant[field];
    return Boolean(variantValue) && translate(variantValue) === selectedValue;
  });
}

export function countActiveFilters(filters) {
  let count = 0;

  if (filters.categorySlug !== 'all') count += 1;
  if (filters.color !== 'all') count += 1;
  if (filters.size !== 'all') count += 1;
  if (filters.inStockOnly) count += 1;

  Object.values(filters.customFields ?? {}).forEach((value) => {
    if (value && value !== 'all') count += 1;
  });

  return count;
}

export function sortProductsByPrice(products, sortBy) {
  const result = [...products];

  if (sortBy === 'price-low') {
    return result.sort((a, b) => a.price - b.price);
  }

  if (sortBy === 'price-high') {
    return result.sort((a, b) => b.price - a.price);
  }

  return result;
}
