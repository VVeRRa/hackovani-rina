'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const CraftStory: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      id="story"
      style={{
        background: 'linear-gradient(180deg, var(--bg-main) 0%, var(--bg-cream) 100%)',
        padding: '90px 24px',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)',
                position: 'relative'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=1000&q=80"
                alt={t('craftStoryImageAlt')}
                style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '-24px',
                right: '-16px',
                background: 'rgba(74, 14, 23, 0.94)',
                color: 'white',
                padding: '20px 28px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-burgundy)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--accent-gold)',
                maxWidth: '280px'
              }}
            >
              <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', fontWeight: 700 }}>
                100%
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>
                {t('craftStoryMaterialBadge')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                {t('craftStoryMaterialSub')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--burgundy-rose)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em'
                }}
              >
                {t('craftStoryEyebrow')}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.5rem',
                  color: 'var(--burgundy-deep)',
                  marginTop: '6px',
                  lineHeight: 1.2
                }}
              >
                {t('craftStoryTitle')}
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              {t('craftStoryBody')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
              <div
                style={{
                  background: 'white',
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>🧶</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--burgundy-deep)', marginBottom: '4px' }}>
                  {t('craftStoryMaterialTitle')}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {t('craftStoryMaterialText')}
                </p>
              </div>

              <div
                style={{
                  background: 'white',
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>✨</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--burgundy-deep)', marginBottom: '4px' }}>
                  {t('craftStoryPatternTitle')}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {t('craftStoryPatternText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
