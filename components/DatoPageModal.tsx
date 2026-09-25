'use client';

import React from 'react';
import {
  DatoPage,
  DatoStructuredTextNode,
} from '@/lib/datocms';
import { useLanguage } from '@/context/LanguageContext';
import { ContactForm } from './ContactForm';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';

interface DatoPageModalProps {
  page: DatoPage | null;
  onClose: () => void;
}

export const DatoPageModal: React.FC<DatoPageModalProps> = ({ page, onClose }) => {
  const { t, translate } = useLanguage();
  const modalCardRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  useModalAccessibility(Boolean(page), onClose, modalCardRef, closeButtonRef);

  React.useEffect(() => {
    if (page) {
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
  }, [page]);

  if (!page) return null;

  const renderNode = (node: DatoStructuredTextNode, idx: number): React.ReactNode => {
    if (!node) return null;

    if (node.type === 'block' && node.item) {
      const blockData = page.blocksMap?.[node.item];
      if (blockData?.type === 'image_gallery' && blockData.images) {
        return (
          <div key={idx} style={{ margin: '24px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              {blockData.images.map((img, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '180px', boxShadow: 'var(--shadow-sm)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (blockData?.type === 'video' && blockData.videoUrl) {
        return (
          <div key={idx} style={{ margin: '24px 0' }}>
            <video controls style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: '380px', boxShadow: 'var(--shadow-sm)' }}>
              <source src={blockData.videoUrl} type="video/mp4" />
              {t('videoUnsupported')}
            </video>
          </div>
        );
      }
    }

    if (node.type === 'paragraph') {
      return (
        <p key={idx} style={{ marginBottom: '16px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {node.children?.map(renderNode)}
        </p>
      );
    }

    if (node.type === 'span') {
      let content: React.ReactNode = translate(node.value);
      if (node.marks?.includes('strong')) {
        content = <strong key={idx}>{content}</strong>;
      }
      if (node.marks?.includes('emphasis')) {
        content = <em key={idx}>{content}</em>;
      }
      return <React.Fragment key={idx}>{content}</React.Fragment>;
    }

    if (node.type === 'heading') {
      const level = node.level || 2;
      const headingStyle = {
        fontFamily: 'var(--font-heading)',
        color: 'var(--burgundy-deep)',
        marginTop: '24px',
        marginBottom: '12px'
      };

      if (level === 1) return <h1 key={idx} style={headingStyle}>{node.children?.map(renderNode)}</h1>;
      if (level === 3) return <h3 key={idx} style={headingStyle}>{node.children?.map(renderNode)}</h3>;
      if (level === 4) return <h4 key={idx} style={headingStyle}>{node.children?.map(renderNode)}</h4>;
      return <h2 key={idx} style={headingStyle}>{node.children?.map(renderNode)}</h2>;
    }

    if (node.type === 'blockquote') {
      const attribution = node.attribution ? translate(node.attribution) : '';

      return (
        <blockquote
          key={idx}
          style={{
            borderLeft: '4px solid var(--burgundy-main)',
            paddingLeft: '16px',
            margin: '20px 0',
            fontStyle: 'italic',
            color: 'var(--burgundy-deep)',
            background: 'var(--bg-cream)',
            padding: '14px 18px',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
          }}
        >
          {node.children?.map(renderNode)}
          {attribution && (
            <cite style={{ display: 'block', fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-muted)' }}>
              — {attribution}
            </cite>
          )}
        </blockquote>
      );
    }

    if (node.type === 'list') {
      if (node.style === 'numbered') {
        return (
          <ol key={idx} style={{ paddingLeft: '24px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            {node.children?.map(renderNode)}
          </ol>
        );
      }
      return (
        <ul key={idx} style={{ paddingLeft: '24px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
          {node.children?.map(renderNode)}
        </ul>
      );
    }

    if (node.type === 'listItem') {
      return <li key={idx} style={{ marginBottom: '6px' }}>{node.children?.map(renderNode)}</li>;
    }

    if (node.type === 'code') {
      return (
        <pre
          key={idx}
          style={{
            background: '#2A080F',
            color: '#F7E9B8',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            overflowX: 'auto',
            fontSize: '0.85rem',
            margin: '20px 0'
          }}
        >
          <code>{node.code}</code>
        </pre>
      );
    }

    if (node.type === 'link') {
      const url = typeof node.url === 'string' ? node.url.trim() : '';
      const safeUrl =
        url.startsWith('/') ||
        /^https?:\/\//i.test(url) ||
        /^mailto:/i.test(url)
          ? url
          : '';

      if (!safeUrl) {
        return <React.Fragment key={idx}>{node.children?.map(renderNode)}</React.Fragment>;
      }

      const isExternal = /^https?:\/\//i.test(safeUrl);
      return (
        <a
          key={idx}
          href={safeUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          style={{ color: 'var(--burgundy-main)', textDecoration: 'underline' }}
        >
          {node.children?.map(renderNode)}
        </a>
      );
    }

    return null;
  };

  const documentChildren = page.structuredText?.document?.children || [];

  return (
    <div
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
      onClick={onClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div
        ref={modalCardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dato-page-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          color: 'var(--text-primary)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '85vh',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          className="custom-scrollbar"
          style={{
            padding: '36px',
            overflowY: 'auto',
            maxHeight: '85vh',
            width: '100%'
          }}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t('btnClose')}
            title={t('btnClose')}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-cream)',
              color: 'var(--burgundy-deep)',
              fontWeight: 'bold',
              border: '1px solid var(--border-light)',
              zIndex: 10
            }}
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2
              id="dato-page-modal-title"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--burgundy-deep)', margin: 0 }}
            >
              {translate(page.title)}
            </h2>
          </div>

          {/* Page Content */}
          <div>
            {documentChildren.length > 0 ? (
              documentChildren.map((childNode, i) => renderNode(childNode, i))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>{t('pageNoAdditionalText')}</p>
            )}

            {/* Embedded Contact Form */}
            {(page.slug?.toLowerCase().includes('kontakt') || page.title?.toLowerCase().includes('kontakt') || page.title?.toLowerCase().includes('contact')) && (
              <ContactForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
