/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'state';
import { formatNumber } from '../utils';

export interface ProductPriceProps {
  from: number
  to: number
  hasLabel?: boolean
}

export function ProductPrice({ from, to, hasLabel = false }: ProductPriceProps) {
  const { t } = useTranslation();

  const { countryCode } = useStore((storeState: any) => storeState.store);

  return (
    <div className="flex flex-col justify-center items-end relative">
      {hasLabel && <span className="text-xxs font-medium uppercase absolute -top-[10px]">{t('products.from')}</span>}
      <span className="font-semibold">{formatNumber({ countryCode, num: from })}</span>
      {to > from && <span className="text-xs line-through font-medium text-gray-400">{formatNumber({ countryCode, num: to })}</span>}
    </div>
  );
}
