import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addCartItem,
  calculateCartTotals,
  parseStoredArray,
  removeCartItem,
  toggleWishlistItem,
  updateCartItemQuantity,
} from '../lib/cartState.mjs';

const product = {
  id: 'product-1',
  price: 1200,
  title: 'Kabelka',
};

const variant = {
  id: 'variant-red',
  price: 1450,
  color: 'Červená',
};

test('hydrates a persisted array and safely ignores invalid storage values', () => {
  assert.deepEqual(parseStoredArray('["a","b"]'), ['a', 'b']);
  assert.deepEqual(parseStoredArray('{"not":"an array"}'), []);
  assert.deepEqual(parseStoredArray('broken json'), []);
  assert.deepEqual(parseStoredArray(null), []);
});

test('adds a main product with the stable main cart id', () => {
  const cart = addCartItem([], product, undefined, 2);

  assert.equal(cart.length, 1);
  assert.equal(cart[0].id, 'product-1-main');
  assert.equal(cart[0].quantity, 2);
  assert.equal(cart[0].product, product);
});

test('adds a variant as a separate cart line', () => {
  const cart = addCartItem([], product, variant, 1);

  assert.equal(cart.length, 1);
  assert.equal(cart[0].id, 'product-1-variant-red');
  assert.equal(cart[0].selectedVariant, variant);
});

test('merges repeated adds of the same product choice', () => {
  const once = addCartItem([], product, variant, 1);
  const twice = addCartItem(once, product, variant, 3);

  assert.equal(twice.length, 1);
  assert.equal(twice[0].quantity, 4);
});

test('keeps main product and variant as separate cart lines', () => {
  const withMain = addCartItem([], product, undefined, 1);
  const withVariant = addCartItem(withMain, product, variant, 1);

  assert.deepEqual(
    withVariant.map((item) => item.id),
    ['product-1-main', 'product-1-variant-red']
  );
});

test('updates quantity and removes a line when quantity reaches zero', () => {
  const initial = addCartItem([], product, undefined, 2);
  const decremented = updateCartItemQuantity(initial, 'product-1-main', -1);
  const removed = updateCartItemQuantity(decremented, 'product-1-main', -1);

  assert.equal(decremented[0].quantity, 1);
  assert.deepEqual(removed, []);
});

test('removes only the requested cart line', () => {
  const withMain = addCartItem([], product, undefined, 1);
  const withVariant = addCartItem(withMain, product, variant, 1);
  const result = removeCartItem(withVariant, 'product-1-main');

  assert.deepEqual(result.map((item) => item.id), ['product-1-variant-red']);
});

test('toggles wishlist ids without duplicating them', () => {
  const added = toggleWishlistItem([], 'product-1');
  const removed = toggleWishlistItem(added, 'product-1');

  assert.deepEqual(added, ['product-1']);
  assert.deepEqual(removed, []);
});

test('calculates item count and uses variant price when selected', () => {
  const mainLine = addCartItem([], product, undefined, 2);
  const cart = addCartItem(mainLine, product, variant, 1);

  assert.deepEqual(calculateCartTotals(cart), {
    items: 3,
    price: 3850,
  });
});
