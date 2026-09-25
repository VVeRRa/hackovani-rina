'use client';

import React, { useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import { formatPrice } from '@/lib/i18n';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, clearCart, totalCartPrice } = useCart();
  const { lang, t, translate } = useLanguage();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useModalAccessibility(isCartOpen, closeCart, drawerRef, closeButtonRef);

  if (!isCartOpen) return null;

  const discountAmount = Math.round((totalCartPrice * discountPercent) / 100);
  const shippingFee = totalCartPrice >= 2000 || cart.length === 0 ? 0 : 99;
  const finalPrice = Math.max(0, totalCartPrice - discountAmount + shippingFee);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SLEVA10') {
      setDiscountPercent(10);
      setPromoError('');
    } else {
      setPromoError(t('invalidVoucher'));
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    setTimeout(() => {
      clearCart();
      setOrderComplete(false);
      setIsCheckingOut(false);
      closeCart();
    }, 3000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(42, 8, 15, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={closeCart}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          maxHeight: '100dvh',
          background: '#FFFFFF',
          color: 'var(--text-primary)',
          borderLeft: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            paddingTop: 'max(20px, env(safe-area-inset-top))',
            background: 'linear-gradient(135deg, #4A0E17 0%, #6B1426 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛒</span>
            <div>
              <h3
                id="cart-drawer-title"
                style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.2rem', margin: 0 }}
              >
                {t('cartTitle')}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#F7E9B8' }}>
                {cart.length} {cart.length === 1 ? t('cartItemsCount1') : cart.length >= 2 && cart.length <= 4 ? t('cartItemsCountFew') : t('cartItemsCountMany')}
              </span>
            </div>
          </div>

          <button ref={closeButtonRef} onClick={closeCart} aria-label={t('btnClose')} title={t('btnClose')} style={{ color: 'white', fontSize: '1.4rem', fontWeight: 'bold' }}>
            ✕
          </button>
        </div>

        {/* Cart Body */}
        {isCheckingOut ? (
          <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
            {orderComplete ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✨</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--burgundy-deep)', fontSize: '1.6rem' }}>
                  {t('orderSuccessTitle')}
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
                  {t('orderSuccessSub')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCompleteOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--burgundy-deep)' }}>
                  {t('checkoutDeliveryTitle')}
                </h4>

                <div>
                  <label htmlFor="checkout-name" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('inputNameLabel')}</label>
                  <input id="checkout-name" name="name" autoComplete="name" required placeholder={t('checkoutNamePlaceholder')} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-cream)', marginTop: '4px' }} />
                </div>

                <div>
                  <label htmlFor="checkout-email" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('inputEmailLabel')}</label>
                  <input id="checkout-email" name="email" autoComplete="email" required type="email" placeholder={t('checkoutEmailPlaceholder')} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-cream)', marginTop: '4px' }} />
                </div>

                <div>
                  <label htmlFor="checkout-address" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('inputAddressLabel')}</label>
                  <input id="checkout-address" name="address" autoComplete="street-address" required placeholder={t('checkoutAddressPlaceholder')} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-cream)', marginTop: '4px' }} />
                </div>

                <div style={{ background: 'var(--bg-cream)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--burgundy-deep)' }}>
                    <span>{t('cartTotal')}</span>
                    <span>{formatPrice(finalPrice, lang)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsCheckingOut(false)} style={{ padding: '12px 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                    {t('btnBack')}
                  </button>
                  <button type="submit" style={{ flexGrow: 1, background: 'linear-gradient(135deg, var(--burgundy-main) 0%, var(--burgundy-dark) 100%)', color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                    {t('btnCompleteOrder')}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            <div className="custom-scrollbar" style={{ flexGrow: 1, overflowY: 'auto', padding: '20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--burgundy-deep)' }}>
                    {t('cartEmptyTitle')}
                  </h4>
                  <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
                    {t('cartEmptySub')}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cart.map((item) => {
                    const isVariant = !!item.selectedVariant;
                    const price = item.selectedVariant?.price || item.product.price || 0;
                    const img = (item.selectedVariant?.gallery && item.selectedVariant.gallery.length > 0)
                      ? item.selectedVariant.gallery[0]
                      : (item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80');

                    const displayTitle = isVariant
                      ? (item.selectedVariant?.name || item.product.title)
                      : item.product.title;

                    const displayColor = isVariant ? item.selectedVariant?.color : item.product.color;
                    const displaySize = isVariant ? item.selectedVariant?.size : item.product.size;

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          gap: '14px',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          background: 'var(--card-bg-subtle)'
                        }}
                      >
                        <img src={img} alt="" style={{ width: '65px', height: '65px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />

                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: 'var(--burgundy-deep)', margin: 0 }}>
                                {translate(displayTitle)}
                              </h4>
                              <div style={{ fontSize: '0.78rem', color: 'var(--burgundy-rose)', marginTop: '2px' }}>
                                {(displayColor || displaySize) ? (
                                  <span>
                                    {t('specColor')}: {translate(displayColor || t('defaultLabel'))} {displaySize ? `(${translate(displaySize)})` : ''}
                                  </span>
                                ) : (
                                  <span>{t('mainProductLabel')}</span>
                                )}
                                {isVariant && (
                                  <span style={{ marginLeft: '6px', opacity: 0.8, fontStyle: 'italic' }}>
                                    • {t('urlVariantKeyword')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} aria-label={t('cartRemoveItem')} title={t('cartRemoveItem')} style={{ color: '#999', cursor: 'pointer', padding: '2px 6px', fontSize: '0.9rem' }}>✕</button>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-full)', padding: '2px 6px', background: 'white' }}>
                              <button onClick={() => updateQuantity(item.id, -1)} aria-label={t('quantityDecrease')} title={t('quantityDecrease')} style={{ width: '22px', height: '22px', fontWeight: 'bold', color: 'var(--burgundy-deep)' }}>-</button>
                              <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} aria-label={t('quantityIncrease')} title={t('quantityIncrease')} style={{ width: '22px', height: '22px', fontWeight: 'bold', color: 'var(--burgundy-deep)' }}>+</button>
                            </div>

                            <span style={{ fontWeight: 700, color: 'var(--burgundy-main)', fontSize: '1rem' }}>
                              {formatPrice(price * item.quantity, lang)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div style={{ padding: '20px 24px', background: 'var(--bg-cream)', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="voucher-input"
                    aria-label={t('voucherAria')}
                    placeholder={t('voucherPlaceholder')}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      flexGrow: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-medium)',
                      background: '#FFFFFF',
                      fontSize: '0.88rem',
                      color: 'var(--burgundy-deep)',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                  <button onClick={handleApplyPromo} style={{ background: 'var(--burgundy-main)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                    {t('btnApplyVoucher')}
                  </button>
                </div>

                {promoError && <span role="alert" aria-live="polite" style={{ color: '#d32f2f', fontSize: '0.78rem' }}>{promoError}</span>}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--burgundy-deep)', marginTop: '4px' }}>
                  <span>{t('cartTotal')}</span>
                  <span>{formatPrice(finalPrice, lang)}</span>
                </div>

                <button onClick={() => setIsCheckingOut(true)} style={{ width: '100%', background: 'linear-gradient(135deg, var(--burgundy-main) 0%, var(--burgundy-dark) 100%)', color: 'white', padding: '14px', borderRadius: 'var(--radius-full)', fontWeight: 700, textAlign: 'center' }}>
                  {t('btnProceedCheckout')}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
