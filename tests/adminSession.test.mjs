import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createSessionToken,
  verifyPasswordValue,
  verifySessionToken,
} from '../lib/adminSession.mjs';

const password = 'correct horse battery staple';
const secret = 'test-session-secret-that-is-long-enough';
const maxAgeSeconds = 8 * 60 * 60;
const now = 1_800_000_000_000;

test('accepts only the exact admin password', () => {
  assert.equal(verifyPasswordValue(password, password), true);
  assert.equal(verifyPasswordValue('wrong password', password), false);
  assert.equal(verifyPasswordValue('', password), false);
});

test('creates a session token that verifies before expiry', () => {
  const token = createSessionToken(password, secret, maxAgeSeconds, now);

  assert.equal(
    verifySessionToken(token, password, secret, now + 60_000),
    true
  );
});

test('rejects an expired admin session', () => {
  const token = createSessionToken(password, secret, maxAgeSeconds, now);

  assert.equal(
    verifySessionToken(
      token,
      password,
      secret,
      now + maxAgeSeconds * 1000
    ),
    false
  );
});

test('rejects a tampered session signature', () => {
  const token = createSessionToken(password, secret, maxAgeSeconds, now);
  const [expiresAt, signature] = token.split('.');
  const replacement = signature[0] === 'a' ? 'b' : 'a';
  const tampered = `${expiresAt}.${replacement}${signature.slice(1)}`;

  assert.equal(
    verifySessionToken(tampered, password, secret, now + 1000),
    false
  );
});

test('invalidates sessions when password or session secret changes', () => {
  const token = createSessionToken(password, secret, maxAgeSeconds, now);

  assert.equal(
    verifySessionToken(token, 'new password', secret, now + 1000),
    false
  );
  assert.equal(
    verifySessionToken(token, password, 'new secret', now + 1000),
    false
  );
});

test('rejects malformed session tokens', () => {
  assert.equal(verifySessionToken('', password, secret, now), false);
  assert.equal(verifySessionToken('abc', password, secret, now), false);
  assert.equal(
    verifySessionToken('123.signature.extra', password, secret, now),
    false
  );
});
