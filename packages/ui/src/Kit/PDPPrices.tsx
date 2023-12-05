/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'state';
import { formatNumber, getBadgeDiscount } from '../utils';
import { ProductPriceProps } from './ProductPrice';

export function PDPPrices({ from, to, hasLabel = false }: ProductPriceProps) {
  const { t } = useTranslation();
  const { discountText, discountValue } = getBadgeDiscount(to, from);

  const { countryCode } = useStore((storeState: any) => storeState.store);

  const discountStyles = {
    fontFamily: 'Montserrat',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    height: '1.25rem',
    backgroundColor: 'rgb(249, 55, 0)',
    fontSize: '0.688rem',
    fontWeight: '500',
    borderRadius: '0.625rem',
    padding: '0 0.375rem',
    color: 'white',
  };

  return (
    <div className="flex flex-col justify-center relative">
      {hasLabel && <span className="text-xxs font-medium uppercase absolute -top-[10px]">{t('products.from')}</span>}
      <div className="flex gap-2">
        <span className="text-lg font-semibold">{formatNumber({ countryCode, num: from })}</span>
        {discountValue > 0 && <span style={discountStyles}>{discountText}</span>}
      </div>
      {to > from && <span className="text-xs line-through font-medium text-gray-400">{formatNumber({ countryCode, num: to })}</span>}
    </div>
  );
}
