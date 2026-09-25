'use client';

import React, { useState } from 'react';
import { DatoProduct, DatoVariant, getOptimizedImageUrl } from '@/lib/datocms';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  formatPrice,
  getProductCategoryLabels,
  getCategoryBadgeIcon,
} from '@/lib/i18n';
import { getCartQtyForChoice, getTotalProductCartQty } from '@/lib/productUtils';
import { QuantityControl } from '@/components/QuantityControl';
import { CartBadge } from '@/components/CartBadge';
import { WishlistButton } from '@/components/WishlistButton';

interface ProductCardProps {
  product: DatoProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, openProductModal, cart } = useCart();
  const { lang, t, translate } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState<DatoVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const categoryLabels = getProductCategoryLabels(product, lang);

  const totalProductCartQty = getTotalProductCartQty(cart, product.id);
  const selectedChoiceCartQty = getCartQtyForChoice(cart, product.id, selectedVariant?.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const rawMainImage = (selectedVariant?.gallery && selectedVariant.gallery.length > 0)
    ? selectedVariant.gallery[0]
    : product.images[0] || 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80';
  const mainImage = getOptimizedImageUrl(rawMainImage, { trim: true, w: 800 });

  const activeCartCount = selectedChoiceCartQty > 0 ? selectedChoiceCartQty : totalProductCartQty;

  return (
    <article
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Full-Bleed Framed Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '88%',
          backgroundColor: '#FAF8F5',
          overflow: 'hidden'
        }}
      >
        <img
          src={mainImage}
          alt={translate(product.title)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: isHovered ? 'scale(1.24)' : 'scale(1.15)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        <button
          type="button"
          onClick={() => openProductModal(product, selectedVariant)}
          aria-label={`${t('btnMoreInfo')}: ${translate(product.title)}`}
          title={t('btnMoreInfo')}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            border: 'none',
            padding: 0,
            background: 'transparent',
            cursor: 'pointer'
          }}
        />

        {/* Categories Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 2
          }}
        >
          {categoryLabels.map((catLabel, idx) => (
            <span key={idx} className="badge-gold">
              {getCategoryBadgeIcon(catLabel)} {catLabel}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          title={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
          position="top-right"
        />
      </div>

      {/* Product Details Section */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '10px', background: '#FFFFFF' }}>
        
        {/* Title Header with Cart Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            width: '100%'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              lineHeight: 1.3,
              margin: 0
            }}
          >
            <button
              type="button"
              onClick={() => openProductModal(product, selectedVariant)}
              style={{
                color: 'var(--burgundy-deep)',
                font: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {translate(product.title)}
            </button>
          </h3>

          <CartBadge count={activeCartCount} label={t('amountInCart')} variant="inline" />
        </div>

        {/* Description */}
        {product.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.45, margin: 0 }}>
            {translate(product.description)}
          </p>
        )}

        {/* Variants Selector */}
        {product.variants.length > 0 && (
          <div style={{ marginTop: '4px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--burgundy-rose)', marginBottom: '6px' }}>
              {t('selectVariantTitle')}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {/* Main Product Choice Pill */}
              {(() => {
                const mainCartQty = getCartQtyForChoice(cart, product.id, undefined);
                return (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariant(undefined);
                    }}
                    aria-pressed={selectedVariant === undefined}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: selectedVariant === undefined ? 700 : 500,
                      background: selectedVariant === undefined ? 'var(--burgundy-main)' : '#F5EFE9',
                      color: selectedVariant === undefined ? '#FFFFFF' : 'var(--burgundy-deep)',
                      border: selectedVariant === undefined ? '1px solid var(--burgundy-main)' : '1px solid var(--border-medium)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      lineHeight: 1
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ lineHeight: 1 }}>🎨</span>
                      <span>{translate(product.color || product.title)}</span>
                    </span>
                    <span>({formatPrice(product.price, lang)})</span>
                    <CartBadge count={mainCartQty} variant="pill" />
                  </button>
                );
              })()}

              {/* Variant Pills */}
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const vCartQty = getCartQtyForChoice(cart, product.id, v.id);
                return (
                  <button
                    key={v.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                    aria-pressed={isSelected}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? 'var(--burgundy-soft)' : '#F5EFE9',
                      border: isSelected ? '2px solid var(--burgundy-main)' : '1px solid var(--border-medium)',
                      color: 'var(--burgundy-deep)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      lineHeight: 1
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ lineHeight: 1 }}>🎨</span>
                      <span>{translate(v.color || v.name || product.title)}</span>
                    </span>
                    <span>({formatPrice(v.price, lang)})</span>
                    <CartBadge count={vCartQty} variant="pill" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Add to Cart */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px dashed var(--border-light)'
          }}
        >
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--burgundy-main)' }}>
            {formatPrice(currentPrice, lang)}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <QuantityControl
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              size="sm"
            />

            <button
              onClick={handleAddToCart}
              style={{
                background: isAdded
                  ? '#2E7D32'
                  : 'linear-gradient(135deg, var(--burgundy-main) 0%, var(--burgundy-dark) 100%)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.82rem',
                boxShadow: isAdded ? 'none' : 'var(--shadow-burgundy)',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isAdded ? `✓ ${t('btnAdded')}` : `+ ${t('btnBuy')}`}
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
