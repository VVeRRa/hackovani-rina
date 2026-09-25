import { cookies } from 'next/headers';
import {
  createSessionToken,
  verifyPasswordValue,
  verifySessionToken,
} from '@/lib/adminSession.mjs';

export const ADMIN_SESSION_COOKIE = 'rina_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('Missing ADMIN_PASSWORD.');
  }
  return password;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('Missing ADMIN_SESSION_SECRET.');
  }
  return secret;
}

export function verifyAdminPassword(candidate: string): boolean {
  return verifyPasswordValue(candidate, getAdminPassword());
}

export function createAdminSessionToken(): string {
  return createSessionToken(
    getAdminPassword(),
    getSessionSecret(),
    ADMIN_SESSION_MAX_AGE_SECONDS
  );
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  return verifySessionToken(
    token,
    getAdminPassword(),
    getSessionSecret()
  );
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}
