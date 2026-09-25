import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

function sha256(value) {
  return createHash('sha256').update(value).digest();
}

function safeEqualStrings(left, right) {
  return timingSafeEqual(sha256(left), sha256(right));
}

function passwordFingerprint(password) {
  return createHash('sha256').update(password).digest('hex');
}

function signExpiry(expiresAt, password, secret) {
  return createHmac('sha256', secret)
    .update(`rina-admin-v1:${expiresAt}:${passwordFingerprint(password)}`)
    .digest('hex');
}

export function verifyPasswordValue(candidate, password) {
  if (!candidate || !password) return false;
  return safeEqualStrings(candidate, password);
}

export function createSessionToken(
  password,
  secret,
  maxAgeSeconds,
  now = Date.now()
) {
  const expiresAt = now + maxAgeSeconds * 1000;
  return `${expiresAt}.${signExpiry(expiresAt, password, secret)}`;
}

export function verifySessionToken(
  token,
  password,
  secret,
  now = Date.now()
) {
  if (!token || !password || !secret) return false;

  const [expiresRaw, signature, extra] = token.split('.');
  if (!expiresRaw || !signature || extra) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;

  const expectedSignature = signExpiry(expiresAt, password, secret);
  return safeEqualStrings(signature, expectedSignature);
}
