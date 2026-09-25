'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { DatoVariant, getOptimizedImageUrl } from '@/lib/datocms';
import {
  formatPrice,
  getProductCategoryLabels,
  getCategoryBadgeIcon,
} from '@/lib/i18n';
import {
  getCartQtyForChoice,
  getTotalProductCartQty,
  resolveActiveProductDetails,
  getCustomFieldIcon,
} from '@/lib/productUtils';
import { QuantityControl } from '@/components/QuantityControl';
import { CartBadge } from '@/components/CartBadge';
import { StockBadge } from '@/components/StockBadge';
import { WishlistButton } from '@/components/WishlistButton';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';

export const ProductDetailModal: React.FC = () => {
  const { activeProduct, activeVariant, closeProductModal, selectVariant, addToCart, toggleWishlist, isInWishlist, cart, isCartOpen } = useCart();
  const { lang, t, translate } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const modalScrollRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useModalAccessibility(
    Boolean(activeProduct),
    closeProductModal,
    modalCardRef,
    closeButtonRef
  );

  useEffect(() => {
    setQuantity(1);
    setActiveImageIndex(0);
  }, [activeProduct, activeVariant]);

  if (!activeProduct) return null;

  const isWishlisted = isInWishlist(activeProduct.id);
  const selectedVariant = activeVariant;
  const categoryLabels = getProductCategoryLabels(activeProduct, lang);

  const {
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
  } = resolveActiveProductDetails(activeProduct, selectedVariant, activeImageIndex);

  const handleVariantSelect = (v?: DatoVariant) => {
    selectVariant(v);
    setActiveImageIndex(0);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    addToCart(activeProduct, selectedVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const activeChoiceCartQty = getCartQtyForChoice(cart, activeProduct.id, selectedVariant?.id);
  const totalModalCartQty = getTotalProductCartQty(cart, activeProduct.id);
  const displayQty = activeChoiceCartQty > 0 ? activeChoiceCartQty : totalModalCartQty;

  const specItems = [
    ...(activeColor && activeColor.trim() !== '' ? [{ key: 'color', icon: '🎨', label: t('specColor'), value: translate(activeColor) }] : []),
    ...(activeSize && activeSize.trim() !== '' ? [{ key: 'size', icon: '📏', label: t('specSize'), value: translate(activeSize) }] : []),
    ...(activeSku && activeSku.trim() !== '' ? [{ key: 'sku', icon: '🆔', label: t('specSkuLabel'), value: activeSku }] : []),
    ...customFields.map((field) => ({
      key: field.key,
      icon: getCustomFieldIcon(field.label || field.key),
      label: translate(field.label),
      value: translate(field.value),
    })),
  ];

  const leftSpecs = specItems.filter((_, idx) => idx % 2 === 0);
  const rightSpecs = specItems.filter((_, idx) => idx % 2 === 1);

  const renderSpecItem = (item: { key: string; icon: string; label: string; value: React.ReactNode }) => (
    <div key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '24px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.95rem', lineHeight: 1 }}>{item.icon}</span>
      <div style={{ wordBreak: 'break-word', lineHeight: 1.2, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <strong>{item.label}:</strong> <span>{item.value}</span>
      </div>
    </div>
  );

  return (
    <div
      className="product-detail-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(42, 8, 15, 0.65)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.25s ease',
        touchAction: 'none'
      }}
      onClick={closeProductModal}
    >
      <div
        ref={modalCardRef}
        role="dialog"
        aria-modal={!isCartOpen}
        aria-hidden={isCartOpen ? true : undefined}
        aria-labelledby="product-detail-modal-title"
        tabIndex={-1}
        className="product-detail-modal-card mobile-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          color: 'var(--text-primary)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '82vh',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          ref={modalScrollRef}
          className="product-detail-modal-scroll custom-scrollbar"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            overflowY: 'auto',
            maxHeight: '82vh',
            width: '100%'
          }}
        >
          {/* Left Column: Image & Gallery */}
          <div className="product-detail-image-col" style={{ padding: '24px', background: '#FAF8F5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              className="product-detail-image-frame"
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '92%',
                backgroundColor: '#FAF8F5',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
            >
              {/* Wishlist Heart Overlay Button */}
              <WishlistButton
                isWishlisted={isWishlisted}
                onToggle={() => toggleWishlist(activeProduct.id)}
                title={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
                position="top-left"
              />

              {/* Modal Close Button */}
              <button
                ref={closeButtonRef}
                onClick={closeProductModal}
                aria-label={t('btnClose')}
                title={t('btnClose')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.92)',
                  color: 'var(--burgundy-deep)',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease, background-color 0.2s ease'
                }}
              >
                ✕
              </button>

              <img
                src={currentDisplayImage}
                alt={translate(activeProduct.title)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: 'scale(1.15)',
                  transition: 'transform 0.4s ease'
                }}
              />
              {selectedGallery.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.65)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  📷 {t('galleryTitle')} ({activeImageIndex + 1}/{selectedGallery.length})
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {selectedGallery.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                {selectedGallery.map((img, idx) => {
                  const thumbUrl = getOptimizedImageUrl(img, { trim: true, w: 200 });
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`${t('galleryImageAria')} ${idx + 1}/${selectedGallery.length}`}
                      aria-pressed={activeImageIndex === idx}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: activeImageIndex === idx ? '2px solid var(--burgundy-main)' : '1px solid var(--border-medium)',
                        opacity: activeImageIndex === idx ? 1 : 0.65,
                        flexShrink: 0,
                        padding: 0
                      }}
                    >
                      <img src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs */}
          <div className="product-detail-specs-col" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {categoryLabels.map((catLabel, idx) => (
                  <span key={idx} className="badge-gold">
                    {getCategoryBadgeIcon(catLabel)} {catLabel}
                  </span>
                ))}
              </div>

              <h2
                id="product-detail-modal-title"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', color: 'var(--burgundy-deep)', margin: 0 }}
              >
                {translate(activeTitle)}
              </h2>
            </div>

            {/* Price Tag & In Stock Badge */}
            <div style={{ background: 'var(--card-bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '8px', border: '1px solid var(--border-light)' }}>
              <div>
                <span style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)', fontWeight: 800, color: 'var(--burgundy-main)', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>
                  {formatPrice(price * quantity, lang)}
                </span>
                {displayQty > 0 && (
                  <div style={{ marginTop: '2px' }}>
                    <CartBadge count={displayQty} label={t('amountInCart')} variant="inline" />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                <StockBadge
                  quantity={stockQty}
                  inStockText={t('specInStock')}
                  outOfStockText={t('outOfStock')}
                  unitText={t('unitPieces')}
                />
                {activeDeliveryTime && activeDeliveryTime.trim() !== '' && (
                  <span style={{ color: 'var(--burgundy-deep)', fontSize: '0.74rem', fontWeight: 600, background: '#F5EFE9', padding: '2px 7px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    🚚 {t('specDeliveryTime')}: {translate(activeDeliveryTime)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              {translate(activeDescription)}
            </p>

            {/* Variant Selector Pills */}
            {activeProduct.variants && activeProduct.variants.length > 0 && (
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--burgundy-deep)' }}>
                  {t('selectVariantLabel')}
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '100%' }}>
                  {/* Main Product Choice Pill */}
                  {(() => {
                    const mainCartQty = getCartQtyForChoice(cart, activeProduct.id, undefined);
                    return (
                      <button
                        onClick={() => handleVariantSelect(undefined)}
                        aria-pressed={selectedVariant === undefined}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-full)',
                          border: selectedVariant === undefined ? '2px solid var(--burgundy-main)' : '1px solid var(--border-medium)',
                          background: selectedVariant === undefined ? 'var(--burgundy-subtle)' : 'var(--bg-cream)',
                          color: selectedVariant === undefined ? 'var(--burgundy-deep)' : 'var(--text-primary)',
                          fontWeight: selectedVariant === undefined ? 700 : 500,
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          maxWidth: '100%',
                          boxShadow: selectedVariant === undefined ? 'var(--shadow-sm)' : 'none'
                        }}
                      >
                        🎨 <strong>{translate(activeProduct.color || activeProduct.title)}</strong> <strong>{formatPrice(activeProduct.price, lang)}</strong>
                        <CartBadge count={mainCartQty} variant="pill" />
                      </button>
                    );
                  })()}

                  {/* Variant Pills */}
                  {activeProduct.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vCartQty = getCartQtyForChoice(cart, activeProduct.id, v.id);
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVariantSelect(v)}
                        aria-pressed={isSelected}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-full)',
                          border: isSelected ? '2px solid var(--burgundy-main)' : '1px solid var(--border-medium)',
                          background: isSelected ? 'var(--burgundy-subtle)' : 'var(--bg-cream)',
                          color: isSelected ? 'var(--burgundy-deep)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          maxWidth: '100%',
                          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                        }}
                      >
                        🎨 <strong>{translate(v.color || v.name || activeProduct.title)}</strong> <strong>{formatPrice(v.price, lang)}</strong>
                        <CartBadge count={vCartQty} variant="pill" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Variant / Product Specs Card */}
            {specItems.length > 0 && (
              <div style={{ background: 'var(--bg-cream)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--burgundy-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  {selectedVariant === undefined ? t('mainProductSpecsTitle') : t('selectedVariantSpecsTitle')}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {leftSpecs.map(renderSpecItem)}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {rightSpecs.map(renderSpecItem)}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 'auto' }}>
              <QuantityControl
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                size="md"
                stopPropagation={false}
              />

              <button
                onClick={handleAddToCart}
                style={{
                  flexGrow: 1,
                  background: addedSuccess ? '#2E7D32' : 'linear-gradient(135deg, var(--burgundy-main) 0%, var(--burgundy-dark) 100%)',
                  color: 'white',
                  padding: '14px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-burgundy)'
                }}
              >
                {addedSuccess ? `✓ ${t('btnAdded')}` : t('btnAddToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
