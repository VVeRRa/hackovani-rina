'use client';

import React from 'react';

interface WishlistButtonProps {
  isWishlisted: boolean;
  onToggle: (e: React.MouseEvent) => void;
  title?: string;
  position?: 'top-left' | 'top-right' | 'relative';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  isWishlisted,
  onToggle,
  title = '',
  position = 'top-right',
  className = ''
}) => {
  const positionStyles: React.CSSProperties =
    position === 'top-left'
      ? { position: 'absolute', top: '12px', left: '12px' }
      : position === 'top-right'
      ? { position: 'absolute', top: '12px', right: '12px' }
      : { position: 'relative' };

  return (
    <button
      onClick={onToggle}
      title={title}
      aria-label={title}
      aria-pressed={isWishlisted}
      className={className}
      style={{
        ...positionStyles,
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isWishlisted ? 'var(--burgundy-main)' : 'var(--text-muted)',
        zIndex: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, background-color 0.2s ease'
      }}
    >
      <svg style={{ width: '18px', height: '18px' }} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
};
