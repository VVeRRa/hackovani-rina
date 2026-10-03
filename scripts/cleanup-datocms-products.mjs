#!/usr/bin/env node

/**
 * One-off cleanup of demo catalogue copy in DatoCMS.
 *
 * Dry-run by default:
 *   DATOCMS_CONTENT_WRITE_API_TOKEN=... node scripts/cleanup-datocms-products.mjs
 *
 * Apply after reviewing:
 *   DATOCMS_CONTENT_WRITE_API_TOKEN=... node scripts/cleanup-datocms-products.mjs --apply
 */

const API = 'https://site-api.datocms.com';
const APPLY = process.argv.includes('--apply');
const token = process.env.DATOCMS_CONTENT_WRITE_API_TOKEN;

if (!token) {
  console.error('Missing DATOCMS_CONTENT_WRITE_API_TOKEN.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
  'Content-Type': 'application/vnd.api+json',
  'X-Api-Version': '3',
};

const catalogue = [
  { match: [/456789\s*123/i, /green handbag/i], title: 'Šalvějová háčkovaná kabelka', description: 'Ručně háčkovaná kabelka v jemném šalvějově zeleném odstínu.' },
  { match: [/snuff box/i, /tabat[eě]rka/i], title: 'Háčkované pouzdro', description: 'Kompaktní ručně háčkované pouzdro s výraznou strukturou.' },
  { match: [/wallet/i, /mint purse/i, /pen[eě][zž]enka/i], title: 'Mentolová háčkovaná peněženka', description: 'Ručně háčkovaná peněženka ve svěžím mentolovém odstínu.' },
  { match: [/^bag\s*123$/i, /red bag/i, /^ta[sš]ka\s*123$/i], title: 'Vínová háčkovaná taška', description: 'Elegantní ručně háčkovaná taška v sytém vínovém odstínu.' },
  { match: [/^handbag\s*123$/i, /^kabelka\s*123$/i], title: 'Pudrově růžová háčkovaná kabelka', description: 'Elegantní ručně háčkovaná kabelka v pudrově růžové barvě s ozdobným řetízkem.' },
  { match: [/bracelet\s*123/i, /n[aá]ramek\s*123/i], title: 'Modrý macramé náramek', description: 'Ručně vyráběný nastavitelný náramek v jemných modrých tónech.' },
  { match: [/grey bag\s*456/i, /gray bag\s*456/i, /^[sš]ed[aá]\s+ta[sš]ka\s*456$/i], title: 'Šedá háčkovaná kabelka', description: 'Kompaktní ručně háčkovaná kabelka v univerzálním šedém odstínu.' },
];

const pickString = (value) => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    for (const locale of ['cs', 'en', 'de']) {
      if (typeof value[locale] === 'string' && value[locale]) return value[locale];
    }
  }
  return '';
};

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (!res.ok) throw new Error(`${options.method || 'GET'} ${path}: ${res.status} ${await res.text()}`);
  if (res.status === 204) return null;
  return res.json();
}

const itemTypes = (await request('/item-types')).data;
const productType = itemTypes.find((t) => t.attributes?.api_key === 'product');
if (!productType) throw new Error('DatoCMS item type "product" not found.');

// Ask DatoCMS for Product records directly. Filtering a generic /items response
// by relationships.item_type is unreliable because CMA item payloads expose the
// model relationship differently depending on the endpoint/response shape.
const siteResponse = await request('/site');
const site = siteResponse.data;
const allItemsResponse = await request('/items?page[limit]=100');
const allItems = allItemsResponse.data || [];

// DatoCMS accepts either the model ID or api_key in filter[type]. Use the
// api_key here because it is human-readable in diagnostics as well.
const productApiKey = productType.attributes?.api_key || 'product';
const productResponse = await request(
  `/items?filter[type]=${encodeURIComponent(productApiKey)}&page[limit]=100`
);
const products = productResponse.data || [];

console.log(`Connected to DatoCMS`);
console.log(`Site: ${site?.attributes?.name || site?.id || '(unknown)'}`);
console.log(`Models visible to token: ${itemTypes.length}`);
console.log(
  itemTypes
    .filter((type) => !type.attributes?.modular_block)
    .map((type) => `  - ${type.attributes?.name || '(unnamed)'} [${type.attributes?.api_key}] (${type.id})`)
    .join('\\n')
);
console.log(`All records visible to token: ${allItems.length}`);
console.log(`Product model: ${productApiKey} (${productType.id})`);
console.log(`Products found: ${products.length}`);

if (products.length === 0 && allItems.length > 0) {
  console.log('\\nRecord model IDs visible in the generic /items response:');
  const counts = new Map();
  for (const item of allItems) {
    const typeId = item.relationships?.item_type?.data?.id || '(missing relationship)';
    counts.set(typeId, (counts.get(typeId) || 0) + 1);
  }
  for (const [typeId, count] of counts) console.log(`  - ${typeId}: ${count}`);
}

