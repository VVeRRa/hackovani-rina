export interface ValidContactPayload {
  name: string;
  email: string;
  message: string;
}

export type ContactValidationFailureKind =
  | 'spam'
  | 'required'
  | 'too_long'
  | 'invalid_email';

export type ContactValidationResult =
  | {
      ok: true;
      value: ValidContactPayload;
    }
  | {
      ok: false;
      kind: ContactValidationFailureKind;
    };

export interface ContactRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export const contactProtectionConfig: {
  maxNameLength: number;
  maxEmailLength: number;
  maxMessageLength: number;
  minFormFillTimeMs: number;
  rateLimitWindowMs: number;
  rateLimitMaxSubmissions: number;
};

export function validateContactPayload(
  body: unknown,
  now?: number
): ContactValidationResult;

export function getContactClientKey(
  headers: Pick<Headers, 'get'>
): string | null;

export function checkContactRateLimit(
  clientKey: string | null,
  now?: number
): ContactRateLimitResult;
