'use client';

import React from 'react';

interface CartBadgeProps {
  count: number;
  label?: string; // e.g. "v košíku"
  variant?: 'inline' | 'pill' | 'header';
  className?: string;
}

export const CartBadge: React.FC<CartBadgeProps> = ({
  count,
  label = '',
  variant = 'inline',
  className = ''
}) => {
  if (!count || count <= 0) return null;

  if (variant === 'pill') {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7E9B8',
          color: '#4A0E17',
          border: '1px solid #E6C555',
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '1px 6px',
          borderRadius: '10px',
          marginLeft: '3px',
          lineHeight: 1
        }}
      >
        🛒 {count}
      </span>
    );
  }

  if (variant === 'header') {
    return (
      <span
        className={className}
        style={{
          color: 'var(--burgundy-deep)',
          fontSize: '0.74rem',
          fontWeight: 600,
          background: '#F5EFE9',
          padding: '2px 7px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-medium)',
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px'
        }}
      >
        🛒 {count} {label}
      </span>
    );
  }

  // Default 'inline' badge next to price/title
  return (
    <span
      className={className}
      style={{
        fontSize: '0.74rem',
        fontWeight: 700,
        color: '#1B5E20',
        background: '#E8F5E9',
        border: '1px solid #C8E6C9',
        padding: '2px 8px',
        borderRadius: '10px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        lineHeight: 1
      }}
    >
      ✓ {count} {label}
    </span>
  );
};
