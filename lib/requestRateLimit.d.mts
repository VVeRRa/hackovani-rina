export interface RequestRateLimitConfig {
  namespace: string;
  clientKey?: string | null;
  maxRequests: number;
  windowMs: number;
}

export interface RequestRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

export function getRequestClientKey(headers: Headers): string;

export function checkRequestRateLimit(
  config: RequestRateLimitConfig,
  now?: number
): RequestRateLimitResult;

export function resetRequestRateLimit(
  namespace: string,
  clientKey?: string | null
): void;

export function resetAllRequestRateLimitsForTests(): void;
