const MAX_BUCKETS = 1000;
const buckets = new Map();

function normalizeClientKey(clientKey) {
  return typeof clientKey === 'string' && clientKey.trim()
    ? clientKey.trim()
    : 'unknown';
}

function cleanupExpired(now) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function getRequestClientKey(headers) {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get('x-real-ip')?.trim();
  return realIp || 'unknown';
}

export function checkRequestRateLimit(
  { namespace, clientKey, maxRequests, windowMs },
  now = Date.now()
) {
  if (!namespace || !Number.isFinite(maxRequests) || maxRequests < 1 || !Number.isFinite(windowMs) || windowMs < 1) {
    throw new Error('Invalid rate-limit configuration.');
  }

  cleanupExpired(now);

  const normalizedClientKey = normalizeClientKey(clientKey);
  const bucketKey = `${namespace}:${normalizedClientKey}`;
  const current = buckets.get(bucketKey);

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey) buckets.delete(oldestKey);
    }

    buckets.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: Math.max(0, maxRequests - 1),
    };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
      remaining: 0,
    };
  }

  current.count += 1;

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, maxRequests - current.count),
  };
}

export function resetRequestRateLimit(namespace, clientKey) {
  buckets.delete(`${namespace}:${normalizeClientKey(clientKey)}`);
}

export function resetAllRequestRateLimitsForTests() {
  buckets.clear();
}
