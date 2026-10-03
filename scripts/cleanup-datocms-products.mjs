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
  { match: [/snuff box/i], title: 'Háčkované pouzdro', description: 'Kompaktní ručně háčkované pouzdro s výraznou strukturou.' },
  { match: [/wallet/i, /mint purse/i], title: 'Mentolová háčkovaná peněženka', description: 'Ručně háčkovaná peněženka ve svěžím mentolovém odstínu.' },
  { match: [/^bag\s*123$/i, /red bag/i], title: 'Vínová háčkovaná taška', description: 'Elegantní ručně háčkovaná taška v sytém vínovém odstínu.' },
  { match: [/^handbag\s*123$/i, /^kabelka\s*123$/i], title: 'Pudrově růžová háčkovaná kabelka', description: 'Elegantní ručně háčkovaná kabelka v pudrově růžové barvě s ozdobným řetízkem.' },
  { match: [/bracelet\s*123/i], title: 'Modrý macramé náramek', description: 'Ručně vyráběný nastavitelný náramek v jemných modrých tónech.' },
  { match: [/grey bag\s*456/i, /gray bag\s*456/i], title: 'Šedá háčkovaná kabelka', description: 'Kompaktní ručně háčkovaná kabelka v univerzálním šedém odstínu.' },
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
  const entry = catalogue.find((x) => x.match.some((re) => re.test(oldTitle)));

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
  await request(`/items/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: { type: 'item', id: item.id, attributes: { [titleField]: entry.title, [descriptionField]: entry.description } } }),
  });

  if (wasPublished) {
    await request(`/items/${item.id}/publish`, {
      method: 'PUT',
      body: JSON.stringify({ data: { type: 'item', id: item.id } }),
    });
  }
}

console.log(`\nMatched ${matched}/${products.length} product records.`);
if (!APPLY) console.log('Dry run only. Re-run with --apply after reviewing the output.');
