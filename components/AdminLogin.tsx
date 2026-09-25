'use client';

import { FormEvent, useState } from 'react';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError('Přihlášení se nezdařilo. Zkontrolujte heslo.');
        return;
      }

      window.location.reload();
    } catch {
      setError('Přihlášení se nezdařilo. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #2A060C 0%, #1A0408 100%)',
        color: '#F7E9B8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 'min(100%, 420px)',
          padding: '32px',
          borderRadius: '18px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(247,233,184,0.25)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.8 }}>
          HÁČKOVÁNÍ RINA
        </div>
        <h1 style={{ margin: '8px 0 6px', fontSize: '2rem' }}>Přihlášení do administrace</h1>
        <p style={{ margin: '0 0 24px', opacity: 0.75 }}>
          Zadejte administrační heslo.
        </p>

        <label htmlFor="admin-password" style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>
          Heslo
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoFocus
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(247,233,184,0.35)',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />

        {error && (
          <p role="alert" style={{ color: '#FFB4AB', margin: '12px 0 0' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !password}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '12px 18px',
            border: 0,
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #F7E9B8 0%, #E6C555 100%)',
            color: '#2A080F',
            fontWeight: 800,
            cursor: isSubmitting ? 'wait' : 'pointer',
            opacity: isSubmitting || !password ? 0.65 : 1,
          }}
        >
          {isSubmitting ? 'Přihlašuji…' : 'Přihlásit se'}
        </button>
      </form>
    </main>
  );
}
