export function verifyPasswordValue(
  candidate: string,
  password: string,
): boolean;

export function createSessionToken(
  password: string,
  secret: string,
  maxAgeSeconds: number,
  now?: number,
): string;

export function verifySessionToken(
  token: string | null | undefined,
  password: string,
  secret: string,
  now?: number,
): boolean;
