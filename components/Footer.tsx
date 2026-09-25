'use client';

import React from 'react';
import { DatoPage, DatoSiteInfo } from '@/lib/datocms';
import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
  siteInfo: DatoSiteInfo;
  pages: DatoPage[];
  onSelectPage?: (page: DatoPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ siteInfo, pages, onSelectPage }) => {
  const { t, translate } = useLanguage();

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #4A0E17 0%, #2A080F 100%)',
        color: 'white',
        paddingTop: '60px',
        paddingBottom: '36px',
        borderTop: '1px solid rgba(197, 160, 40, 0.3)',
        marginTop: '60px'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Site info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
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
                  fontSize: '1.4rem',
                  border: '2px solid #F7E9B8',
                  boxShadow: '0 0 14px rgba(247, 233, 184, 0.5), inset 0 0 8px rgba(247, 233, 184, 0.2)',
                  flexShrink: 0
                }}
              >
                {translate(siteInfo.name).charAt(0)}
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#FFFFFF', fontWeight: 700 }}>
                {translate(siteInfo.name)}
              </span>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {t('footerDesc')}
            </p>
          </div>

          {/* Site Pages */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#F7E9B8', fontSize: '1.1rem', marginBottom: '16px' }}>
              {t('footerNavTitle')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              {pages.map((pg) => (
                <li key={pg.id}>
                  <button
                    onClick={() => onSelectPage && onSelectPage(pg)}
                    style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'left', transition: 'color 0.2s' }}
                  >
                    📖 {translate(pg.title)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Assurance Info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#F7E9B8', fontSize: '1.1rem', marginBottom: '16px' }}>
              {t('footerPromiseTitle')}
            </h4>
            <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>• {t('footerPromise1')}</div>
              <div>• {t('footerPromise2')}</div>
              <div>• {t('footerPromise3')}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.6)'
          }}
        >
          <div>
            © {new Date().getFullYear()} {translate(siteInfo.name)}. {t('footerCopyright')}
          </div>
        </div>
      </div>
    </footer>
  );
};
