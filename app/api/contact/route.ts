import { NextRequest, NextResponse } from 'next/server';
import {
  checkContactRateLimit,
  contactProtectionConfig,
  getContactClientKey,
  validateContactPayload,
} from '@/lib/contactProtection.mjs';

export const dynamic = 'force-dynamic';

const ACCEPTED_FORM_ITEM_TYPE_ID = 'NfHlPn1hSoe3fhzz0vBNPg';
const MAX_REQUEST_BODY_BYTES = 16_384;

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Zpráva je příliš velká.', errorCode: 'too_large' },
        { status: 413 }
      );
    }

    const body = await req.json();
    const validation = validateContactPayload(body);

    if (!validation.ok) {
      if (validation.kind === 'spam') {
        return NextResponse.json({
          success: true,
          message: 'Zpráva byla úspěšně uložena.',
        });
      }

      const errorMessage =
        validation.kind === 'required'
          ? 'Všechna pole (Jméno, Email, Zpráva) jsou povinná.'
          : validation.kind === 'invalid_email'
            ? 'Email nemá platný formát.'
            : `Některé pole překračuje povolenou délku (jméno ${contactProtectionConfig.maxNameLength}, email ${contactProtectionConfig.maxEmailLength}, zpráva ${contactProtectionConfig.maxMessageLength} znaků).`;

      return NextResponse.json(
        { error: errorMessage, errorCode: validation.kind },
        { status: 400 }
      );
    }

    const rateLimit = checkContactRateLimit(
      getContactClientKey(req.headers)
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Příliš mnoho zpráv. Zkuste to prosím později.', errorCode: 'rate_limited' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const { name, email, message } = validation.value;

    const token = process.env.DATOCMS_WRITE_API_TOKEN;

    if (!token) {
      console.error('DATOCMS_WRITE_API_TOKEN is not configured.');
      return NextResponse.json(
        { error: 'Kontaktní formulář není momentálně dostupný.', errorCode: 'unavailable' },
        { status: 503 }
      );
    }

    const payload = {
      data: {
        type: 'item',
        attributes: { name, email, message, answeared: false },
        relationships: {
          item_type: {
            data: {
              id: ACCEPTED_FORM_ITEM_TYPE_ID,
              type: 'item_type',
            },
          },
        },
      },
    };

    const res = await fetch('https://site-api.datocms.com/items', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Version': '3',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json().catch(() => null);

    if (!res.ok || !responseData?.data?.id) {
      console.error('DatoCMS API error creating contact item:', {
        status: res.status,
        response: responseData,
      });
      return NextResponse.json(
        { error: 'Nepodařilo se uložit zprávu.', errorCode: 'save_failed' },
        { status: 502 }
      );
    }

    const itemId = responseData.data.id;

    const publishRes = await fetch(
      `https://site-api.datocms.com/items/${itemId}/publish`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'X-Api-Version': '3',
        },
      }
    );

    if (!publishRes.ok) {
      console.warn('Contact item was created but could not be published:', {
        status: publishRes.status,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Zpráva byla úspěšně uložena.',
    });
  } catch (error) {
    console.error('Error in /api/contact route:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování formuláře.', errorCode: 'processing_failed' },
      { status: 500 }
    );
  }
}
