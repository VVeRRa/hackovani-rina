import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';
import {
  buildAdminContactStatusPayload,
  parseAdminContactStatusUpdate,
} from '@/lib/adminContactStatus.mjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = process.env.DATOCMS_WRITE_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'Contact form service is not configured.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const parsedUpdate = parseAdminContactStatusUpdate(body);

    if (!parsedUpdate.ok) {
      return NextResponse.json(
        { error: 'Invalid request.' },
        { status: 400 }
      );
    }

    const { id, answeared } = parsedUpdate.value;
    const payload = buildAdminContactStatusPayload(id, answeared);

    const updateRes = await fetch(`https://site-api.datocms.com/items/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/vnd.api+json',
        'X-Api-Version': '3',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!updateRes.ok) {
      const errorBody = await updateRes.text().catch(() => '');
      let upstreamCode: string | undefined;

      try {
        const parsed = JSON.parse(errorBody);
        upstreamCode =
          parsed?.data?.[0]?.attributes?.code ||
          parsed?.errors?.[0]?.code ||
          parsed?.error?.code;
      } catch {
        // Keep the raw upstream body server-side only.
      }

      console.error('Error updating accepted_form in DatoCMS:', {
        status: updateRes.status,
        code: upstreamCode,
        body: errorBody.slice(0, 500),
      });

      return NextResponse.json(
        {
          error: 'Nepodařilo se aktualizovat stav zprávy.',
          upstreamStatus: updateRes.status,
          upstreamCode,
        },
        { status: 502 }
      );
    }

    const publishRes = await fetch(
      `https://site-api.datocms.com/items/${encodeURIComponent(id)}/publish`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'X-Api-Version': '3',
          'Content-Type': 'application/vnd.api+json',
        },
        cache: 'no-store',
      }
    );

    if (!publishRes.ok) {
      console.warn('Updated contact item could not be published:', {
        status: publishRes.status,
      });
    }

    revalidatePath('/admin');

    return NextResponse.json(
      {
        success: true,
        id,
        answeared,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error in admin contact status route:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při aktualizaci stavu.' },
      { status: 500 }
    );
  }
}
