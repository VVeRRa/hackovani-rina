import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkRequestRateLimit,
  getRequestClientKey,
  resetAllRequestRateLimitsForTests,
  resetRequestRateLimit,
} from '../lib/requestRateLimit.mjs';

test.beforeEach(() => {
  resetAllRequestRateLimitsForTests();
});

test('extracts the first forwarded client address', () => {
  const headers = new Headers({
    'x-forwarded-for': '203.0.113.10, 10.0.0.1',
  });

  assert.equal(getRequestClientKey(headers), '203.0.113.10');
});

test('falls back to x-real-ip and then a shared unknown key', () => {
  assert.equal(
    getRequestClientKey(new Headers({ 'x-real-ip': '198.51.100.7' })),
    '198.51.100.7'
  );
  assert.equal(getRequestClientKey(new Headers()), 'unknown');
});

test('blocks requests after the configured limit until the window resets', () => {
  const config = {
    namespace: 'test',
    clientKey: 'client-1',
    maxRequests: 2,
    windowMs: 10_000,
  };

  assert.equal(checkRequestRateLimit(config, 1_000).allowed, true);
  assert.equal(checkRequestRateLimit(config, 2_000).allowed, true);

  const blocked = checkRequestRateLimit(config, 3_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 8);

  assert.equal(checkRequestRateLimit(config, 11_001).allowed, true);
});

test('reset clears one client bucket', () => {
  const config = {
    namespace: 'login',
    clientKey: 'client-2',
    maxRequests: 1,
    windowMs: 10_000,
  };

  assert.equal(checkRequestRateLimit(config, 1_000).allowed, true);
  assert.equal(checkRequestRateLimit(config, 2_000).allowed, false);

  resetRequestRateLimit('login', 'client-2');

  assert.equal(checkRequestRateLimit(config, 2_001).allowed, true);
});
