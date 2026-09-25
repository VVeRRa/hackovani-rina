import test from 'node:test';
import assert from 'node:assert/strict';

import {
  checkContactRateLimit,
  contactProtectionConfig,
  getContactClientKey,
  validateContactPayload,
} from '../lib/contactProtection.mjs';

test('accepts and trims a valid contact payload', () => {
  const now = 10_000;
  const result = validateContactPayload(
    {
      name: '  Jana  ',
      email: ' jana@example.com ',
      message: '  Dobrý den  ',
      contactGuard: '',
      formStartedAt: now - 2_000,
    },
    now
  );

  assert.deepEqual(result, {
    ok: true,
    value: {
      name: 'Jana',
      email: 'jana@example.com',
      message: 'Dobrý den',
    },
  });
});

test('rejects missing required fields', () => {
  const result = validateContactPayload({
    name: '',
    email: 'jana@example.com',
    message: 'Dobrý den',
  });

  assert.deepEqual(result, { ok: false, kind: 'required' });
});

test('rejects malformed email addresses', () => {
  const result = validateContactPayload({
    name: 'Jana',
    email: 'neplatny-email',
    message: 'Dobrý den',
  });

  assert.deepEqual(result, { ok: false, kind: 'invalid_email' });
});

test('rejects payloads that exceed configured lengths', () => {
  const result = validateContactPayload({
    name: 'x'.repeat(contactProtectionConfig.maxNameLength + 1),
    email: 'jana@example.com',
    message: 'Dobrý den',
  });

  assert.deepEqual(result, { ok: false, kind: 'too_long' });
});

test('silently identifies a filled honeypot as spam', () => {
  const result = validateContactPayload({
    name: 'Bot',
    email: 'bot@example.com',
    message: 'spam',
    contactGuard: 'filled-by-bot',
  });

  assert.deepEqual(result, { ok: false, kind: 'spam' });
});

test('keeps rejecting the legacy website honeypot field', () => {
  const result = validateContactPayload({
    name: 'Bot',
    email: 'bot@example.com',
    message: 'spam',
    website: 'https://spam.example',
  });

  assert.deepEqual(result, { ok: false, kind: 'spam' });
});

test('accepts fast submissions so browser autofill is not treated as spam', () => {
  const now = 10_000;
  const result = validateContactPayload(
    {
      name: 'Jana',
      email: 'jana@example.com',
      message: 'Dobrý den',
      formStartedAt: now - 100,
    },
    now
  );

  assert.equal(result.ok, true);
});

test('rejects impossible future form timestamps as spam', () => {
  const now = 10_000;
  const result = validateContactPayload(
    {
      name: 'Jana',
      email: 'jana@example.com',
      message: 'Dobrý den',
      formStartedAt: now + 60_001,
    },
    now
  );

  assert.deepEqual(result, { ok: false, kind: 'spam' });
});

test('keeps compatibility with clients that do not send timing metadata', () => {
  const result = validateContactPayload({
    name: 'Jana',
    email: 'jana@example.com',
    message: 'Dobrý den',
  });

  assert.equal(result.ok, true);
});

test('extracts the first forwarded client address', () => {
  const headers = new Headers({
    'x-forwarded-for': '203.0.113.42, 10.0.0.1',
    'x-real-ip': '198.51.100.4',
  });

  assert.equal(getContactClientKey(headers), '203.0.113.42');
});

test('limits repeated submissions within the same window', () => {
  const clientKey = 'test-client-rate-limit';
  const now = 50_000;

  for (let i = 0; i < contactProtectionConfig.rateLimitMaxSubmissions; i += 1) {
    assert.equal(checkContactRateLimit(clientKey, now).allowed, true);
  }

  const blocked = checkContactRateLimit(clientKey, now);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);

  const afterWindow = checkContactRateLimit(
    clientKey,
    now + contactProtectionConfig.rateLimitWindowMs + 1
  );
  assert.equal(afterWindow.allowed, true);
});
