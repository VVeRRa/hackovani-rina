'use client';

import React, { useState, useEffect } from 'react';
import { DatoProduct, DatoPage, DatoSiteInfo, DatoCategory, DatoHero } from '@/lib/datocms';
import { Header } from './Header';
import { Hero } from './Hero';
import { ProductGrid } from './ProductGrid';
import { ContactForm } from './ContactForm';
import { Footer } from './Footer';
import { ProductDetailModal } from './ProductDetailModal';
import { DatoPageModal } from './DatoPageModal';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { autoTranslate, slugify, getPageUrl, Language } from '@/lib/i18n';

interface MainLayoutProps {
  siteInfo: DatoSiteInfo;
  products: DatoProduct[];
  pages: DatoPage[];
  categories: DatoCategory[];
  hero?: DatoHero;
  initialUrlSlug?: string[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  siteInfo: initialSiteInfo,
  products: initialProducts,
  pages: initialPages,
  categories: initialCategories,
  hero: initialHero,
  initialUrlSlug,
}) => {
  const siteInfo = initialSiteInfo;
  const products = initialProducts;
  const pages = initialPages;
  const categories = initialCategories;
  const hero = initialHero;

  const [selectedPage, setSelectedPage] = useState<DatoPage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);

  const { openProductModal, closeProductModal, activeProduct } = useCart();
  const { lang, setLang } = useLanguage();

  const handleSelectPage = (pg: DatoPage | null) => {
    setSelectedPage(pg);
    if (pg) {
      const pageUrl = getPageUrl(pg, lang);
      window.history.pushState({ pageId: pg.id }, '', pageUrl);
    } else {
      const rootUrl = lang === 'cs' ? '/' : `/${lang}`;
      window.history.pushState({}, '', rootUrl);
    }
  };

  // Synchronize modal state & page modals with URL path & browser Back/Forward popstate events
  useEffect(() => {
    const handleUrlRouteSync = () => {
      const pathnameParts = window.location.pathname.split('/').filter(Boolean);

      let currentParts = [...pathnameParts];

      let detectedLang: Language = lang;
      if (currentParts.length > 0 && ['cs', 'en', 'de'].includes(currentParts[0])) {
        detectedLang = currentParts[0] as Language;
        currentParts = currentParts.slice(1);
      }

      // Check for Page Route (e.g. /o-mne, /kontakty, /en/about-me, /en/contacts)
      if (currentParts.length === 1) {
        const targetSlug = currentParts[0];
        const matchedPage = pages.find((p) => {
          const pSlug = p.slug || slugify(p.title);
          const pTranslatedSlug = slugify(autoTranslate(p.title, detectedLang));
          return (
            pSlug === targetSlug ||
            pTranslatedSlug === targetSlug ||
            slugify(p.title) === targetSlug
          );
        });

        if (matchedPage) {
          setSelectedPage(matchedPage);
          closeProductModal();
          return;
        }
      }

      // If root path (e.g. / or /en or /de)
      if (currentParts.length === 0) {
        setSelectedPage(null);
        if (activeProduct) {
          closeProductModal();
        }
        return;
      }

      // Pattern for Products:
      // Main product: .../slug/scu (2 parts e.g. ['seda-taska', 'BAG-GREY-01'])
      // Variant: .../slug/variant/scu (3 parts e.g. ['seda-taska', 'varianta', 'BAG-RED-02'])
      let targetProductSlug = currentParts[0];
      let targetVariantSku: string | undefined = undefined;

      if (currentParts.length >= 3) {
        targetVariantSku = decodeURIComponent(currentParts[2]);
      } else if (currentParts.length === 2) {
        targetVariantSku = decodeURIComponent(currentParts[1]);
      }

      const matchedProduct = products.find((p) => {
        const pSlug = p.slug || slugify(p.title);
        const pTranslatedSlug = slugify(autoTranslate(p.title, detectedLang));
        return (
          pSlug === targetProductSlug ||
          pTranslatedSlug === targetProductSlug ||
          slugify(p.title) === targetProductSlug ||
          (targetVariantSku && p.variants.some((v) => v.sku === targetVariantSku || v.sku === targetProductSlug))
        );
      });

      if (matchedProduct) {
        const matchedVariant = matchedProduct.variants.find(
          (v) => v.sku === targetVariantSku || v.id === targetVariantSku
        );
        setSelectedPage(null);
        openProductModal(matchedProduct, matchedVariant);
      } else {
        closeProductModal();
      }
    };

    handleUrlRouteSync();

    window.addEventListener('popstate', handleUrlRouteSync);
    return () => {
      window.removeEventListener('popstate', handleUrlRouteSync);
    };
  }, [products, pages, lang]);

  const homePage = pages.find((p) => p.slug === 'home') || pages[0];

  const handleToggleWishlistFilter = () => {
    setShowOnlyWishlist((prev) => {
      const nextState = !prev;
      if (nextState) {
        const el = document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return nextState;
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Unified Hero Block with Vertical Gold Side Bars */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          background: 'linear-gradient(180deg, #3B0A11 0%, #4A0E17 45%, #2A060C 100%)',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
          borderBottom: '1px solid rgba(247, 233, 184, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Transparent Header */}
        <Header
          siteInfo={siteInfo}
          pages={pages}
          onSelectPage={(pg) => handleSelectPage(pg)}
          searchTerm={searchTerm}
          onSearchChange={(term) => setSearchTerm(term)}
          showOnlyWishlist={showOnlyWishlist}
          onToggleWishlistFilter={handleToggleWishlistFilter}
        />

        {/* Hero Section Content */}
        <Hero siteInfo={siteInfo} hero={hero} homePage={homePage} onSelectPage={(pg) => handleSelectPage(pg)} />
      </div>

      {/* Main Content */}
      <main style={{ flexGrow: 1 }}>
        {/* DatoCMS Products Catalog & Category Pills */}
        <ProductGrid
          products={products}
          categories={categories}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
          showOnlyWishlist={showOnlyWishlist}
          onClearWishlistFilter={() => setShowOnlyWishlist(false)}
        />

        {/* Contact Form Section */}
        <section id="contact" style={{ maxWidth: '1280px', margin: '40px auto 0 auto', padding: '0 24px' }}>
          <ContactForm />
        </section>
      </main>

      {/* Footer */}
      <Footer siteInfo={siteInfo} pages={pages} onSelectPage={(pg) => handleSelectPage(pg)} />

      {/* Modals */}
      <ProductDetailModal />
      <DatoPageModal page={selectedPage} onClose={() => handleSelectPage(null)} />
      <CartDrawer />
    </div>
  );
};