let matched = 0;
for (const item of products) {
  const a = item.attributes || {};
  const titleField = Object.hasOwn(a, 'product_title') ? 'product_title' : Object.hasOwn(a, 'title') ? 'title' : 'name';
  const descriptionField = Object.hasOwn(a, 'product_description') ? 'product_description' : Object.hasOwn(a, 'product_desription') ? 'product_desription' : 'description';
  const oldTitle = pickString(a[titleField]);
  const entry = catalogue.find((x) =>
    x.match.some((re) => re.test(oldTitle)) &&
    (oldTitle !== x.title || pickString(a[descriptionField]) !== x.description)
  );

  if (!entry) {
    console.log(`SKIP  ${item.id}  "${oldTitle}" (no safe match)`);
    continue;
  }

  matched++;
  console.log(`\n${APPLY ? 'UPDATE' : 'WOULD UPDATE'} ${item.id}`);
  console.log(`  title:       "${oldTitle}" -> "${entry.title}"`);
  console.log(`  description: "${pickString(a[descriptionField])}" -> "${entry.description}"`);

  if (!APPLY) continue;

  const wasPublished = ['published', 'updated'].includes(item.meta?.status);
  // These fields are localized in DatoCMS, so CMA requires a locale hash
  // even though the application uses Czech as the source text and translates
  // dynamic content at runtime.
  const localizedValue = (original, next) => {
    // This DatoCMS environment currently defines only the "en" locale.
    // Product source copy lives in that locale even when the source text is Czech;
    // the storefront translates dynamic content at runtime via lib/i18n.ts.
    if (original && typeof original === 'object' && !Array.isArray(original)) {
      const locales = Object.keys(original);
      const locale = locales[0] || 'en';
      return { ...original, [locale]: next };
    }
    return { en: next };
  };

  await request(`/items/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        type: 'item',
        id: item.id,
        attributes: {
          [titleField]: localizedValue(a[titleField], entry.title),
          [descriptionField]: localizedValue(a[descriptionField], entry.description),
        },
      },
    }),
  });

  if (wasPublished) {
    await request(`/items/${item.id}/publish`, {
      method: 'PUT',
      body: JSON.stringify({ data: { type: 'item', id: item.id } }),
    });
  }
}



// --- Variant + wool-width audit ------------------------------------------------
// Keep this dry-run-first as well: variant copy is less predictable than the seven
// known product records, so show the real values before we decide what to rewrite.
const variantType = itemTypes.find((t) => t.attributes?.api_key === 'product_variant');
if (variantType) {
  const variantResponse = await request('/items?filter[type]=product_variant&page[limit]=100');
  const variants = variantResponse.data || [];
  console.log(`\nVariants found: ${variants.length}`);

  const woolWidthKeys = (attrs) =>
    Object.keys(attrs || {}).filter((key) => /wool_?width|string_?width/i.test(key));

  const normalizeMm = (value) => {
    if (typeof value === 'number') return `${value} mm`;
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed || /\bmm\b/i.test(trimmed)) return trimmed;
    if (/^\d+(?:[.,]\d+)?$/.test(trimmed)) return `${trimmed} mm`;
    return trimmed;
  };

  for (const variant of variants) {
    const a = variant.attributes || {};
    const name = pickString(a.product_variant_name || a.variant_name || a.name) || '(bez názvu)';
    const description = pickString(
      a.product_variant_description ||
      a.variant_description ||
      a.product_variant_desription ||
      a.variant_desription ||
      a.description
    );
    console.log(`\nVARIANT ${variant.id}: "${name}"`);
    if (description) console.log(`  description: "${description}"`);
    for (const [key, raw] of Object.entries(a)) {
      if (/color|colour|size|material|wool|string|width/i.test(key)) {
        const shown = pickString(raw) || (typeof raw === 'number' ? raw : '');
        if (shown !== '' && shown !== undefined) console.log(`  ${key}: "${shown}"`);
      }
    }

    for (const key of woolWidthKeys(a)) {
      const raw = a[key];
      const current = pickString(raw) || (typeof raw === 'number' ? raw : '');
      const next = normalizeMm(current);
      if (current !== next) {
        console.log(`  ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} ${key}: "${current}" -> "${next}"`);
        if (APPLY) {
          const wasPublished = ['published', 'updated'].includes(variant.meta?.status);
          const nextValue =
            raw && typeof raw === 'object' && !Array.isArray(raw)
              ? { ...raw, [Object.keys(raw)[0] || 'en']: next }
              : next;
          await request(`/items/${variant.id}`, {
            method: 'PUT',
            body: JSON.stringify({ data: { type: 'item', id: variant.id, attributes: { [key]: nextValue } } }),
          });
          if (wasPublished) {
            await request(`/items/${variant.id}/publish`, {
              method: 'PUT',
              body: JSON.stringify({ data: { type: 'item', id: variant.id } }),
            });
          }
        }
      }
    }
  }
}

// Normalize wool-width values on products too. Only plain numeric values are
// changed; anything ambiguous is left untouched and shown by the audit.
for (const product of products) {
  const a = product.attributes || {};
  for (const key of Object.keys(a).filter((k) => /wool_?width|string_?width/i.test(k))) {
    const raw = a[key];
    const current = pickString(raw) || (typeof raw === 'number' ? raw : '');
    const trimmed = typeof current === 'string' ? current.trim() : current;
    const next =
      typeof trimmed === 'number'
        ? `${trimmed} mm`
        : typeof trimmed === 'string' && /^\d+(?:[.,]\d+)?$/.test(trimmed)
          ? `${trimmed} mm`
          : trimmed;

    if (current !== next) {
      console.log(`\nPRODUCT ${product.id} ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} ${key}: "${current}" -> "${next}"`);
      if (APPLY) {
        const wasPublished = ['published', 'updated'].includes(product.meta?.status);
        const nextValue =
          raw && typeof raw === 'object' && !Array.isArray(raw)
            ? { ...raw, [Object.keys(raw)[0] || 'en']: next }
            : next;
        await request(`/items/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify({ data: { type: 'item', id: product.id, attributes: { [key]: nextValue } } }),
        });
        if (wasPublished) {
          await request(`/items/${product.id}/publish`, {
            method: 'PUT',
            body: JSON.stringify({ data: { type: 'item', id: product.id } }),
          });
        }
      }
    }
  }
}

console.log(`\nMatched ${matched}/${products.length} product records.`);
if (!APPLY) console.log('Dry run only. Re-run with --apply after reviewing the output.');
