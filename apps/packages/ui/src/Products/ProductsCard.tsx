import React from 'react';
import { useTranslation } from 'react-i18next';
import { useViews } from 'state';
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics';
import { Button } from '../Kit';
import { CartCount, CartCountProps } from '../Cart/CartCount';
import Card from '../Kit/Card';
import { getDynamicText } from '../utils';

interface ProductsCardProps extends CartCountProps {
  canBuy: boolean;
  isLightIntegration: boolean
  paymentType: string;
  renderList: React.ReactNode
}
export function ProductsCard({
  canBuy = false,
  isLightIntegration,
  paymentType,
  renderList,
}: ProductsCardProps) {
  const { gaEventTracker } = useGoogleAnalytics();
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { t } = useTranslation();
  const { send } = useViews();
  const showCart = () => {
    gaEventTracker('InCall > Products', 'product-catalog-buy-button-to-checkout');
    matomoTrackEvent('InCall > Products', 'product-catalog-buy-button-to-checkout');
    send({ type: 'SHOW_CART' });
  };

  return (
    <Card
      isLightIntegration={isLightIntegration}
      title={t('products.products')}
      renderTop={isLightIntegration ? null : (
        <CartCount />
      )}
      renderMiddle={(
        <div className="flex flex-col divide-y divide-black">
          {renderList}
        </div>
      )}
      renderBottom={isLightIntegration ? null : (
        <Button
          className="text-sm font-semibold uppercase leading-4 tracking-widest"
          id="product-catalog-buy-button-to-checkout"
          disabled={canBuy === false}
          onClick={() => showCart()}
        >
          {getDynamicText({ paymentType, textsOptions: { to_agree: t('products.continue'), storeCustomizationText: '', defaultText: t('products.buy') } })}
        </Button>
      )}
    />
  );
}
