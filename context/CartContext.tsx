'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatoProduct, DatoVariant } from '@/lib/datocms';
import { useLanguage } from '@/context/LanguageContext';
import { getProductUrl } from '@/lib/i18n';
import {
  addCartItem,
  calculateCartTotals,
  parseStoredArray,
  removeCartItem,
  toggleWishlistItem,
  updateCartItemQuantity,
} from '@/lib/cartState.mjs';

export interface CartItem {
  id: string; // product.id + variant.id
  product: DatoProduct;
  selectedVariant?: DatoVariant;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // array of product ids
  isCartOpen: boolean;
  activeProduct: DatoProduct | null;
  activeVariant: DatoVariant | undefined;
  addToCart: (product: DatoProduct, selectedVariant?: DatoVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  openProductModal: (product: DatoProduct, variant?: DatoVariant) => void;
  closeProductModal: () => void;
  selectVariant: (variant?: DatoVariant) => void;
  totalCartItems: number;
  totalCartPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hasHydratedStorage, setHasHydratedStorage] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<DatoProduct | null>(null);
  const [activeVariant, setActiveVariant] = useState<DatoVariant | undefined>(undefined);

  // Load persisted state before allowing save effects to overwrite storage.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('datocms_eshop_cart');
      setCart(parseStoredArray<CartItem>(savedCart));

      const savedWishlist = localStorage.getItem('datocms_eshop_wishlist');
      setWishlist(
        parseStoredArray<unknown>(savedWishlist).filter(
          (item): item is string => typeof item === 'string'
        )
      );
    } finally {
      setHasHydratedStorage(true);
    }
  }, []);

  // Do not write the initial empty React state over values that still need to hydrate.
  useEffect(() => {
    if (!hasHydratedStorage) return;

    try {
      localStorage.setItem('datocms_eshop_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Could not save cart', e);
    }
  }, [cart, hasHydratedStorage]);

  useEffect(() => {
    if (!hasHydratedStorage) return;

    try {
      localStorage.setItem('datocms_eshop_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Could not save wishlist', e);
    }
  }, [wishlist, hasHydratedStorage]);

  // Strict body & html scroll lock when cart drawer or product modal is active
  useEffect(() => {
    const isOpen = isCartOpen || !!activeProduct;
    if (isOpen) {
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      document.body.style.overflow = '';
    };
  }, [isCartOpen, activeProduct]);

  const addToCart = (product: DatoProduct, selectedVariant?: DatoVariant, quantity = 1) => {
    setCart((prev) => addCartItem(prev, product, selectedVariant, quantity));

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => removeCartItem(prev, cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => updateCartItemQuantity(prev, cartItemId, delta));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => toggleWishlistItem(prev, productId));
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openProductModal = (product: DatoProduct, variant?: DatoVariant) => {
    setActiveProduct(product);
    setActiveVariant(variant);
    const targetUrl = getProductUrl(product, variant, lang);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ productId: product.id, variantId: variant?.id }, '', targetUrl);
    }
  };

  const selectVariant = (variant?: DatoVariant) => {
    setActiveVariant(variant);
    if (activeProduct) {
      const targetUrl = getProductUrl(activeProduct, variant, lang);
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ productId: activeProduct.id, variantId: variant?.id }, '', targetUrl);
      }
    }
  };

  const closeProductModal = () => {
    setActiveProduct(null);
    setActiveVariant(undefined);
    if (typeof window !== 'undefined') {
      const langPrefix = lang === 'cs' ? '' : `/${lang}`;
      const baseTargetUrl = langPrefix || '/';
      if (window.location.pathname !== baseTargetUrl && window.location.pathname !== '/') {
        window.history.pushState({}, '', baseTargetUrl);
      }
    }
  };

  const { items: totalCartItems, price: totalCartPrice } =
    calculateCartTotals(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        activeProduct,
        activeVariant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        openCart,
        closeCart,
        openProductModal,
        closeProductModal,
        selectVariant,
        totalCartItems,
        totalCartPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
