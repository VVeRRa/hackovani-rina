const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;

const rateLimitBuckets = new Map();

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactPayload(body, now = Date.now()) {
  const name = cleanString(body?.name);
  const email = cleanString(body?.email);
  const message = cleanString(body?.message);
  const contactGuard = cleanString(body?.contactGuard ?? body?.website);
  const formStartedAt =
    typeof body?.formStartedAt === 'number' && Number.isFinite(body.formStartedAt)
      ? body.formStartedAt
      : undefined;

  if (contactGuard) {
    return { ok: false, kind: 'spam' };
  }

  if (formStartedAt !== undefined && formStartedAt > now + 60_000) {
    return { ok: false, kind: 'spam' };
  }

  if (!name || !email || !message) {
    return { ok: false, kind: 'required' };
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return { ok: false, kind: 'too_long' };
  }

  if (!isValidEmail(email)) {
    return { ok: false, kind: 'invalid_email' };
  }

  return {
    ok: true,
    value: { name, email, message },
  };
}

export function getContactClientKey(headers) {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get('x-real-ip')?.trim();
  return realIp || null;
}

export function checkContactRateLimit(clientKey, now = Date.now()) {
  if (!clientKey) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }

  const current = rateLimitBuckets.get(clientKey);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export const contactProtectionConfig = {
  maxNameLength: MAX_NAME_LENGTH,
  maxEmailLength: MAX_EMAIL_LENGTH,
  maxMessageLength: MAX_MESSAGE_LENGTH,
  rateLimitWindowMs: RATE_LIMIT_WINDOW_MS,
  rateLimitMaxSubmissions: RATE_LIMIT_MAX_SUBMISSIONS,
};
