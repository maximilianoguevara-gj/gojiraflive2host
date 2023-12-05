/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Icons } from 'icons';
import _isEqual from 'lodash.isequal';
import _uniqBy from 'lodash.uniqby';
import { useTranslation } from 'react-i18next';
import { useStore } from 'state';
import { useDevices } from '@gojiraf/responsive';
import { useUtm } from '@gojiraf/useutm';
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics';
import { Button } from '../Kit/Button';
import { Product, Variant } from '../Products/IProduct';
import { OptionsSelector } from './OptionsSelector';
import { QuantityInput } from '../Kit/QuantityInput';
import { CartCount, CartCountProps } from '../Cart/CartCount';
import { getDynamicText } from '../utils/getDynamicText';
import { useUtmMediumFromURL } from '../hooks';
import Accordion from '../Kit/Accordion';
import { PDPPrices } from '../Kit/PDPPrices';

interface ProductDetailPageProps extends CartCountProps {
  product: Product;
  quantity: number;
  isLightIntegration: boolean;
  selectedVariant: Variant | null;
  setSelectedVariant: (index: number) => void;
  onQuantityChanged: (newQuantity: number) => void;
  onGoBack: () => void;
  onAddProductToCart: (
    selectedVariant: Variant['id'],
    quantity: number
  ) => void;
}

export function ProductDetailPage({
  product,
  quantity = 1,
  selectedVariant,
  isLightIntegration,
  setSelectedVariant,
  onQuantityChanged = () => { },
  onGoBack = () => { },
  onAddProductToCart = () => { },
}: ProductDetailPageProps) {
  const { t, i18n } = useTranslation();
  const store = useStore((storeState: any) => storeState.store);
  const addToCartButtonText = store?.storeConfigurations?.storeCustomization?.addToCartButtonText;
  const { type: paymentType } = store.paymentGateways
    .find((paymentGatewayItem: any) => paymentGatewayItem.isDefault === true);
  const [canAdd, setCanAdd] = useState<boolean>(false);
  const productImage = selectedVariant!.images[0].imageUrl ?? product.images[0].imageUrl ?? '';
  const { isMd } = useDevices();
  const uniqueProductChoice = product.skus.length === 1;
  const utmMedium = useUtmMediumFromURL();
  const { isTotemDevice } = useUtm(utmMedium);
  const { gaEventTracker } = useGoogleAnalytics();
  const { sendEventPostToElastic } = useElasticEventTracker();
  const { matomoTrackEvent } = useMatomoAnalytics();

  const handleOptionsSelected = (optionsSelected: any) => {
    const selectedVariantIndexFound = product.skus.findIndex(
      (variant) => _isEqual(variant.options, optionsSelected),
    );

    if (selectedVariantIndexFound !== -1) {
      setSelectedVariant(selectedVariantIndexFound);
      setCanAdd(true);
    } else {
      setCanAdd(false);
    }
  };

  useEffect(() => {
    i18n.changeLanguage(store.lang);
  }, []);

  useEffect(() => {
    if (uniqueProductChoice || !product.variants) {
      if (uniqueProductChoice) setSelectedVariant(0);
      setCanAdd(true);
    }
  }, [product]);

  const getDefaultValue = () => {
    const defaultVariantSelected = uniqueProductChoice ? product.skus[0].id : undefined;
    return defaultVariantSelected;
  };

  const noQuantityLimitReached = selectedVariant?.limitPerOrder === undefined || quantity < selectedVariant?.limitPerOrder;

  const renderDescription = () => !!product.description && product.description !== product.name;

  const handleAddButton = () => {
    if (isLightIntegration) {
      gaEventTracker('InCall > Products', `click-view-more-integration-light [${product.name}]`);
      matomoTrackEvent('InCall > Products', `click-view-more-integration-light [${product.name}]`);
      sendEventPostToElastic('products', 'click-view-more-integration-light', `${product.name}`);
      window.open(selectedVariant?.externalUrl, '_blank');
      return;
    }

    onAddProductToCart(selectedVariant!.id, quantity);
  };

  const hasLabel = !canAdd && product.skus?.length > 1 && _uniqBy(product.skus, 'price').length > 1;

  return (
    <div className="h-full card overflow-hidden bg-base-100">
      <div style={{ boxShadow: 'inset 0 -5px 4px -5px rgba(0, 0, 0, 0.25)' }} className="card-body h-full pt-4 sm:pt-8 overflow-y-scroll overflow-x-hidden bg-base-100">
        <div className="flex flex-col grow h-full">
          {isMd === true ? (
            <div className="flex justify-between items-center mb-7 p-1">
              <div className="flex items-center">
                <Icons.Chevron.Left className="text-3xl cursor-pointer" onClick={onGoBack} />
                <span className="card-title capitalize text-base sm:text-2xl font-medium leading-3 tracking-wider">{t('pdp.products')}</span>
              </div>
              {isLightIntegration ? null : <CartCount />}
            </div>
          ) : null}
          <div className="flex flex-col items-center justify-between grow h-80">
            <div className="flex flex-col w-full gap-6">
              <div className={`flex flex-col justify-center ${isTotemDevice ? 'width_img_product_totem height_img_product_totem' : 'w-64 h-64'} mobileXs:w-48 mobileXs:h-48 mx-auto rounded-lg shadow-xl`}>
                {product.images.length > 0 ? (
                  <img
                    className="h-full rounded-lg object-cover"
                    src={productImage}
                    alt={product.description ?? ''}
                  />
                ) : null}
              </div>
              <div className="flex w-full items-start">
                <span style={{ WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', display: '-webkit-box' }} className="overflow-hidden text-ellipsis text-sm font-medium capitalize break-words">{product.name}</span>
              </div>
              <div className="flex flex-col">
                <PDPPrices
                  hasLabel={hasLabel}
                  from={selectedVariant!.price}
                  to={selectedVariant!.originalPrice}
                />
                {store.shippingPrice === 0 && <span className="font-medium font-size text-xs">{t('pdp.freeShipping')}</span>}
              </div>
              {isLightIntegration ? null : (
                <>
                  {product.variants?.length > 0 && (
                  <div className="w-full">
                    <OptionsSelector
                      defaultValue={getDefaultValue()}
                      options={product.variants}
                      skus={product.skus}
                      onOptionsSelected={handleOptionsSelected}
                    />
                  </div>
                  )}
                  <div>
                    <QuantityInput
                      canDelete={false}
                      noQuantityLimitReached={noQuantityLimitReached}
                      quantity={quantity}
                      onAdd={() => { if (noQuantityLimitReached) onQuantityChanged(quantity + 1); }}
                      productName={product.name}
                      onRemove={() => { if (quantity > 1) onQuantityChanged(quantity - 1); }}
                    />
                  </div>
                </>
              )}
              {renderDescription() && <Accordion title={t('pdp.description')} content={product.description} />}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full p-6">
        <Button
          id="product-detail-add-to-cart-button"
          className="uppercase tracking-widest w-full"
          onClick={handleAddButton}
          disabled={!canAdd}
        >
          {getDynamicText({
            paymentType,
            textsOptions: {
              light: t('pdp.lightIntegration'),
              to_agree: t('pdp.addToAgree'),
              storeCustomizationText: addToCartButtonText,
              defaultText: t('pdp.add'),
            },
          })}
        </Button>
      </div>
    </div>
  );
}
