import { NextRequest, NextResponse } from 'next/server';
import {
  checkRequestRateLimit,
  getRequestClientKey,
} from '@/lib/requestRateLimit.mjs';

const MAX_TRANSLATION_TEXT_LENGTH = 500;
const MAX_CACHE_ENTRIES = 200;
const SUPPORTED_LANGUAGES = new Set(['cs', 'en', 'de']);
const serverCache = new Map<string, string>();
const TRANSLATION_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const TRANSLATION_RATE_LIMIT_MAX_REQUESTS = 60;

const OVERRIDE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'malá': { en: 'Small', de: 'Klein', cs: 'Malá' },
  'mala': { en: 'Small', de: 'Klein', cs: 'Malá' },
  'malý': { en: 'Small', de: 'Klein', cs: 'Malý' },
  'maly': { en: 'Small', de: 'Klein', cs: 'Malý' },
  'malé': { en: 'Small', de: 'Klein', cs: 'Malé' },
  'male': { en: 'Small', de: 'Klein', cs: 'Malé' },
  'střední': { en: 'Medium', de: 'Mittel', cs: 'Střední' },
  'stredni': { en: 'Medium', de: 'Mittel', cs: 'Střední' },
  'velká': { en: 'Large', de: 'Groß', cs: 'Velká' },
  'velka': { en: 'Large', de: 'Groß', cs: 'Velká' },
  'velký': { en: 'Large', de: 'Groß', cs: 'Velký' },
  'velky': { en: 'Large', de: 'Groß', cs: 'Velký' },
  'velké': { en: 'Large', de: 'Groß', cs: 'Velké' },
  'velke': { en: 'Large', de: 'Groß', cs: 'Velké' },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const to = searchParams.get('to') || 'en';
  const from = searchParams.get('from') || 'cs';

  if (!SUPPORTED_LANGUAGES.has(to) || !SUPPORTED_LANGUAGES.has(from)) {
    return NextResponse.json(
      { error: 'Unsupported language.' },
      { status: 400 }
    );
  }

  if (!text || !text.trim()) {
    return NextResponse.json({ translatedText: '' });
  }

  const cleanText = text.trim();
  if (cleanText.length > MAX_TRANSLATION_TEXT_LENGTH) {
    return NextResponse.json(
      { error: 'Text is too long.' },
      { status: 413 }
    );
  }
  const lowerText = cleanText.toLowerCase();

  // Explicit size overrides to prevent MyMemory API from returning "low" for "malá"
  if (OVERRIDE_TRANSLATIONS[lowerText]?.[to]) {
    const fixedTranslation = OVERRIDE_TRANSLATIONS[lowerText][to];
    // Preserve capitalization if original string was capitalized
    const finalTranslation =
      cleanText[0] === cleanText[0].toUpperCase()
        ? fixedTranslation.charAt(0).toUpperCase() + fixedTranslation.slice(1)
        : fixedTranslation;
    return NextResponse.json({ translatedText: finalTranslation });
  }

  const cacheKey = `${from}_${to}_${cleanText}`;

  const cached = serverCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({ translatedText: cached });
  }

  const rateLimit = checkRequestRateLimit({
    namespace: 'translation',
    clientKey: getRequestClientKey(req.headers),
    maxRequests: TRANSLATION_RATE_LIMIT_MAX_REQUESTS,
    windowMs: TRANSLATION_RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many translation requests.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${from}|${to}`,
      {
        cache: 'force-cache',
        signal: AbortSignal.timeout(4000),
      }
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText;

    if (
      translated &&
      typeof translated === 'string' &&
      !translated.includes('MYMEMORY WARNING') &&
      !translated.includes('IS OVER QUERY LIMIT')
    ) {
      // Emergency sanity check: replace any occurrences of "low" when original word was "malá"
      let result = translated;
      if (lowerText === 'malá' || lowerText === 'mala') {
        result = to === 'de' ? 'Klein' : 'Small';
      }
      if (serverCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = serverCache.keys().next().value;
        if (oldestKey) serverCache.delete(oldestKey);
      }
      serverCache.set(cacheKey, result);
      return NextResponse.json({ translatedText: result });
    }
  } catch (err) {
    console.error('API Translation error:', err);
  }

  return NextResponse.json({ translatedText: cleanText });
}
