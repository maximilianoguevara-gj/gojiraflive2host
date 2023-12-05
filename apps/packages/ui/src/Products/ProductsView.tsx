import React, { useEffect, useMemo } from 'react';
import { useStore, useViews } from 'state';
import { useTranslation } from 'react-i18next';
import { PDPContainer, usePDP } from '../PDP';
import { Product } from './IProduct';
import { Products } from './Products';
import {
  OrderData, CartView, useCart, DeliveryMethodType,
} from '../Cart';
import { useProducts } from './useProducts';
import { getDynamicText } from '../utils/getDynamicText';

interface ProductsViewProps {
  onBuyClicked: (orderData: OrderData) => void
  defaultDeliveryMethod?: DeliveryMethodType
  isLightIntegration: boolean
}

export function ProductsView({
  onBuyClicked,
  defaultDeliveryMethod,
  isLightIntegration,
}: ProductsViewProps) {
  const { i18n, t } = useTranslation();
  const { state, send: sendViews } = useViews();
  const { send: sendPDP } = usePDP();
  const { state: cartState } = useCart();
  const { products } = useProducts();
  const {
    paymentGateways, lang, storeConfigurations,
  } = useStore((storeState: any) => storeState.store);
  const { type: paymentType } = paymentGateways
    .find((paymentGatewayItem: any) => paymentGatewayItem.isDefault === true);
  const cartHeaderText = storeConfigurations?.storeCustomization?.cartHeaderText;

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

  const handleItemClicked = (productId: Product['id']) => {
    sendPDP({
      type: 'SET_PRODUCT',
      productId,
    });

    sendViews({
      type: 'SHOW_ITEM',
    });
  };

  const showProducts = () => {
    sendViews({
      type: 'GO_BACK',
    });
  };

  const canBuy = useMemo(
    () => !!cartState.context.variants?.size,
    [cartState.context.variants?.size],
  );

  if (state.matches('primary.showingProducts')) {
    return (
      <Products
        paymentType={paymentType}
        isLightIntegration={isLightIntegration}
        canBuy={canBuy}
        products={products}
        onItemClicked={handleItemClicked}
      />
    );
  }

  if (state.matches('primary.showingPDP')) {
    return (
      <PDPContainer
        isLightIntegration={isLightIntegration}
        goBack={showProducts}
      />
    );
  }

  if (state.matches('primary.showingCart')) {
    return (
      <CartView
        cartHeaderText={getDynamicText({ paymentType, textsOptions: { to_agree: t('cart.cartToAgree'), storeCustomizationText: cartHeaderText, defaultText: t('cart.cart') } })}
        payButtonText={getDynamicText({ paymentType, textsOptions: { to_agree: t('cart.payToAgree'), storeCustomizationText: '', defaultText: t('cart.pay') } })}
        defaultDeliveryMethod={defaultDeliveryMethod}
        total={0}
        renderList={null}
        onBuyClicked={async (orderData: OrderData) => {
          await onBuyClicked(orderData);
          if (defaultDeliveryMethod !== 'unavailable') sendViews({ type: 'GO_FORWARD' });
        }}
        onBackClicked={showProducts}
        canBuy
        items={[]}
        onProductAdded={() => { }}
        onProductRemoved={() => { }}
      />
    );
  }

  return (
    <div>ProductsView</div>
  );
}
