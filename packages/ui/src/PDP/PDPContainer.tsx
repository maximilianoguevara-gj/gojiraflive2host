/* eslint-disable max-len */
import React, { useMemo, useState } from 'react';
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics';
import { useCart } from '../Cart/useCart';
import { Variant } from '../Products/IProduct';
import { useProducts } from '../Products/useProducts';
import { ProductDetailPage } from './ProductDetailPage';
import { usePDP } from './usePDP';

interface PDPContainerProps {
  goBack: () => void;
  isLightIntegration: boolean;
}

interface QuantityDiff {
  exceedsLimit: boolean;
  quantityDiff : number;
}

export function PDPContainer({ goBack, isLightIntegration }: PDPContainerProps) {
  const { gaEventTracker } = useGoogleAnalytics();
  const { matomoTrackEvent } = useMatomoAnalytics();
  const { state } = usePDP();
  const { send: cartSend, state: stateUseCart } = useCart();
  const { getProductById, products } = useProducts();
  const product = useMemo(
    () => getProductById(state.context.productId!),
    [state.context.productId, products],
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const selectedVariant: any = useMemo(() => {
    if (!product) {
      goBack();
      return null;
    }
    return product!.skus[selectedVariantIndex];
  }, [selectedVariantIndex, product]);

  const getQuantityDiff = (selectedVariantId: Variant['id'], selectedQuantity: number): QuantityDiff => {
    const currentQuantityInCart = stateUseCart.context.variants.get(selectedVariantId) ?? 0;
    const { limitPerOrder } = selectedVariant;
    const exceedsLimit = currentQuantityInCart + selectedQuantity > limitPerOrder;
    let quantityDiff = 0;

    if (limitPerOrder === undefined) return { exceedsLimit, quantityDiff };
    if (exceedsLimit) {
      quantityDiff = currentQuantityInCart + selectedQuantity - limitPerOrder;
    }

    return { quantityDiff, exceedsLimit };
  };

  const handleAddProductToCart = (selectedVariantId: Variant['id'], selectedQuantity: number) => {
    const { exceedsLimit, quantityDiff } = getQuantityDiff(selectedVariantId, selectedQuantity);
    if (exceedsLimit === true && quantityDiff === 0) {
      goBack();
      return;
    }

    if (stateUseCart.context.variants.size === 0) {
      gaEventTracker('InCall > Products', 'cart-initialized');
      matomoTrackEvent('InCall > Products', 'cart-initialized');
    }
    gaEventTracker('InCall > Products', `add-product-to-cart [${selectedVariant?.name}]`);
    matomoTrackEvent('InCall > Products', `add-product-to-cart [${selectedVariant?.name}]`);
    cartSend({
      type: 'Add product variant',
      productVariantId: selectedVariantId,
      quantity: selectedQuantity - quantityDiff,
    });
    goBack();
  };

  return (
    <>
      {selectedVariant && (
        <ProductDetailPage
          isLightIntegration={isLightIntegration}
          selectedVariant={selectedVariant}
          setSelectedVariant={(index) => {
            setSelectedVariantIndex(index);
          }}
          quantity={quantity}
          onQuantityChanged={(newQuantity) => setQuantity(newQuantity)}
          product={product!}
          onGoBack={goBack}
          onAddProductToCart={handleAddProductToCart}
        />
      )}
    </>

  );
}
