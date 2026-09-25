'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface StockBadgeProps {
  quantity: number;
  inStockText?: string;
  outOfStockText?: string;
  unitText?: string;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  quantity,
  inStockText,
  outOfStockText,
  unitText,
  className = ''
}) => {
  const { t } = useLanguage();
  const isAvailable = quantity > 0;
  const resolvedInStockText = inStockText ?? t('specInStock');
  const resolvedOutOfStockText = outOfStockText ?? t('outOfStock');
  const resolvedUnitText = unitText ?? t('unitPieces');

  return isAvailable ? (
    <span
      className={className}
      style={{
        color: '#1B5E20',
        fontSize: '0.78rem',
        fontWeight: 700,
        background: '#E8F5E9',
        padding: '3px 8px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid #C8E6C9',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}
    >
      ✓ {resolvedInStockText}: {quantity} {resolvedUnitText}
    </span>
  ) : (
    <span
      className={className}
      style={{
        color: '#B71C1C',
        fontSize: '0.78rem',
        fontWeight: 700,
        background: '#FFEBEE',
        padding: '3px 8px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid #FFCDD2',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}
    >
      ✕ {resolvedOutOfStockText}
    </span>
  );
};
