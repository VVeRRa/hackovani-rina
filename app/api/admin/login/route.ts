import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from '@/lib/adminAuth';
import {
  checkRequestRateLimit,
  getRequestClientKey,
  resetRequestRateLimit,
} from '@/lib/requestRateLimit.mjs';

export const dynamic = 'force-dynamic';

const LOGIN_RATE_LIMIT_NAMESPACE = 'admin-login';
const LOGIN_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 2048) {
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const clientKey = getRequestClientKey(request.headers);
  const rateLimit = checkRequestRateLimit({
    namespace: LOGIN_RATE_LIMIT_NAMESPACE,
    clientKey,
    maxRequests: LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    resetRequestRateLimit(LOGIN_RATE_LIMIT_NAMESPACE, clientKey);

    const response = NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store' } }
    );
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionToken(),
      adminCookieOptions()
    );

    return response;
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json(
      { error: 'Login unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
