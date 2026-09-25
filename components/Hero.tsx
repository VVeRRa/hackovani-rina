'use client';

import React from 'react';
import { DatoPage, DatoSiteInfo, DatoHero } from '@/lib/datocms';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  siteInfo: DatoSiteInfo;
  hero?: DatoHero;
  homePage?: DatoPage;
  onSelectPage?: (page: DatoPage) => void;
}

export const Hero: React.FC<HeroProps> = ({ siteInfo, hero, homePage, onSelectPage }) => {
  const { t, translate } = useLanguage();

  return (
    <section
      style={{
        position: 'relative',
        padding: '30px 24px 70px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        color: '#F7E9B8',
        zIndex: 5
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Gold & Bordeaux Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(247, 233, 184, 0.12)',
            border: '1px solid rgba(247, 233, 184, 0.35)',
            color: '#F7E9B8',
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span>🤝 {t('heroBadge')}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontFamily: 'var(--font-heading)',
            color: '#F7E9B8',
            marginBottom: '18px',
            lineHeight: 1.15,
            maxWidth: '900px',
            margin: '0 auto 20px auto',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          {hero?.heading ? translate(hero.heading) : (homePage ? translate(homePage.title) : translate(siteInfo.name))}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
            color: 'rgba(247, 233, 184, 0.88)',
            maxWidth: '740px',
            margin: '0 auto 32px auto',
            lineHeight: 1.65,
            fontWeight: 400
          }}
        >
          {hero?.text ? translate(hero.text) : t('heroSubtitle')}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Primary CTA */}
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'linear-gradient(135deg, #F7E9B8 0%, #E5C467 100%)',
              color: '#4A0E17',
              padding: '14px 34px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 20px rgba(247, 233, 184, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none'
            }}
          >
            <span style={{ color: '#4A0E17', fontWeight: 800 }}>{t('btnExploreCatalog')}</span>
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="#4A0E17" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
