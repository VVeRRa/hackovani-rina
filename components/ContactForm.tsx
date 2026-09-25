'use client';

import React, { useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

type ContactErrorCode =
  | 'required'
  | 'invalid_email'
  | 'too_long'
  | 'too_large'
  | 'rate_limited'
  | 'unavailable'
  | 'save_failed'
  | 'processing_failed';

const contactErrorTranslationKeys: Partial<Record<ContactErrorCode, string>> = {
  required: 'contactErrorRequired',
  invalid_email: 'contactErrorInvalidEmail',
  too_long: 'contactErrorTooLong',
  too_large: 'contactErrorTooLarge',
  rate_limited: 'contactErrorRateLimited',
  unavailable: 'contactErrorUnavailable',
};

export const ContactForm: React.FC = () => {
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactGuard, setContactGuard] = useState('');
  const formStartedAt = useRef(Date.now());

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage(t('contactErrorRequired'));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error');
      setErrorMessage(t('contactErrorInvalidEmail'));
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          contactGuard,
          formStartedAt: formStartedAt.current,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setContactGuard('');
      } else {
        setStatus('error');
        const errorCode =
          typeof data?.errorCode === 'string'
            ? (data.errorCode as ContactErrorCode)
            : undefined;
        const translationKey = errorCode
          ? contactErrorTranslationKeys[errorCode]
          : undefined;

        setErrorMessage(
          translationKey ? t(translationKey) : t('contactErrorGeneric')
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(t('contactErrorNetwork'));
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #4A0E17 0%, #2A080F 100%)',
        color: '#F7E9B8',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 36px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(247, 233, 184, 0.3)',
        marginTop: '24px'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: '#F7E9B8', margin: '0 0 8px 0' }}>
          {t('contactTitle')}
        </h3>
        <p style={{ color: 'rgba(247, 233, 184, 0.82)', fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
          {t('contactSubtitle')}
        </p>
      </div>

      {status === 'success' ? (
        <div
          style={{
            background: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid #4CAF50',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4CAF50', marginBottom: '8px' }}>
            {t('contactSuccessTitle')}
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.92rem', marginBottom: '18px' }}>
            {t('contactSuccessSubtitle')}
          </p>
          <button
            onClick={() => {
              formStartedAt.current = Date.now();
              setStatus('idle');
            }}
            style={{
              background: '#F7E9B8',
              color: '#4A0E17',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('contactSendAnother')}
          </button>
        </div>
      ) : (
        <form
          noValidate
          autoComplete="on"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden'
            }}
          >
            <label htmlFor="contact-guard">Leave blank</label>
            <input
              id="contact-guard"
              name="contact_guard_7f3"
              type="text"
              value={contactGuard}
              onChange={(e) => setContactGuard(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              data-1p-ignore="true"
              data-lpignore="true"
            />
          </div>
          {status === 'error' && (
            <div
              role="alert"
              aria-live="polite"
              style={{
                background: 'rgba(244, 67, 54, 0.15)',
                border: '1px solid #F44336',
                color: '#FF8A80',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem'
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#F7E9B8' }}>
              {t('contactNameLabel')} *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="section-contact name"
              maxLength={120}
              required
              placeholder={t('contactNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(247, 233, 184, 0.4)',
                background: 'rgba(0, 0, 0, 0.35)',
                color: '#F7E9B8',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#F7E9B8' }}>
              {t('contactEmailLabel')} *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="section-contact email"
              maxLength={254}
              required
              placeholder={t('contactEmailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(247, 233, 184, 0.4)',
                background: 'rgba(0, 0, 0, 0.35)',
                color: '#F7E9B8',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#F7E9B8' }}>
              {t('contactMessageLabel')} *
            </label>
            <textarea
              id="contact-message"
              name="message"
              maxLength={5000}
              required
              rows={4}
              placeholder={t('contactMessagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(247, 233, 184, 0.4)',
                background: 'rgba(0, 0, 0, 0.35)',
                color: '#F7E9B8',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              background: 'linear-gradient(135deg, #F7E9B8 0%, #E6C555 100%)',
              color: '#4A0E17',
              border: 'none',
              padding: '14px 28px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: status === 'loading' ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.15s ease',
              marginTop: '6px'
            }}
          >
            {status === 'loading' ? t('contactSubmitting') : t('contactSubmit')}
          </button>
        </form>
      )}
    </div>
  );
};
