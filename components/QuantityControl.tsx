'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
  stopPropagation?: boolean;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  size = 'sm',
  stopPropagation = true,
}) => {
  const { t } = useLanguage();
  const isSm = size === 'sm';
  const btnSize = isSm ? '22px' : '28px';
  const fontSize = isSm ? '0.8rem' : '0.9rem';
  const numWidth = isSm ? '18px' : '36px';

  const handleContainerClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
  };

  const handleDecClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    onDecrease();
  };

  const handleIncClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    onIncrease();
  };

  return (
    <div
      onClick={handleContainerClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-full)',
        padding: isSm ? '2px 5px' : '4px 8px',
        background: 'var(--bg-cream)',
        flexShrink: 0
      }}
    >
      <button
        onClick={handleDecClick}
        title={t('quantityDecrease')}
        aria-label={t('quantityDecrease')}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: '50%',
          background: 'white',
          color: 'var(--burgundy-deep)',
          fontWeight: 'bold',
          fontSize,
          border: '1px solid var(--border-light)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
      >
        -
      </button>
      <span
        style={{
          padding: '0 6px',
          fontWeight: 700,
          color: 'var(--burgundy-deep)',
          fontSize: isSm ? '0.82rem' : '0.95rem',
          minWidth: numWidth,
          textAlign: 'center'
        }}
      >
        {quantity}
      </span>
      <button
        onClick={handleIncClick}
        title={t('quantityIncrease')}
        aria-label={t('quantityIncrease')}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: '50%',
          background: 'white',
          color: 'var(--burgundy-deep)',
          fontWeight: 'bold',
          fontSize,
          border: '1px solid var(--border-light)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
      >
        +
      </button>
    </div>
  );
};
