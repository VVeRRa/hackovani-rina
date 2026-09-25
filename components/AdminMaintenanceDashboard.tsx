'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DatoProduct, DatoPage, DatoSiteInfo, DatoCategory, DatoHero, DatoAcceptedForm } from '@/lib/datocms';

interface AdminMaintenanceDashboardProps {
  initialSiteInfo: DatoSiteInfo;
  initialProducts: DatoProduct[];
  initialPages: DatoPage[];
  initialCategories: DatoCategory[];
  initialAcceptedForms?: DatoAcceptedForm[];
  initialHero?: DatoHero;
}

export const AdminMaintenanceDashboard: React.FC<AdminMaintenanceDashboardProps> = ({
  initialSiteInfo,
  initialProducts,
  initialPages,
  initialCategories,
  initialAcceptedForms = [],
  initialHero,
}) => {
  const [siteInfo, setSiteInfo] = useState<DatoSiteInfo>(initialSiteInfo);
  const [products, setProducts] = useState<DatoProduct[]>(initialProducts);
  const [pages, setPages] = useState<DatoPage[]>(initialPages);
  const [categories, setCategories] = useState<DatoCategory[]>(initialCategories);
  const [acceptedForms, setAcceptedForms] = useState<DatoAcceptedForm[]>(initialAcceptedForms);
  const [hero, setHero] = useState<DatoHero | undefined>(initialHero);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string | null>(null);
  const [showTechnicalInfo, setShowTechnicalInfo] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick reply, Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [copiedReplyId, setCopiedReplyId] = useState<string | null>(null);
  const [updatingAnswearedId, setUpdatingAnswearedId] = useState<string | null>(null);

  useEffect(() => {
    setLastFetchedTime(new Date().toLocaleTimeString('cs-CZ'));
  }, []);

  const refreshDataFromClient = async () => {
    setIsRefreshing(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/data', { cache: 'no-store' });
      if (res && res.ok) {
        const data = await res.json();
        if (data?.siteInfo) setSiteInfo(data.siteInfo);
        if (data?.products) setProducts(data.products);
        if (data?.pages) setPages(data.pages);
        if (data?.categories) setCategories(data.categories);
        if (data?.acceptedForms) setAcceptedForms(data.acceptedForms);
        if (data?.hero) setHero(data.hero);
        setLastFetchedTime(new Date().toLocaleTimeString('cs-CZ'));
        setStatusMessage('Data byla úspěšně obnovena.');
      } else {
        setErrorMessage('Data se nepodařilo obnovit. Zkuste to prosím znovu.');
      }
    } catch (err) {
      console.error('Error refreshing DatoCMS data from admin panel:', err);
      setErrorMessage('Data se nepodařilo obnovit. Zkuste to prosím znovu.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Datum neuvedeno';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Prague',
      });
    } catch {
      return isoString;
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmailId(id);
      setTimeout(() => setCopiedEmailId(null), 2500);
    }
  };

  const handleCopyReplyText = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedReplyId(id);
      setTimeout(() => setCopiedReplyId(null), 2500);
    }
  };

  const toggleReplyDrawer = (form: DatoAcceptedForm) => {
    if (activeReplyId === form.id) {
      setActiveReplyId(null);
      setReplyText('');
    } else {
      setActiveReplyId(form.id);
      setReplyText(
        `Dobrý den ${form.name},\n\nděkuji za Vaši zprávu.\n\nS pozdravem,\nRina (Háčkování Rina)`
      );
    }
  };

  const toggleAnswearedStatus = async (formId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setUpdatingAnswearedId(formId);

    // Optimistic update
    setAcceptedForms((prev) =>
      prev.map((f) => (f.id === formId ? { ...f, answeared: nextStatus } : f))
    );

    try {
      const res = await fetch('/api/admin/contact/answered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: formId, answeared: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Revert on error
        setAcceptedForms((prev) =>
          prev.map((f) => (f.id === formId ? { ...f, answeared: currentStatus } : f))
        );
        const detail = [
          data.upstreamStatus ? `HTTP ${data.upstreamStatus}` : '',
          data.upstreamCode || '',
        ].filter(Boolean).join(' / ');

        setErrorMessage(
          `${data.error || 'Nepodařilo se aktualizovat stav zprávy.'}${
            detail ? ` (DatoCMS: ${detail})` : ''
          }`
        );
      }
    } catch (err) {
      console.error('Error toggling answeared state:', err);
      setAcceptedForms((prev) =>
        prev.map((f) => (f.id === formId ? { ...f, answeared: currentStatus } : f))
      );
      setErrorMessage('Stav zprávy se nepodařilo uložit. Zkuste to prosím znovu.');
    } finally {
      setUpdatingAnswearedId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.reload();
    }
  };

  const unansweredCount = acceptedForms.filter((f) => !f.answeared).length;
  const answeredCount = acceptedForms.filter((f) => f.answeared).length;

  const filteredForms = acceptedForms.filter((f) => {
    if (statusFilter === 'unanswered' && f.answeared) return false;
    if (statusFilter === 'answered' && !f.answeared) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #2A060C 0%, #1A0408 100%)',
        color: '#F7E9B8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(247, 233, 184, 0.2)',
            paddingBottom: '24px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(247, 233, 184, 0.12)',
                border: '1px solid rgba(247, 233, 184, 0.3)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#F7E9B8',
                marginBottom: '8px',
              }}
            >
              🔒 ADMINISTRACE
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: '#F7E9B8' }}>
              Správa webu Háčkování Rina
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={refreshDataFromClient}
              disabled={isRefreshing}
              style={{
                background: 'linear-gradient(135deg, #F7E9B8 0%, #E6C555 100%)',
                color: '#2A080F',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: isRefreshing ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isRefreshing ? '🔄 Načítám...' : '🔄 Obnovit data'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#F7E9B8',
                border: '1px solid rgba(247, 233, 184, 0.35)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Odhlásit
            </button>

            <Link
              href="/"
              style={{
                background: 'linear-gradient(135deg, #F7E9B8 0%, #E6C555 100%)',
                color: '#2A080F',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ← Zpět na web
            </Link>
          </div>
        </div>

        {(statusMessage || errorMessage) && (
          <div
            role={errorMessage ? 'alert' : 'status'}
            aria-live="polite"
            style={{
              marginBottom: '24px',
              padding: '12px 16px',
              borderRadius: '10px',
              border: errorMessage
                ? '1px solid rgba(244, 67, 54, 0.55)'
                : '1px solid rgba(76, 175, 80, 0.55)',
              background: errorMessage
                ? 'rgba(244, 67, 54, 0.12)'
                : 'rgba(76, 175, 80, 0.12)',
              color: errorMessage ? '#FFB4AB' : '#B9F6CA',
              fontWeight: 700,
            }}
          >
            {errorMessage || statusMessage}
          </div>
        )}

        {/* Overview Stats Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(247, 233, 184, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'rgba(247, 233, 184, 0.7)', fontWeight: 600 }}>Stav dat</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4CAF50', marginTop: '6px' }}>✓ Připojeno</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{lastFetchedTime ? `Naposledy obnoveno ${lastFetchedTime}` : 'Data jsou připravena'}</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(247, 233, 184, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'rgba(247, 233, 184, 0.7)', fontWeight: 600 }}>📬 Přijaté Zprávy</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F7E9B8', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span>{acceptedForms.length}</span>
              {unansweredCount > 0 && (
                <span style={{ fontSize: '0.85rem', color: '#FFB74D', fontWeight: 700 }}>
                  ({unansweredCount} nových)
                </span>
              )}
            </div>
            
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(247, 233, 184, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'rgba(247, 233, 184, 0.7)', fontWeight: 600 }}>Produkty v Katalogu</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F7E9B8', marginTop: '6px' }}>{products.length}</div>
            
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(247, 233, 184, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'rgba(247, 233, 184, 0.7)', fontWeight: 600 }}>Kategorie</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F7E9B8', marginTop: '6px' }}>{categories.length}</div>
            
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(247, 233, 184, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'rgba(247, 233, 184, 0.7)', fontWeight: 600 }}>Publikované Stránky</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F7E9B8', marginTop: '6px' }}>{pages.length}</div>
            
          </div>
        </div>

        {/* Dedicated Accepted Messages (accepted_form) Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(247, 233, 184, 0.25)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '36px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
              borderBottom: '1px solid rgba(247, 233, 184, 0.15)',
              paddingBottom: '16px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  margin: 0,
                  color: '#F7E9B8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span>📬</span> Přijaté Zprávy z Formuláře
                <span
                  style={{
                    background: '#E6C555',
                    color: '#2A080F',
                    fontSize: '0.8rem',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800,
                  }}
                >
                  {acceptedForms.length}
                </span>
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(247, 233, 184, 0.7)' }}>
                Zprávy doručené z kontaktního formuláře. Můžete je vyhledávat, odpovědět na ně a označit jako vyřízené.
              </p>
            </div>

            {/* Status Filter Tabs & Search Bar */}
            {acceptedForms.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'flex',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '4px',
                    borderRadius: '8px',
                    border: '1px solid rgba(247, 233, 184, 0.2)',
                  }}
                >
                  <button
                    onClick={() => setStatusFilter('all')}
                    style={{
                      background: statusFilter === 'all' ? '#E6C555' : 'transparent',
                      color: statusFilter === 'all' ? '#2A080F' : '#F7E9B8',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Vše ({acceptedForms.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('unanswered')}
                    style={{
                      background: statusFilter === 'unanswered' ? '#FFB74D' : 'transparent',
                      color: statusFilter === 'unanswered' ? '#2A080F' : '#F7E9B8',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    ⏳ Neodpovězené ({unansweredCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('answered')}
                    style={{
                      background: statusFilter === 'answered' ? '#4CAF50' : 'transparent',
                      color: statusFilter === 'answered' ? '#FFF' : '#F7E9B8',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Odpovězené ({answeredCount})
                  </button>
                </div>

                <div style={{ position: 'relative', minWidth: '220px' }}>
                  <input
                    type="text"
                    placeholder="🔍 Hledat ve zprávách..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(247, 233, 184, 0.3)',
                      color: '#F7E9B8',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {acceptedForms.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                border: '1px dashed rgba(247, 233, 184, 0.2)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', color: '#F7E9B8' }}>
                Zatím nebyly doručeny žádné zprávy
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(247, 233, 184, 0.6)', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                Až návštěvníci vyplní kontaktní formulář na webu, jejich zprávy a e-maily se automaticky uloží do DatoCMS a zobrazí přímo zde.
              </p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(247, 233, 184, 0.7)' }}>
              Žádná zpráva neodpovídá zvolenému filtru nebo hledanému výrazu &quot;{searchQuery}&quot;.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredForms.map((form) => {
                const mailtoUrl = `mailto:${encodeURIComponent(form.email)}?subject=${encodeURIComponent(
                  'Re: Zpráva z webu Háčkování Rina'
                )}&body=${encodeURIComponent(
                  `Dobrý den ${form.name},\n\nděkuji za Vaši zprávu.\n\n\n--- Původní zpráva ---\nOd: ${form.name} (${form.email})\nZpráva:\n${form.message}`
                )}`;

                const isReplyActive = activeReplyId === form.id;
                const isUpdatingThis = updatingAnswearedId === form.id;

                return (
                  <div
                    key={form.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                      border: form.answeared
                        ? '1px solid rgba(76, 175, 80, 0.4)'
                        : '1px solid rgba(247, 233, 184, 0.25)',
                      borderRadius: '12px',
                      padding: '20px',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Message Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: form.answeared
                              ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
                              : 'linear-gradient(135deg, #F7E9B8 0%, #E6C555 100%)',
                            color: form.answeared ? '#FFF' : '#2A080F',
                            fontWeight: 900,
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          {(form.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0, flex: '1 1 180px' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{form.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap', minWidth: 0 }}>
                            <a
                              href={`mailto:${form.email}`}
                              style={{
                                color: '#F7E9B8',
                                fontSize: '0.85rem',
                                textDecoration: 'underline',
                                fontWeight: 600,
                                overflowWrap: 'anywhere',
                                wordBreak: 'break-word',
                                minWidth: 0,
                              }}
                            >
                              ✉️ {form.email}
                            </a>
                            <button
                              onClick={() => handleCopyEmail(form.email, form.id)}
                              title="Kopírovat e-mail"
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(247, 233, 184, 0.2)',
                                color: '#F7E9B8',
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}
                            >
                              {copiedEmailId === form.id ? '✓ Zkopírováno!' : '📋 Kopírovat'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {/* Answeared Status Badge */}
                        {form.answeared ? (
                          <span
                            style={{
                              background: '#2E7D32',
                              color: '#FFF',
                              fontSize: '0.78rem',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 6px rgba(46,125,50,0.4)',
                            }}
                          >
                            ✓ Odpovězeno
                          </span>
                        ) : (
                          <span
                            style={{
                              background: 'rgba(255, 152, 0, 0.2)',
                              color: '#FFB74D',
                              border: '1px solid rgba(255, 152, 0, 0.4)',
                              fontSize: '0.78rem',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            ⏳ Čeká na odpověď
                          </span>
                        )}

                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(247, 233, 184, 0.65)',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(247, 233, 184, 0.1)',
                          }}
                        >
                          🕒 {formatDate(form.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div
                      style={{
                        background: 'rgba(10, 2, 4, 0.6)',
                        borderLeft: form.answeared ? '4px solid #4CAF50' : '4px solid #E6C555',
                        borderTop: '1px solid rgba(247, 233, 184, 0.1)',
                        borderRight: '1px solid rgba(247, 233, 184, 0.1)',
                        borderBottom: '1px solid rgba(247, 233, 184, 0.1)',
                        borderRadius: '0 8px 8px 0',
                        padding: '14px 16px',
                        fontSize: '0.92rem',
                        lineHeight: '1.6',
                        color: '#F0E6D2',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '16px',
                      }}
                    >
                      {form.message}
                    </div>

                    {/* Action Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      {/* Toggle Answeared Button (DatoCMS Sync) */}
                      <button
                        onClick={() => toggleAnswearedStatus(form.id, Boolean(form.answeared))}
                        disabled={isUpdatingThis}
                        title="Kliknutím změníte stav zprávy"
                        style={{
                          background: form.answeared
                            ? 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)'
                            : 'linear-gradient(135deg, #E6C555 0%, #D4B237 100%)',
                          color: form.answeared ? '#FFF' : '#2A080F',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: isUpdatingThis ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isUpdatingThis ? (
                          '🔄 Ukládám...'
                        ) : form.answeared ? (
                          '✓ Odpovězeno'
                        ) : (
                          '☑️ Označit jako odpovězené'
                        )}
                      </button>

                      {/* Direct Mailto Reply Button */}
                      <a
                        href={mailtoUrl}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#F7E9B8',
                          border: '1px solid rgba(247, 233, 184, 0.4)',
                          padding: '8px 18px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        ✉️ Odpovědět na e-mail ({form.email})
                      </a>

                      {/* Interactive Quick Reply Composer Toggle */}
                      <button
                        onClick={() => toggleReplyDrawer(form)}
                        style={{
                          background: isReplyActive ? 'rgba(230, 197, 85, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                          color: '#F7E9B8',
                          border: '1px solid rgba(247, 233, 184, 0.3)',
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {isReplyActive ? '✖ Zavřít předlohu' : '✏️ Rychlá odpověď / Předloha'}
                      </button>
                    </div>

                    {/* Inline Quick Reply Drawer / Composer */}
                    {isReplyActive && (
                      <div
                        style={{
                          marginTop: '16px',
                          background: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid rgba(247, 233, 184, 0.3)',
                          borderRadius: '10px',
                          padding: '16px',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#F7E9B8' }}>
                          ✍️ Napsat předlohu odpovědi pro {form.name} ({form.email}):
                        </div>
                        <textarea
                          rows={6}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{
                            width: '100%',
                            background: '#150306',
                            border: '1px solid rgba(247, 233, 184, 0.3)',
                            color: '#F7E9B8',
                            padding: '12px',
                            borderRadius: '6px',
                            fontSize: '0.88rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            marginBottom: '12px',
                          }}
                        />
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <a
                            href={`mailto:${encodeURIComponent(form.email)}?subject=${encodeURIComponent(
                              'Re: Zpráva z webu Háčkování Rina'
                            )}&body=${encodeURIComponent(
                              `${replyText}\n\n--- Původní zpráva ---\nOd: ${form.name} (${form.email})\nZpráva:\n${form.message}`
                            )}`}
                            onClick={() => {
                              if (!form.answeared) {
                                toggleAnswearedStatus(form.id, false);
                              }
                            }}
                            style={{
                              background: '#4CAF50',
                              color: '#FFF',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            🚀 Otevřít e-mail a označit jako odpovězené
                          </a>
                          <button
                            onClick={() => handleCopyReplyText(replyText, form.id)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.12)',
                              color: '#F7E9B8',
                              border: '1px solid rgba(247, 233, 184, 0.3)',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                            }}
                          >
                            {copiedReplyId === form.id ? '✓ Text zkopírován!' : '📋 Kopírovat text odpovědi'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Optional technical information for maintenance/debugging */}
        <div style={{ marginTop: '32px' }}>
          <button
            type="button"
            onClick={() => setShowTechnicalInfo((visible) => !visible)}
            aria-expanded={showTechnicalInfo}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(247, 233, 184, 0.3)',
              color: '#F7E9B8',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {showTechnicalInfo ? '▼ Skrýt technické informace' : '▶ Technické informace'}
          </button>

          {showTechnicalInfo && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  padding: '16px 18px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(247, 233, 184, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                }}
              >
                Data se obnovují přes autentizovaný endpoint <code>/api/admin/data</code>.
                Veřejný CMS debug/refresh endpoint není vystaven.
              </div>

        {/* Raw JSON Inspector Accordion */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(247, 233, 184, 0.3)',
              color: '#F7E9B8',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {showRawJson ? '▼ Skrýt Raw JSON Payload' : '▶ Zobrazit Raw JSON Payload (DatoCMS Data)'}
          </button>

          {showRawJson && (
            <div
              style={{
                marginTop: '16px',
                background: '#110305',
                border: '1px solid rgba(247, 233, 184, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                maxHeight: '500px',
                overflow: 'auto',
              }}
            >
              <pre style={{ margin: 0, fontSize: '0.82rem', color: '#88FF88', fontFamily: 'monospace' }}>
                {JSON.stringify(
                  {
                    siteInfo,
                    hero,
                    acceptedFormsCount: acceptedForms.length,
                    unansweredCount,
                    answeredCount,
                    pagesCount: pages.length,
                    productsCount: products.length,
                    categoriesCount: categories.length,
                    acceptedForms,
                    products,
                    pages,
                    categories,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
