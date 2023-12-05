/* eslint-disable max-len */
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'state';
import { ButtonCarso } from '../Kit/ButtonCarso';
import Card from '../Kit/Card';
import { formatNumber } from '../utils';
import { DeliveryMethods, DeliveryMethodType } from './DeliveryMethods';
import { useCart } from './useCart';
import { useProducts } from '../Products/useProducts';
import { Variant } from '../Products/IProduct';

export interface CartCardCarsoProps {
  canBuy: boolean;
  total: number
  cartHeaderText: string;
  payButtonText: string;
  renderList: React.ReactNode
  defaultDeliveryMethod?: DeliveryMethodType
  onBuyClicked: (orderData: OrderDataCarso) => void;
  onBackClicked: React.MouseEventHandler;
}

export interface OrderDataCarso {
  total: number
  selectedDeliveryMethod: DeliveryMethodType
}

export function CartCardCarso({
  canBuy = false,
  total = 0,
  renderList,
  cartHeaderText,
  payButtonText,
  defaultDeliveryMethod = 'takeaway',
  onBuyClicked = () => { },
  onBackClicked = () => { },
}: CartCardCarsoProps) {
  const { t } = useTranslation();
  const [selectedDeliveryMethod, setSelectedDelivery] = useState<DeliveryMethodType>(
    defaultDeliveryMethod,
  );
  const {
    countryCode, paymentGateways, company: { companyConfigurations: { shippingMethods } },
  } = useStore((storeState: any) => storeState.store);
  const hasTakeaway = shippingMethods.includes('takeaway');
  const hasDelivery = shippingMethods.includes('delivery');

  useEffect(() => {
    if (defaultDeliveryMethod === 'unavailable') return;
    if (hasTakeaway) setSelectedDelivery('takeaway');
    if (!hasTakeaway && hasDelivery) setSelectedDelivery('delivery');
  }, [shippingMethods]);

  const handleOnBuyClicked = () => {
    onBuyClicked({
      total,
      selectedDeliveryMethod,
    });
  };
  const { state: cartState } = useCart();
  const { products } = useProducts();
  const items = useMemo(() => {
    const cartItems: any = [];

    cartState.context.variants.forEach((quantity, variantId) => {
      let variantFound: Variant | undefined;

      const productFound = products.find((product) => {
        variantFound = product.skus.find((variant) => variant.id === variantId);

        if (variantFound !== undefined) {
          return product;
        }

        return undefined;
      });

      if (productFound !== undefined && variantFound !== undefined) {
        cartItems.push({
          quantity,
          product: productFound,
          ...variantFound,
        });
      }
    });

    return cartItems;
  }, [cartState.context.variants]);

  const getCheckoutUrl = () => {
    const cartQuery = items.map((item: any) => {
      if (!item.sku || item.sku === '') {
        throw new Error("Some of the products in cart hasn't a sku");
      }
      const [productId, childrenSku] = item.sku.split('-');
      return {
        product_id: productId,
        children_sku: childrenSku ?? '0',
        quantity: item.quantity.toString(),
      };
    });
    const encodedCartQuery = window.btoa(JSON.stringify(cartQuery));

    const paymentGateway = paymentGateways.find((paymentGatewayItem: any) => paymentGatewayItem.isDefault === true);
    const redirectUrl = `${paymentGateway.urlCheckout}livestream/${encodedCartQuery}`;

    return redirectUrl;
  };
  const [urlCheckout, setUrlCheckout] = useState('');

  useEffect(() => {
    if (canBuy === false) {
      // eslint-disable-next-line no-script-url
      setUrlCheckout('javascript:void(0)');
    } else {
      setUrlCheckout(getCheckoutUrl());
    }
  }, [items]);

  return (
    <Card
      title={cartHeaderText}
      onGoBack={onBackClicked}
      renderMiddle={(
        <>
          <div className="flex flex-col divide-y divide-black">
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
          {selectedDeliveryMethod !== 'unavailable' ? (
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
        <ButtonCarso
          className="text-sm font-semibold uppercase leading-4 tracking-widest"
          id="cart-buy-ButtonCarso-to-checkout"
          href={urlCheckout}
          onClick={handleOnBuyClicked}
        >
          {payButtonText}
        </ButtonCarso>
      )}
    />
  );
}
