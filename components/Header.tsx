'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { DatoPage, DatoSiteInfo } from '@/lib/datocms';
import type { Language } from '@/lib/i18n';

interface HeaderProps {
  siteInfo: DatoSiteInfo;
  pages: DatoPage[];
  onSelectPage?: (page: DatoPage) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  showOnlyWishlist?: boolean;
  onToggleWishlistFilter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteInfo,
  pages,
  onSelectPage,
  searchTerm: externalSearchTerm = '',
  onSearchChange,
  showOnlyWishlist = false,
  onToggleWishlistFilter,
}) => {
  const { openCart, totalCartItems, wishlist, activeProduct, activeVariant } = useCart();
  const { lang, setLang, t, translate } = useLanguage();
  const [internalSearchTerm, setInternalSearchTerm] = useState(externalSearchTerm);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSearchTerm = onSearchChange ? externalSearchTerm : internalSearchTerm;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearchTerm(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleClearSearch = () => {
    setInternalSearchTerm('');
    if (onSearchChange) onSearchChange('');
  };


  return (
    <header
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        background: 'transparent',
        boxShadow: 'none'
      }}
    >
      {/* Main Unified 1-Line Navbar */}
      <nav
        className="header-nav-container"
        style={{
          padding: '20px 24px 10px 24px',
          background: 'transparent',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto'
        }}
      >
        <div
          className="header-main-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          {/* 1st Div Child: Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6B1426 0%, #4A0E17 100%)',
                  color: '#F7E9B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.35rem',
                  border: '2px solid #F7E9B8',
                  boxShadow: '0 0 14px rgba(247, 233, 184, 0.5), inset 0 0 8px rgba(247, 233, 184, 0.2)',
                  flexShrink: 0
                }}
              >
                {translate(siteInfo.name).charAt(0)}
              </div>
              <div className="header-logo-text">
                <span
                  className="header-logo-title"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
                    fontWeight: 700,
                    color: '#F7E9B8',
                    letterSpacing: '0.02em',
                    display: 'block',
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {translate(siteInfo.name).replace(/\s*eshop/gi, '')}
                </span>
                <span
                  className="header-logo-subtitle"
                  style={{
                    fontSize: '0.68rem',
                    color: 'rgba(247, 233, 184, 0.75)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    fontWeight: 600
                  }}
                >
                  {t('siteSubtitle')}
                </span>
              </div>
            </a>
          </div>

          {/* 2nd Div Child: Desktop Navigation Links (Visible on Desktop >= 960px) */}
          <div className="desktop-nav-links" style={{ gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="desktop-nav-link"
            >
              🛍️ {t('catalogTitle')}
            </a>
            {pages.map((pg) => (
              <button
                key={pg.id}
                onClick={() => onSelectPage && onSelectPage(pg)}
                className="desktop-nav-link"
              >
                📄 {translate(pg.title)}
              </button>
            ))}
          </div>

          {/* 3rd Div Child: Desktop Search Box (Visible on Desktop >= 960px) */}
          <div className="desktop-search-box" style={{ position: 'relative', width: '220px', flexShrink: 0 }}>
            <input
              type="search"
              aria-label={t('searchAria')}
              placeholder={t('searchPlaceholder')}
              value={currentSearchTerm}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: currentSearchTerm ? '8px 28px 8px 34px' : '8px 14px 8px 34px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(247, 233, 184, 0.45)',
                background: 'rgba(0, 0, 0, 0.35)',
                fontSize: '0.85rem',
                color: '#FFFFFF',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
              }}
            />
            <svg
              style={{
                position: 'absolute',
                left: '11px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#F7E9B8'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {currentSearchTerm !== '' && (
              <button
                type="button"
                onClick={handleClearSearch}
                title={t('clearSearch')}
                aria-label={t('clearSearch')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#F7E9B8',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  padding: 0,
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* 4th Div Child: Languages Select Dropdown */}
          <div className="header-lang-container" style={{ alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language, activeProduct, activeVariant)}
              aria-label={t('languageSelectAria')}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                color: '#F7E9B8',
                border: '1px solid rgba(247, 233, 184, 0.45)',
                padding: '7px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <option value="cs" style={{ background: '#4A0E17', color: '#F7E9B8' }}>🇨🇿 CZ</option>
              <option value="en" style={{ background: '#4A0E17', color: '#F7E9B8' }}>🇬🇧 EN</option>
              <option value="de" style={{ background: '#4A0E17', color: '#F7E9B8' }}>🇩🇪 DE</option>
            </select>
          </div>

          {/* 5th Div Child: Action Controls [ Favourites | Cart | Burger Menu (Mobile/Tablet only) ] */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Wishlist Favourites Heart Toggle */}
            <button
              onClick={() => {
                if (onToggleWishlistFilter) onToggleWishlistFilter();
              }}
              title={showOnlyWishlist ? t('wishlistFilterClear') : t('wishlistFilterTitle')}
              aria-label={t('wishlistToggleAria')}
              aria-pressed={showOnlyWishlist}
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                background: showOnlyWishlist ? '#F7E9B8' : 'rgba(247, 233, 184, 0.18)',
                border: showOnlyWishlist ? '1px solid #F7E9B8' : '1px solid rgba(247, 233, 184, 0.4)',
                color: showOnlyWishlist ? '#4A0E17' : '#F7E9B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: showOnlyWishlist ? '0 2px 10px rgba(247, 233, 184, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <svg style={{ width: '19px', height: '19px' }} fill={showOnlyWishlist || wishlist.length > 0 ? (showOnlyWishlist ? '#4A0E17' : 'currentColor') : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: showOnlyWishlist ? '#4A0E17' : '#F7E9B8',
                    color: showOnlyWishlist ? '#F7E9B8' : '#4A0E17',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #F7E9B8 0%, #E5C467 100%)',
                color: '#4A0E17',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(247, 233, 184, 0.4)',
                flexShrink: 0
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="#4A0E17" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span style={{ color: '#4A0E17', fontWeight: 800 }}>{t('cartButton')}</span>
              {totalCartItems > 0 && (
                <span
                  style={{
                    background: '#4A0E17',
                    color: '#F7E9B8',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Burger Menu Button (Hidden on Desktop >= 960px via CSS) */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={t('navigationToggleAria')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                background: isMobileMenuOpen ? '#F7E9B8' : 'rgba(247, 233, 184, 0.18)',
                border: isMobileMenuOpen ? '1px solid #F7E9B8' : '1px solid rgba(247, 233, 184, 0.4)',
                color: isMobileMenuOpen ? '#4A0E17' : '#F7E9B8',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Expandable Dropdown Menu (Opened via Burger Toggle ☰) */}
        {isMobileMenuOpen && (
          <div
            id="mobile-site-menu"
            className="mobile-menu-dropdown animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '1280px',
              margin: '12px auto 0 auto',
              padding: '16px',
              background: 'rgba(42, 8, 15, 0.95)',
              backdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(247, 233, 184, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Mobile Language Switcher (Visible on Mobile inside Burger Dropdown) */}
            <div
              className="mobile-lang-dropdown"
              style={{
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(247, 233, 184, 0.2)'
              }}
            >
              <button
                onClick={() => setLang('cs', activeProduct, activeVariant)}
                aria-label={t('languageCzech')}
                aria-pressed={lang === 'cs'}
                style={{
                  background: lang === 'cs' ? '#F7E9B8' : 'rgba(255,255,255,0.12)',
                  color: lang === 'cs' ? '#4A0E17' : '#F7E9B8',
                  border: lang === 'cs' ? '1px solid #F7E9B8' : '1px solid rgba(247,233,184,0.3)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🇨🇿 CZ
              </button>
              <button
                onClick={() => setLang('en', activeProduct, activeVariant)}
                aria-label={t('languageEnglish')}
                aria-pressed={lang === 'en'}
                style={{
                  background: lang === 'en' ? '#F7E9B8' : 'rgba(255,255,255,0.12)',
                  color: lang === 'en' ? '#4A0E17' : '#F7E9B8',
                  border: lang === 'en' ? '1px solid #F7E9B8' : '1px solid rgba(247,233,184,0.3)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLang('de', activeProduct, activeVariant)}
                aria-label={t('languageGerman')}
                aria-pressed={lang === 'de'}
                style={{
                  background: lang === 'de' ? '#F7E9B8' : 'rgba(255,255,255,0.12)',
                  color: lang === 'de' ? '#4A0E17' : '#F7E9B8',
                  border: lang === 'de' ? '1px solid #F7E9B8' : '1px solid rgba(247,233,184,0.3)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🇩🇪 DE
              </button>
            </div>
            {/* Search Box in Burger Menu */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="search"
                aria-label={t('searchAria')}
                placeholder={t('searchPlaceholder')}
                value={currentSearchTerm}
                onChange={handleSearch}
                style={{
                  width: '100%',
                  padding: currentSearchTerm ? '10px 32px 10px 38px' : '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(247, 233, 184, 0.65)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
              <svg
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#F7E9B8'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {currentSearchTerm !== '' && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title={t('clearSearch')}
                aria-label={t('clearSearch')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#F7E9B8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    padding: 0,
                    lineHeight: 1
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Navigation Links in Burger Menu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(247, 233, 184, 0.12)',
                  color: '#F7E9B8',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none'
                }}
              >
                🛍️ {t('catalogTitle')}
              </a>
              {pages.map((pg) => (
                <button
                  key={pg.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onSelectPage) onSelectPage(pg);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#F7E9B8',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  📄 {translate(pg.title)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
