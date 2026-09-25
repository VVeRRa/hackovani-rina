function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getStructuredText(value) {
  if (!isRecord(value)) return undefined;

  const directDocument = value.document;
  const nestedValue = value.value;
  const nestedDocument = isRecord(nestedValue) ? nestedValue.document : undefined;
  const document = isRecord(directDocument)
    ? directDocument
    : isRecord(nestedDocument)
      ? nestedDocument
      : undefined;

  if (!document || !Array.isArray(document.children)) return undefined;

  const text = document.children
    .flatMap((child) =>
      isRecord(child) && Array.isArray(child.children) ? child.children : []
    )
    .map((span) =>
      isRecord(span) && typeof span.value === 'string' ? span.value : ''
    )
    .join(' ')
    .trim();

  return text || undefined;
}

function firstLocalizedValue(value) {
  if (!isRecord(value)) return undefined;

  for (const key of ['cs', 'en', 'de']) {
    const candidate = value[key];
    if (candidate !== null && candidate !== undefined && candidate !== '') {
      return candidate;
    }
  }

  return Object.values(value).find(
    (candidate) =>
      candidate !== null &&
      candidate !== undefined &&
      candidate !== ''
  );
}

export function extractDatoString(value) {
  if (value === null || value === undefined) return undefined;

  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (!isRecord(value)) return undefined;

  const structuredText = getStructuredText(value);
  if (structuredText) return structuredText;

  const localized = firstLocalizedValue(value);
  if (typeof localized === 'string') return localized.trim() || undefined;
  if (typeof localized === 'number' || typeof localized === 'boolean') {
    return String(localized);
  }
  if (isRecord(localized)) return extractDatoString(localized);

  return undefined;
}

export function extractDatoNumber(value) {
  if (value === null || value === undefined) return undefined;

  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  if (!isRecord(value)) return undefined;

  const localized = firstLocalizedValue(value);
  if (typeof localized === 'number' && !Number.isNaN(localized)) {
    return localized;
  }
  if (typeof localized === 'string') {
    const parsed = Number.parseFloat(localized);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}
