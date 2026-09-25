import { isStandardKey } from './productUtils';
import {
  extractDatoNumber,
  extractDatoString,
} from './datoValueUtils.mjs';

export interface DatoCustomField {
  key: string;
  label: string;
  value: string | number;
}

export interface DatoCategory {
  id: string;
  name: string;
  slug: string;
}

export interface DatoVariant {
  id: string;
  name?: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  sku: string;
  deliveryTime?: string;
  description?: string;
  gallery: string[];
  customFields?: DatoCustomField[];
}

export interface DatoProduct {
  id: string;
  title: string;
  slug: string;
  sku?: string;
  description: string;
  color?: string;
  size?: string;
  quantity?: number;
  deliveryTime?: string;
  categoryNames: string[];
  categorySlugs: string[];
  price: number;
  images: string[];
  variants: DatoVariant[];
  customFields?: DatoCustomField[];
}

export interface DatoStructuredTextNode {
  type?: string;
  item?: string;
  children?: DatoStructuredTextNode[];
  value?: unknown;
  marks?: string[];
  level?: number;
  attribution?: unknown;
  style?: string;
  code?: string;
  url?: string;
}

export interface DatoStructuredTextDocument {
  document?: {
    children?: DatoStructuredTextNode[];
  };
}

export interface DatoPageBlock {
  type: string;
  images?: string[];
  videoUrl?: string;
}

export interface DatoPage {
  id: string;
  title: string;
  slug: string;
  structuredText?: DatoStructuredTextDocument;
  blocksMap?: Record<string, DatoPageBlock>;
}

export interface DatoSiteInfo {
  name: string;
  globalSeoTitle?: string;
  globalSeoDescription?: string;
}

export function getOptimizedImageUrl(
  url: string,
  options?: { trim?: boolean; w?: number; h?: number; fit?: string }
): string {
  if (!url) return '';
  if (url.includes('datocms-assets.com')) {
    const separator = url.includes('?') ? '&' : '?';
    const params: string[] = ['auto=format'];
    if (options?.trim !== false) {
      params.push('trim=auto');
    }
    if (options?.fit) {
      params.push(`fit=${options.fit}`);
    }
    if (options?.w) {
      params.push(`w=${options.w}`);
    }
    if (options?.h) {
      params.push(`h=${options.h}`);
    }
    return `${url}${separator}${params.join('&')}`;
  }
  return url;
}

const DATOCMS_API_TOKEN = process.env.DATOCMS_READ_ONLY_API_TOKEN;
const CMA_ENDPOINT = 'https://site-api.datocms.com';

interface DatoCmaSite {
  attributes?: {
    name?: string;
    global_seo?: {
      fallback_seo?: {
        title?: string;
        description?: string;
      };
    };
  };
}

interface DatoCmaItemType {
  id: string;
  attributes: {
    api_key: string;
  };
}

interface DatoCmaUpload {
  id: string;
  attributes: {
    url: string;
  };
}

interface DatoCmaItemMeta {
  created_at?: string;
  first_published_at?: string;
}

interface DatoCmaItem {
  id: string;
  attributes: Record<string, unknown>;
  relationships?: {
    item_type?: {
      data?: {
        id?: string;
      };
    };
  };
  meta?: DatoCmaItemMeta;
}

interface DatoUploadRef {
  upload_id?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDatoCmaItem(value: unknown): value is DatoCmaItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isRecord(value.attributes)
  );
}

function getItemTypeId(item: DatoCmaItem): string | undefined {
  return item.relationships?.item_type?.data?.id;
}

function getLocalizedArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];

  for (const key of ['cs', 'en', 'de']) {
    const candidate = value[key];
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function getStringArray(value: unknown): string[] {
  return getLocalizedArray(value).filter(
    (item): item is string => typeof item === 'string'
  );
}

function getUploadRefs(value: unknown): DatoUploadRef[] {
  return getLocalizedArray(value)
    .filter(isRecord)
    .map((item) => ({
      upload_id: typeof item.upload_id === 'string' ? item.upload_id : undefined,
    }))
    .filter((item) => Boolean(item.upload_id));
}

function getUploadRef(value: unknown): DatoUploadRef | undefined {
  if (!isRecord(value)) return undefined;
  return typeof value.upload_id === 'string'
    ? { upload_id: value.upload_id }
    : undefined;
}

function resolveUploadUrls(
  refs: DatoUploadRef[],
  uploadMap: Record<string, string>
): string[] {
  return refs
    .map((ref) => (ref.upload_id ? uploadMap[ref.upload_id] : undefined))
    .filter((url): url is string => Boolean(url));
}

async function fetchCMA<T>(path: string): Promise<T> {
  if (!DATOCMS_API_TOKEN) {
    throw new Error(
      'Missing DATOCMS_READ_ONLY_API_TOKEN. Add a current DatoCMS CMA read token to .env.local (or the deployment environment) and restart the app.'
    );
  }

  const res = await fetch(`${CMA_ENDPOINT}${path}`, {
    headers: {
      Authorization: `Bearer ${DATOCMS_API_TOKEN}`,
      Accept: 'application/json',
      'X-Api-Version': '3',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  });

  if (!res.ok) {
    const responseBody = await res.text().catch(() => '');
    const details = responseBody ? ` — ${responseBody.slice(0, 500)}` : '';
    throw new Error(
      `DatoCMS CMA request failed for ${path}: ${res.status} ${res.statusText}${details}`
    );
  }

  const json = await res.json();
  return json.data as T;
}

export interface DatoHero {
  id: string;
  heading: string;
  text: string;
}

export interface DatoAcceptedForm {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  answeared?: boolean;
}

export interface DatoAllData {
  siteInfo: DatoSiteInfo;
  products: DatoProduct[];
  pages: DatoPage[];
  categories: DatoCategory[];
  variants: DatoVariant[];
  hero?: DatoHero;
}

export function extractString(val: unknown): string | undefined {
  return extractDatoString(val);
}

export function extractNumber(val: unknown): number | undefined {
  return extractDatoNumber(val);
}

const STANDARD_PRODUCT_KEYS = [
  'product_title',
  'title',
  'name',
  'product_desription',
  'product_description',
  'description',
  'product_slug',
  'slug',
  'product_scu',
  'product_sku',
  'scu',
  'sku',
  'product_quantity',
  'product_stock',
  'quantity',
  'stock',
  'product_price',
  'price',
  'product_category',
  'category',
  'product_image',
  'image',
  'images',
  'product_variant',
  'variant',
  'variants',
  'product_colour',
  'product_color',
  'color',
  'product_size',
  'size',
  'product_delivery_time',
  'delivery_time',
  'deliverytime',
  'product_deliverytime'
];

const STANDARD_VARIANT_KEYS = [
  'product_variant_name',
  'variant_name',
  'name',
  'product_variant_color',
  'variant_color',
  'color',
  'product_variant_size',
  'variant_size',
  'size',
  'product_variant_price',
  'variant_price',
  'price',
  'product_variant_quantity',
  'product_variant_stock',
  'variant_quantity',
  'variant_stock',
  'quantity',
  'stock',
  'product_variant_scu',
  'product_variant_sku',
  'variant_scu',
  'variant_sku',
  'scu',
  'sku',
  'product_variant_gallery',
  'variant_gallery',
  'gallery',
  'product_variant_slug',
  'variant_slug',
  'slug',
  'product_variant_description',
  'variant_description',
  'product_variant_desription',
  'variant_desription',
  'description',
  'popis',
  'product_variant_delivery_time',
  'variant_delivery_time',
  'delivery_time',
  'deliverytime',
  'product_variant_deliverytime',
  'variant_deliverytime'
];

function formatFieldLabel(key: string): string {
  const lower = key.toLowerCase();
  if (lower.includes('wool_width') || lower.includes('string_width')) return 'Šířka příze';
  if (lower.includes('wool_length') || lower.includes('string_length')) return 'Délka příze';
  if (lower.includes('material')) return 'Materiál';
  if (lower.includes('weight')) return 'Hmotnost';

  const clean = key.replace(/^(product_|product_variant_|variant_)/i, '').replace(/_/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function extractCustomFields(attributes: Record<string, unknown>, standardKeys: string[]): DatoCustomField[] {
  const fields: DatoCustomField[] = [];
  if (!attributes) return fields;

  Object.keys(attributes).forEach((key) => {
    if (standardKeys.includes(key) || isStandardKey(key)) return;
    const rawVal = attributes[key];
    if (rawVal !== null && rawVal !== undefined && rawVal !== '') {
      const displayVal = extractString(rawVal) || (typeof rawVal === 'object' ? JSON.stringify(rawVal) : String(rawVal));
      if (!displayVal) return;
      const label = formatFieldLabel(key);
      if (isStandardKey(label)) return;
      fields.push({
        key,
        label,
        value: displayVal,
      });
    }
  });

  return fields;
}

let memoryCache: DatoAllData | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000;

export async function getAllDatoData(forceFresh = false): Promise<DatoAllData> {
  const now = Date.now();
  if (!forceFresh && memoryCache && now - lastFetchTime < CACHE_TTL) {
    return memoryCache;
  }

  try {
    const [site, itemTypes, uploads, items] = await Promise.all([
      fetchCMA<DatoCmaSite>('/site'),
      fetchCMA<DatoCmaItemType[]>('/item-types'),
      fetchCMA<DatoCmaUpload[]>('/uploads?page[limit]=100'),
      fetchCMA<DatoCmaItem[]>('/items?page[limit]=100'),
    ]);

    const rawSiteName = site?.attributes?.name || 'Háčkování Rina';
    const cleanSiteName = rawSiteName.replace(/\s*eshop/gi, '').trim() || 'Háčkování Rina';

    const siteInfo: DatoSiteInfo = {
      name: cleanSiteName,
      globalSeoTitle: site?.attributes?.global_seo?.fallback_seo?.title,
      globalSeoDescription: site?.attributes?.global_seo?.fallback_seo?.description,
    };

    if (items.length === 0) {
      return {
        siteInfo,
        products: [],
        pages: [],
        categories: [],
        variants: [],
      };
    }

    const typeMap: Record<string, string> = {};
    itemTypes.forEach((t) => {
      typeMap[t.id] = t.attributes.api_key;
    });

    const uploadMap: Record<string, string> = {};
    if (uploads) {
      uploads.forEach((u) => {
        uploadMap[u.id] = u.attributes.url;
      });
    }

    const getApiKey = (item: DatoCmaItem) => {
      const itemTypeId = getItemTypeId(item);
      return itemTypeId ? typeMap[itemTypeId] : undefined;
    };

    const rawCategories = items.filter((item) => getApiKey(item) === 'produkt_kategorie');
    const rawProducts = items.filter((item) => getApiKey(item) === 'product');
    const rawVariants = items.filter((item) => getApiKey(item) === 'product_variant');
    const rawPages = items.filter((item) => getApiKey(item) === 'page');
    const rawHero = items.filter((item) => getApiKey(item) === 'hero');
    const heroItem = rawHero[0];
    let hero: DatoHero | undefined = undefined;
    if (heroItem) {
      const attr = heroItem.attributes || {};
      const heading = extractString(attr.hero_heading) || '';
      const text = extractString(attr.hero_text) || '';

      hero = {
        id: heroItem.id,
        heading,
        text,
      };
    }

    const categories: DatoCategory[] = rawCategories.map((c) => {
      const rawName = c.attributes?.product_cathegory_name;
      const name = extractString(rawName) || 'Kategorie';
      return {
        id: c.id,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      };
    });

    const categoryMap: Record<string, DatoCategory> = {};
    categories.forEach((c) => { categoryMap[c.id] = c; });

    const variantMap: Record<string, DatoVariant> = {};
    rawVariants.forEach((v) => {
      const attr = v.attributes || {};
      const name = extractString(attr.product_variant_name || attr.variant_name || attr.name);
      const color = extractString(attr.product_variant_color || attr.variant_color || attr.color) || 'Výchozí barevný odstín';
      const size = extractString(attr.product_variant_size || attr.variant_size || attr.size) || '';
      const price = extractNumber(attr.product_variant_price ?? attr.variant_price ?? attr.price) ?? 0;
      const quantity = extractNumber(attr.product_variant_quantity ?? attr.variant_quantity ?? attr.product_variant_stock ?? attr.variant_stock ?? attr.quantity ?? attr.stock) ?? 0;
      const sku = extractString(attr.product_variant_scu || attr.product_variant_sku || attr.variant_scu || attr.variant_sku || attr.scu || attr.sku) || '';
      const deliveryTime = extractString(attr.product_variant_delivery_time || attr.variant_delivery_time || attr.delivery_time || attr.deliverytime || attr.product_variant_deliverytime || attr.variant_deliverytime);
      const description = extractString(attr.product_variant_description || attr.variant_description || attr.product_variant_desription || attr.variant_desription || attr.description || attr.popis);

      const gallery = resolveUploadUrls(
        getUploadRefs(attr.product_variant_gallery),
        uploadMap
      );

      const variantCustomFields = extractCustomFields(attr, STANDARD_VARIANT_KEYS);
      variantMap[v.id] = {
        id: v.id,
        name,
        color,
        size,
        price,
        quantity,
        sku,
        deliveryTime,
        description,
        gallery,
        customFields: variantCustomFields,
      };
    });

    const variants: DatoVariant[] = Object.values(variantMap);

    const products: DatoProduct[] = rawProducts
      .map((p) => {
        const attr = p.attributes || {};
        const title = extractString(attr.product_title || attr.title || attr.name);
        if (!title) return null;

        const description = extractString(attr.product_desription || attr.product_description || attr.description) || '';
        const rawSlug = extractString(attr.product_slug || attr.slug) || title.toLowerCase().replace(/\s+/g, '-');
        const slug = rawSlug.replace(/^\//, '');

        const productSku = extractString(attr.product_scu || attr.product_sku || attr.scu || attr.sku);
        const productQuantity = extractNumber(attr.product_quantity ?? attr.product_stock ?? attr.quantity ?? attr.stock);
        const productDeliveryTime = extractString(attr.product_delivery_time || attr.delivery_time || attr.deliverytime || attr.product_deliverytime);

        const color = extractString(attr.product_colour || attr.product_color || attr.color);
        const size = extractString(attr.product_size || attr.size);

        const categoryIds = getStringArray(attr.product_category);
        const linkedCategories = categoryIds
          .map((categoryId) => categoryMap[categoryId])
          .filter((category): category is DatoCategory => Boolean(category));
        const categoryNames = linkedCategories.map((category) => category.name);
        const categorySlugs = linkedCategories.map((category) => category.slug);

        const mainImages = resolveUploadUrls(
          getUploadRefs(attr.product_image),
          uploadMap
        );

        const variantIds = getStringArray(attr.product_variant);
        const productVariants: DatoVariant[] = variantIds
          .map((variantId) => variantMap[variantId])
          .filter((variant): variant is DatoVariant => Boolean(variant));

        const variantGalleries = productVariants.flatMap((v) => v.gallery);
        const allImages = mainImages.length > 0
          ? mainImages
          : variantGalleries.length > 0
          ? variantGalleries
          : ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80'];

        const rawPrice = extractNumber(attr.product_price ?? attr.price);
        const productPrice = (rawPrice !== undefined && rawPrice > 0)
          ? rawPrice
          : (productVariants.length > 0 && productVariants[0].price > 0)
          ? productVariants[0].price
          : 0;

        const productCustomFields = extractCustomFields(attr, STANDARD_PRODUCT_KEYS);

        return {
          id: p.id,
          title,
          slug,
          sku: productSku,
          description,
          color,
          size,
          quantity: productQuantity,
          deliveryTime: productDeliveryTime,
          categoryNames,
          categorySlugs,
          price: productPrice,
          images: allImages,
          variants: productVariants,
          customFields: productCustomFields,
        };
      })
      .filter(Boolean) as DatoProduct[];

    const blocksMap: Record<string, DatoPageBlock> = {};
    items.forEach((item) => {
      const apiKey = getApiKey(item);
      if (apiKey === 'image_gallery_block') {
        const images = resolveUploadUrls(
          getUploadRefs(item.attributes.assets),
          uploadMap
        );
        blocksMap[item.id] = { type: 'image_gallery', images };
      } else if (apiKey === 'video_block') {
        const asset = getUploadRef(item.attributes.asset);
        const videoUrl = asset?.upload_id ? uploadMap[asset.upload_id] : undefined;
        blocksMap[item.id] = { type: 'video', videoUrl };
      }
    });

    const pages: DatoPage[] = rawPages.map((pg) => ({
      id: pg.id,
      title: extractString(pg.attributes.title) || '',
      slug: extractString(pg.attributes.slug) || '',
      structuredText: isRecord(pg.attributes.structured_text)
        ? (pg.attributes.structured_text as DatoStructuredTextDocument)
        : undefined,
      blocksMap,
    }));

    memoryCache = { siteInfo, products, pages, categories, variants, hero };
    lastFetchTime = Date.now();
    return memoryCache;
  } catch (err) {
    console.error('Error fetching DatoCMS data:', err);
    if (!forceFresh && memoryCache) {
      return memoryCache;
    }
    throw err;
  }
}

export async function getDatoSiteInfo(): Promise<DatoSiteInfo> {
  const data = await getAllDatoData();
  return data.siteInfo;
}

export async function getDatoCategories(): Promise<DatoCategory[]> {
  const data = await getAllDatoData();
  return data.categories;
}

export async function getDatoProducts(): Promise<DatoProduct[]> {
  const data = await getAllDatoData();
  return data.products;
}

export async function getDatoPages(): Promise<DatoPage[]> {
  const data = await getAllDatoData();
  return data.pages;
}

export async function getDatoVariants(): Promise<DatoVariant[]> {
  const data = await getAllDatoData();
  return data.variants;
}

export async function getDatoHero(): Promise<DatoHero | undefined> {
  const data = await getAllDatoData();
  return data.hero;
}

export async function getDatoAcceptedFormsForAdmin(): Promise<DatoAcceptedForm[]> {
  const token = process.env.DATOCMS_WRITE_API_TOKEN;
  if (!token) {
    throw new Error('Missing DATOCMS_WRITE_API_TOKEN.');
  }

  const res = await fetch(`${CMA_ENDPOINT}/items?page[limit]=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'X-Api-Version': '3',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  });

  if (!res.ok) {
    throw new Error(`DatoCMS admin request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: unknown };
  const items = Array.isArray(json.data)
    ? json.data.filter(isDatoCmaItem)
    : [];

  return items
    .filter(
      (item) =>
        getItemTypeId(item) === 'NfHlPn1hSoe3fhzz0vBNPg'
    )
    .map((item) => {
      const attr = item.attributes || {};
      return {
        id: item.id,
        name: extractString(attr.name) || 'Anonym',
        email: extractString(attr.email) || '',
        message: extractString(attr.message) || '',
        createdAt:
          item.meta?.created_at ||
          item.meta?.first_published_at ||
          extractString(attr.created_at),
        answeared: Boolean(attr.answeared ?? attr.answered ?? false),
      } satisfies DatoAcceptedForm;
    })
    .sort((a: DatoAcceptedForm, b: DatoAcceptedForm) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export async function getDatoAcceptedForms(): Promise<DatoAcceptedForm[]> {
  return getDatoAcceptedFormsForAdmin();
}
