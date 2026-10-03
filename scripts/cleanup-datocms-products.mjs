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

const pagePlaceholderPatterns = [
  /tady je naps[aá]no n[eě]co hezk[eé]ho o mn[eě]/i,
  /jsem moc [sš]ikovn[aá]/i,
];

function collectStructuredTextStrings(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (typeof node.value === 'string') out.push(node.value);
  if (Array.isArray(node.children)) node.children.forEach((child) => collectStructuredTextStrings(child, out));
  if (node.document) collectStructuredTextStrings(node.document, out);
  return out;
}

const productPropertyCleanup = {
  'cqTbHI2oSbqYHpcJbS34Tg': { product_colour: 'zelená' },
  'JQKKBaI6REeCj4W8H8iE_g': { product_colour: 'černo-červená' },
  'N-_0b05QToKJlwDXyERAIQ': { product_colour: 'mintová' },
  'Hswn-zUvSoWbphKfdJKOIw': { product_colour: 'červená' },
  'UbIYdKkBSM2EjUj_qCCFxw': { product_colour: 'růžová' },
  'Mvuv3EkRRgOD-Ki2wXPkwQ': { product_colour: 'modrá' },
  'PklZzwuTTq6evDrS33585Q': { product_colour: 'šedá' },
};

const productPrices = {
  'PklZzwuTTq6evDrS33585Q': 1490,
  'Mvuv3EkRRgOD-Ki2wXPkwQ': 290,
  'UbIYdKkBSM2EjUj_qCCFxw': 1690,
  'Hswn-zUvSoWbphKfdJKOIw': 1590,
  'N-_0b05QToKJlwDXyERAIQ': 590,
  'JQKKBaI6REeCj4W8H8iE_g': 490,
  'cqTbHI2oSbqYHpcJbS34Tg': 1690,
};

const variantPropertyCleanup = {
  'adYRPzWVSWacWw-VTUPo1Q': { product_variant_color: 'červená', product_variant_size: 'velká' },
  'J3D7JcSzT0OkZeE-eUR_uA': { product_variant_color: 'modře žíhaná', product_variant_size: 'střední' },
  'QwGJ0pGJRzKHwUjVRTmJBQ': { product_variant_color: 'zeleno-černá', product_variant_size: 'malá' },
  'fmgb5I71SN6vpIM2TiYN5A': { product_variant_color: 'khaki', product_variant_size: 'malá' },
  'UCINsXjJTqWNaoaw6MMRdw': { product_variant_color: 'lila', product_variant_size: 'malá' },
  'BVVKaDBvR2S_2YEUoHKx6g': { product_variant_color: 'růžová', product_variant_size: 'malá' },
  'eLcqb8euS-m02jQBeywfvA': { product_variant_color: 'bílá', product_variant_size: 'malá' },
  'ZB2Zk4mWQ4qjX4g4X-0Mxw': { product_variant_color: 'modrá', product_variant_size: 'střední' },
  'eCrGqaylQUyArTFM9A4sLQ': { product_variant_color: 'zelená', product_variant_size: 'malá' },
  'Ekt0O-ndS7aqPxxsbTvA4w': { product_variant_color: 'modrá', product_variant_size: 'malá' },
};

