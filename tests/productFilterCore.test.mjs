import test from 'node:test';
import assert from 'node:assert/strict';

import {
  countActiveFilters,
  matchesStock,
  matchesTranslatedField,
  matchesWishlist,
  sortProductsByPrice,
} from '../lib/productFilterCore.mjs';

const translate = (value) => {
  const dictionary = {
    cervena: 'Červená',
    modra: 'Modrá',
    mala: 'Malá',
    velka: 'Velká',
  };
  return dictionary[value] ?? String(value ?? '');
};

const baseProduct = {
  id: 'product-1',
  price: 1200,
  quantity: 0,
  color: 'cervena',
  size: 'mala',
  variants: [],
};

test('wishlist filter allows everything when disabled', () => {
  assert.equal(matchesWishlist('product-1', false, []), true);
});

test('wishlist filter only allows saved products when enabled', () => {
  assert.equal(
    matchesWishlist('product-1', true, ['product-1']),
    true
  );
  assert.equal(
    matchesWishlist('product-2', true, ['product-1']),
    false
  );
});

test('stock filter accepts stock on the main product', () => {
  assert.equal(
    matchesStock({ ...baseProduct, quantity: 2 }, true),
    true
  );
});

test('stock filter accepts stock that exists only on a variant', () => {
  assert.equal(
    matchesStock(
      {
        ...baseProduct,
        variants: [{ quantity: 3 }],
      },
      true
    ),
    true
  );
});

test('stock filter rejects a fully sold-out product', () => {
  assert.equal(
    matchesStock(
      {
        ...baseProduct,
        quantity: 0,
        variants: [{ quantity: 0 }, { quantity: 0 }],
      },
      true
    ),
    false
  );
});

test('color filter matches the translated main product color', () => {
  assert.equal(
    matchesTranslatedField(baseProduct, 'color', 'Červená', translate),
    true
  );
});

test('color and size filters can match a variant value', () => {
  const product = {
    ...baseProduct,
    color: 'cervena',
    size: 'mala',
    variants: [
      {
        quantity: 1,
        color: 'modra',
        size: 'velka',
      },
    ],
  };

  assert.equal(
    matchesTranslatedField(product, 'color', 'Modrá', translate),
    true
  );
  assert.equal(
    matchesTranslatedField(product, 'size', 'Velká', translate),
    true
  );
});

test('"all" bypasses translated color and size filtering', () => {
  assert.equal(
    matchesTranslatedField(baseProduct, 'color', 'all', translate),
    true
  );
  assert.equal(
    matchesTranslatedField(baseProduct, 'size', 'all', translate),
    true
  );
});

test('active filter count includes category, stock and custom fields', () => {
  assert.equal(
    countActiveFilters({
      categorySlug: 'tasky',
      color: 'all',
      size: 'Malá',
      inStockOnly: true,
      customFields: {
        Materiál: 'Bavlna',
        Hmotnost: 'all',
      },
    }),
    4
  );
});

test('price sorting is correct and does not mutate the original array', () => {
  const products = [
    { id: 'middle', price: 1200 },
    { id: 'cheap', price: 400 },
    { id: 'expensive', price: 2200 },
  ];

  const lowToHigh = sortProductsByPrice(products, 'price-low');
  const highToLow = sortProductsByPrice(products, 'price-high');

  assert.deepEqual(
    lowToHigh.map((product) => product.id),
    ['cheap', 'middle', 'expensive']
  );
  assert.deepEqual(
    highToLow.map((product) => product.id),
    ['expensive', 'middle', 'cheap']
  );
  assert.deepEqual(
    products.map((product) => product.id),
    ['middle', 'cheap', 'expensive']
  );
});
