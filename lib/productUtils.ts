import { CartItem } from '@/context/CartContext';
import { DatoProduct, DatoVariant, DatoCustomField, getOptimizedImageUrl } from '@/lib/datocms';

/**
 * Calculates cart quantity for a specific product or variant choice
 */
export function getCartQtyForChoice(cart: CartItem[], productId: string, variantId?: string): number {
  if (!cart || !productId) return 0;
  const targetId = variantId ? `${productId}-${variantId}` : `${productId}-main`;
  const item = cart.find((i) => i.id === targetId);
  return item ? item.quantity : 0;
}

/**
 * Sums total cart quantity for a product across main item and all variants
 */
export function getTotalProductCartQty(cart: CartItem[], productId: string): number {
  if (!cart || !productId) return 0;
  return cart
    .filter((i) => i.product.id === productId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Checks if a custom field key or label is standard/built-in
 */
export function isStandardKey(keyOrLabel: string): boolean {
  if (!keyOrLabel) return false;
  const l = keyOrLabel.toLowerCase();
  return (
    l.includes('slug') ||
    l.includes('name') ||
    l.includes('title') ||
    l.includes('scu') ||
    l.includes('sku') ||
    l.includes('stock') ||
    l.includes('quantity') ||
    l.includes('price') ||
    l.includes('description') ||
    l.includes('popis') ||
    l.includes('delivery') ||
    l.includes('dodán') ||
    l.includes('dodani') ||
    l.includes('doruč') ||
    l.includes('doruceni') ||
    l.includes('image') ||
    l.includes('gallery') ||
    l.includes('category')
  );
}

/**
 * Maps custom field key/label to high-contrast icon
 */
export function getCustomFieldIcon(keyOrLabel: string): string {
  if (!keyOrLabel) return '🏷️';
  const l = keyOrLabel.toLowerCase();
  if (l.includes('delivery') || l.includes('dodán') || l.includes('doruč')) return '🚚';
  if (l.includes('šířka') || l.includes('sirka') || l.includes('width')) return '🧵';
  if (l.includes('délka') || l.includes('delka') || l.includes('length')) return '📐';
  if (l.includes('materiál') || l.includes('material')) return '🧶';
  if (l.includes('hmotnost') || l.includes('weight')) return '⚖️';
  return '🏷️';
}

/**
 * Merges main product custom fields with selected variant custom fields, eliminating duplicates
 */
export function mergeCustomFields(
  productFields: DatoCustomField[] = [],
  variantFields: DatoCustomField[] = []
): DatoCustomField[] {
  const cleanedVariant = variantFields.filter((f) => !isStandardKey(f.key) && !isStandardKey(f.label));
  const cleanedProduct = productFields.filter((f) => !isStandardKey(f.key) && !isStandardKey(f.label));

  const merged = [...cleanedVariant];
  cleanedProduct.forEach((pField) => {
    const pKey = pField.key.toLowerCase();
    const pLabel = pField.label.toLowerCase();
    const exists = cleanedVariant.some(
      (vField) => vField.key.toLowerCase() === pKey || vField.label.toLowerCase() === pLabel
    );
    if (!exists) {
      merged.push(pField);
    }
  });
  return merged;
}

/**
 * Interface for active resolved product properties
 */
export interface ResolvedProductDetails {
  activeTitle: string;
  activeDescription: string;
  activeColor?: string;
  activeSize?: string;
  activeSku?: string;
  price: number;
  stockQty: number;
  activeDeliveryTime?: string;
  selectedGallery: string[];
  currentDisplayImage: string;
  customFields: DatoCustomField[];
}

/**
 * Resolves active product attributes based on selected variant or fallback to main product
 */
export function resolveActiveProductDetails(
  product: DatoProduct,
  selectedVariant?: DatoVariant,
  activeImageIndex: number = 0
): ResolvedProductDetails {
  const variantNameField = selectedVariant?.customFields?.find(
    (f) => f.key.toLowerCase().includes('name') || f.label.toLowerCase().includes('name') || f.key.toLowerCase().includes('title') || f.label.toLowerCase().includes('title')
  );

  const activeTitle = selectedVariant
    ? selectedVariant.name || (variantNameField ? String(variantNameField.value) : undefined) || (selectedVariant.color ? `${product.title} - ${selectedVariant.color}` : product.title)
    : product.title;

  const variantDescField = selectedVariant?.customFields?.find(
    (f) => f.key.toLowerCase().includes('description') || f.label.toLowerCase().includes('description') || f.key.toLowerCase().includes('popis') || f.label.toLowerCase().includes('popis')
  );

  const activeDescription = selectedVariant
    ? selectedVariant.description || (variantDescField ? String(variantDescField.value) : undefined) || product.description
    : product.description;

  const activeColor = selectedVariant ? (selectedVariant.color || product.color) : product.color;
  const activeSize = selectedVariant ? (selectedVariant.size || product.size) : product.size;
  const activeSku = selectedVariant ? (selectedVariant.sku || product.sku) : product.sku;

  const price = (selectedVariant !== undefined && selectedVariant.price > 0)
    ? selectedVariant.price
    : (product.price || 0);

  const stockQty = selectedVariant !== undefined
    ? selectedVariant.quantity
    : (product.quantity !== undefined ? product.quantity : 0);

  const activeDeliveryTime = selectedVariant
    ? (selectedVariant.deliveryTime || product.deliveryTime)
    : product.deliveryTime;

  const mainImages = product.images || [];
  const variantGalleries = (product.variants || []).flatMap((v) => v.gallery || []);
  const fallbackImage = 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80';

  const allAvailableImages = mainImages.length > 0
    ? mainImages
    : variantGalleries.length > 0
    ? variantGalleries
    : [fallbackImage];

  const selectedGallery = (selectedVariant?.gallery && selectedVariant.gallery.length > 0)
    ? selectedVariant.gallery
    : allAvailableImages;

  const currentRawImage = selectedGallery[activeImageIndex] || selectedGallery[0] || allAvailableImages[0] || fallbackImage;
  const currentDisplayImage = getOptimizedImageUrl(currentRawImage, { trim: true, w: 1000 });

  const customFields = selectedVariant
    ? mergeCustomFields(product.customFields, selectedVariant.customFields)
    : (product.customFields || []).filter((f) => !isStandardKey(f.key) && !isStandardKey(f.label));

  return {
    activeTitle,
    activeDescription,
    activeColor,
    activeSize,
    activeSku,
    price,
    stockQty,
    activeDeliveryTime,
    selectedGallery,
    currentDisplayImage,
    customFields,
  };
}