const variantCleanup = {
  'adYRPzWVSWacWw-VTUPo1Q': { title: 'Velké červené háčkované pouzdro', description: 'Prostorné ručně háčkované pouzdro v červené barvě.', price: 590 },
  'J3D7JcSzT0OkZeE-eUR_uA': { title: 'Modře žíhané háčkované pouzdro', description: 'Středně velké ručně háčkované pouzdro v modře žíhaném provedení.', price: 540 },
  'QwGJ0pGJRzKHwUjVRTmJBQ': { title: 'Zeleno-černé háčkované pouzdro', description: 'Malé ručně háčkované pouzdro v zeleno-černé kombinaci.', price: 490 },
  'fmgb5I71SN6vpIM2TiYN5A': { title: 'Khaki háčkovaná peněženka', description: 'Malá ručně háčkovaná peněženka v khaki odstínu.', price: 590 },
  'UCINsXjJTqWNaoaw6MMRdw': { title: 'Lila háčkovaná peněženka', description: 'Malá ručně háčkovaná peněženka v jemném lila odstínu.', price: 590 },
  'BVVKaDBvR2S_2YEUoHKx6g': { title: 'Malá růžová háčkovaná kabelka', description: 'Malá ručně háčkovaná kabelka v růžovém odstínu.', price: 1490 },
  'eLcqb8euS-m02jQBeywfvA': { title: 'Bílý macramé náramek', description: 'Jemný ručně vyráběný macramé náramek v bílé barvě.', price: 260 },
  'ZB2Zk4mWQ4qjX4g4X-0Mxw': { title: 'Modrý macramé náramek', description: 'Ručně vyráběný macramé náramek v modrém odstínu.', price: 290 },
  'eCrGqaylQUyArTFM9A4sLQ': { title: 'Malá zelená háčkovaná taška', description: 'Malá ručně háčkovaná taška v zeleném odstínu.', price: 1390 },
  'Ekt0O-ndS7aqPxxsbTvA4w': { title: 'Malá modrá háčkovaná kabelka', description: 'Malá ručně háčkovaná kabelka v modrém odstínu.', price: 1490 },
};

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
    if (!trimmed) return trimmed;
    // Canonical display format: "<number> mm" (with one space).
    const numericMm = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*mm$/i);
    if (numericMm) return `${numericMm[1]} mm`;
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

    const propertyCleanup = variantPropertyCleanup[variant.id];
    if (propertyCleanup) {
      for (const [key, next] of Object.entries(propertyCleanup)) {
        if (!Object.hasOwn(a, key)) continue;
        const current = pickString(a[key]);
        if (current === next) continue;
        console.log(`  ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} ${key}: "${current}" -> "${next}"`);
        if (APPLY) {
          const raw = a[key];
          const nextValue = raw && typeof raw === 'object' && !Array.isArray(raw)
            ? { ...raw, [Object.keys(raw)[0] || 'en']: next }
            : next;
          const wasPublished = ['published', 'updated'].includes(variant.meta?.status);
          await request(`/items/${variant.id}`, {
            method: 'PUT',
            body: JSON.stringify({ data: { type: 'item', id: variant.id, attributes: { [key]: nextValue } } }),
          });
          if (wasPublished) await request(`/items/${variant.id}/publish`, { method: 'PUT', body: JSON.stringify({ data: { type: 'item', id: variant.id } }) });
        }
      }
    }

    const cleanup = variantCleanup[variant.id];
    if (cleanup) {
      const titleField = Object.hasOwn(a, 'product_variant_name') ? 'product_variant_name' : Object.hasOwn(a, 'variant_name') ? 'variant_name' : 'name';
      const descriptionField = Object.hasOwn(a, 'product_variant_description') ? 'product_variant_description' : Object.hasOwn(a, 'product_variant_desription') ? 'product_variant_desription' : Object.hasOwn(a, 'variant_description') ? 'variant_description' : 'description';
      const priceField = Object.hasOwn(a, 'product_variant_price') ? 'product_variant_price' : Object.hasOwn(a, 'variant_price') ? 'variant_price' : 'price';
      const currentPrice = a[priceField];
      console.log(`  ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} title: "${name}" -> "${cleanup.title}"`);
      console.log(`  ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} description: "${description}" -> "${cleanup.description}"`);
      console.log(`  ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} price: "${pickString(currentPrice) || currentPrice || ''}" -> "${cleanup.price}"`);
      if (APPLY) {
        const localized = (raw, next) => raw && typeof raw === 'object' && !Array.isArray(raw)
          ? { ...raw, [Object.keys(raw)[0] || 'en']: next }
          : next;
        const wasPublished = ['published', 'updated'].includes(variant.meta?.status);
        await request(`/items/${variant.id}`, {
          method: 'PUT',
          body: JSON.stringify({ data: { type: 'item', id: variant.id, attributes: {
            [titleField]: localized(a[titleField], cleanup.title),
            [descriptionField]: localized(a[descriptionField], cleanup.description),
            [priceField]: typeof currentPrice === 'object' && currentPrice !== null ? localized(currentPrice, cleanup.price) : cleanup.price,
          } } }),
        });
        if (wasPublished) await request(`/items/${variant.id}/publish`, { method: 'PUT', body: JSON.stringify({ data: { type: 'item', id: variant.id } }) });
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
  // Audit and normalize main-product display properties.
  for (const [key, raw] of Object.entries(a)) {
    if (/color|colour|size|material/i.test(key)) {
      const shown = pickString(raw) || (typeof raw === 'number' ? raw : '');
      if (shown !== '' && shown !== undefined) console.log(`PRODUCT PROPERTY ${product.id} ${key}: "${shown}"`);
    }
  }
  const propertyCleanup = productPropertyCleanup[product.id];
  if (propertyCleanup) {
    for (const [key, next] of Object.entries(propertyCleanup)) {
      if (!Object.hasOwn(a, key)) continue;
      const raw = a[key];
      const current = pickString(raw);
      if (current === next) continue;
      console.log(`PRODUCT ${product.id} ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} ${key}: "${current}" -> "${next}"`);
      if (APPLY) {
        const wasPublished = ['published', 'updated'].includes(product.meta?.status);
        const nextValue = raw && typeof raw === 'object' && !Array.isArray(raw)
          ? { ...raw, [Object.keys(raw)[0] || 'en']: next }
          : next;
        await request(`/items/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify({ data: { type: 'item', id: product.id, attributes: { [key]: nextValue } } }),
        });
        if (wasPublished) await request(`/items/${product.id}/publish`, {
          method: 'PUT',
          body: JSON.stringify({ data: { type: 'item', id: product.id } }),
        });
      }
    }
  }

  const targetPrice = productPrices[product.id];
  if (targetPrice !== undefined) {
    const priceField = Object.hasOwn(a, 'product_price') ? 'product_price' : 'price';
    const rawPrice = a[priceField];
    const currentPrice = pickString(rawPrice) || rawPrice || '';
    if (Number(currentPrice) !== targetPrice) {
      console.log(`\nPRODUCT ${product.id} ${APPLY ? 'UPDATE' : 'WOULD UPDATE'} ${priceField}: "${currentPrice}" -> "${targetPrice}"`);
      if (APPLY) {
        const wasPublished = ['published', 'updated'].includes(product.meta?.status);
        const nextValue = rawPrice && typeof rawPrice === 'object' && !Array.isArray(rawPrice)
          ? { ...rawPrice, [Object.keys(rawPrice)[0] || 'en']: targetPrice }
          : targetPrice;
        await request(`/items/${product.id}`, { method: 'PUT', body: JSON.stringify({ data: { type: 'item', id: product.id, attributes: { [priceField]: nextValue } } }) });
        if (wasPublished) await request(`/items/${product.id}/publish`, { method: 'PUT', body: JSON.stringify({ data: { type: 'item', id: product.id } }) });
      }
    }
  }
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

// Audit CMS pages for obvious WIP placeholders. We deliberately do not rewrite
// structured text automatically: page content and blocks deserve a separate,
// reviewable cleanup rather than a risky blind mutation.
const pageModel = models.find((m) => m.attributes?.api_key === 'page');
if (pageModel) {
  const pages = allItems.filter((item) => item.relationships?.item_type?.data?.id === pageModel.id);
  console.log(`\nPages found: ${pages.length}`);
  for (const page of pages) {
    const a = page.attributes || {};
    const title = pickString(a.title) || '';
    const slug = pickString(a.slug) || '';
    const strings = collectStructuredTextStrings(a.structured_text);
    console.log(`\nPAGE ${page.id}: "${title}" [${slug}]`);
    for (const value of strings) {
      const clean = value.trim();
      if (!clean) continue;
      const marker = pagePlaceholderPatterns.some((pattern) => pattern.test(clean)) ? '  PLACEHOLDER' : '  TEXT';
      console.log(`${marker}: "${clean}"`);
    }
  }
}

console.log(`\nMatched ${matched}/${products.length} product records.`);
if (!APPLY) console.log('Dry run only. Re-run with --apply after reviewing the output.');
