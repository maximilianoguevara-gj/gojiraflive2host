/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'state';
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics';
import { useUtm } from '@gojiraf/useutm';
import { Button } from '../Kit';
import Card from '../Kit/Card';
import { formatNumber } from '../utils';
import { DeliveryMethods, DeliveryMethodType } from './DeliveryMethods';
import { useUtmMediumFromURL } from '../hooks';

export interface CartCardProps {
  canBuy: boolean;
  total: number
  paymentType: string;
  cartHeaderText: string;
  payButtonText: string;
  renderList: React.ReactNode
  defaultDeliveryMethod?: DeliveryMethodType
  onBuyClicked: (orderData: OrderData) => void;
  onBackClicked: React.MouseEventHandler;
}

export interface OrderData {
  total: number
  selectedDeliveryMethod: DeliveryMethodType
}

function ShadowPixel() {
  return (
    <img alt="shadow pixel" src="https://ads01.groovinads.com/grv/grvredir.os?IdOffer=393998390&idvar=1&IdImp=&idu=1658936282213302&IdSegment=45004724&IdDataS=21156&IdDataSource=21156&IdADS=117266&IdADSItem=520720&product_sku=TID0000000&bt=&Country=CL&Variations=1&Url=https%3A%2F%2Fads01.groovinads.com%2Fblank.os&IdClient=1076" />
  );
}

export function CartCard({
  canBuy = false,
  total = 0,
  renderList,
  paymentType,
  cartHeaderText,
  payButtonText,
  defaultDeliveryMethod = 'takeaway',
  onBuyClicked = () => { },
  onBackClicked = () => { },
}: CartCardProps) {
  const { gaEventTracker } = useGoogleAnalytics();
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { t } = useTranslation();
  const [showPixel, setShowPixel] = useState<boolean>(false);
  const [selectedDeliveryMethod, setSelectedDelivery] = useState<DeliveryMethodType>(
    defaultDeliveryMethod,
  );
  const {
    countryCode, company: { companyConfigurations: { shippingMethods } },
  } = useStore((storeState: any) => storeState.store);
  const hasTakeaway = shippingMethods.includes('takeaway');
  const hasDelivery = shippingMethods.includes('delivery');
  const utmMedium = useUtmMediumFromURL()
  const {isTotemDevice} = useUtm(utmMedium)

  useEffect(() => {
    if (defaultDeliveryMethod === 'unavailable' || defaultDeliveryMethod === 'to_agree') return;
    if (hasTakeaway) setSelectedDelivery('takeaway');
    if (!hasTakeaway && hasDelivery) setSelectedDelivery('delivery');
  }, [shippingMethods]);

  const handleOnBuyClicked = () => {
    gaEventTracker('InCall > Products', 'cart-buy-button-to-checkout');
    matomoTrackEvent('InCall > Products', 'cart-buy-button-to-checkout');
    onBuyClicked({
      total,
      selectedDeliveryMethod,
    });
  };

  return (
    <Card
      title={cartHeaderText}
      onGoBack={onBackClicked}
      renderMiddle={(
        <>
          <div className={`flex flex-col divide-y divide-black ${isTotemDevice && 'gap-32'}`}>
            {renderList}
          </div>
          <div className="flex justify-end items-center gap-2 border-t border-t-black pt-2">
            <span className="text-base capitalize">
              {t('cart.total')}
            </span>
            <span className="text-sm font-semibold">
              {formatNumber({ countryCode, num: total })}
            </span>
          </div>
          {selectedDeliveryMethod !== 'unavailable' && selectedDeliveryMethod !== 'to_agree' ? (
            <DeliveryMethods
              hasDelivery={hasDelivery}
              hasTakeAway={hasTakeaway}
              selectedDelivery={selectedDeliveryMethod}
              onSelectedDelivery={setSelectedDelivery}
            />
          ) : null}
        </>
      )}
      renderBottom={(
        <Button
          className="text-sm font-semibold uppercase leading-4 tracking-widest"
          id="cart-buy-button-to-checkout"
          disabled={canBuy === false}
          onClick={() => {
            if (paymentType === 'cencosud_paris') setShowPixel(true);
            handleOnBuyClicked();
          }}
        >
          {showPixel === true && <ShadowPixel /> }
          {payButtonText}
        </Button>
      )}
    />
  );
}
