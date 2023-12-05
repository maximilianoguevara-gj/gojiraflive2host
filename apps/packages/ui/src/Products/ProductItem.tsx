import React from 'react';
// import { Icons } from 'icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@gojiraf/auth';
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics';
import _uniqBy from 'lodash.uniqby';
import { useStore } from 'state';
import { Product } from './IProduct';
import { highlightProduct } from './productsService';
import { ProductPrice } from '../Kit/ProductPrice';
import { ListItem } from '../Kit/ListItem';
import { ButtonViewProduct } from '../Kit/ButtonViewProduct';

interface ProductItemProps {
  product: Product;
  onProductClicked: (product: Product['id']) => void;
}

export function ProductItem({
  product,
  onProductClicked = () => {},
}: ProductItemProps) {
  const { user: { role, tokens } } = useAuth();
  const isModerator = role === 'MODERATOR';
  const { gaEventTracker } = useGoogleAnalytics();
  const { matomoTrackEvent } = useMatomoAnalytics();
  const { t } = useTranslation();
  const { sendEventPostToElastic } = useElasticEventTracker();
  const { goJirafUsers: [{ id: callId }] } = useStore((storeState: any) => storeState.store);

  const viewProduct = () => {
    gaEventTracker('InCall > Products', `click-product-detail-d [${product.name}]`);
    matomoTrackEvent('InCall > Products', `click-product-detail-d [${product.name}]`);
    sendEventPostToElastic('products', 'click-product-detail', `${product.name}`);
    onProductClicked(product.id);
  };

  const viewProductFromImage = () => {
    gaEventTracker('InCall > Products', `click-img-product-detail [${product.name}]`);
    matomoTrackEvent('InCall > Products', `click-img-product-detail [${product.name}]`);
    sendEventPostToElastic('products', 'click-img-product-detail', `${product.name}`);
    onProductClicked(product.id);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (isModerator) {
      highlightProduct({ callId, productId: product.id, accessToken: tokens?.accessToken });
      return;
    }
    viewProduct();
  };

  const hasLabel = product.skus?.length > 1 && _uniqBy(product.skus, 'price').length > 1;

  return (
    <ListItem
      className="cursor-pointer"
      itemId={product.id}
      imageUrl={product.images[0].imageUrl}
      onProductClicked={() => viewProductFromImage()}
      title={product.name}
      renderTopRight={(
        <ProductPrice
          hasLabel={hasLabel}
          from={product.price}
          to={product.originalPrice}
        />
      )}
      renderBottomRight={(
        <ButtonViewProduct
          className="text-[10px] font-light uppercase leading-4 tracking-widest"
          onClick={handleClick}
        >
          {isModerator ? t('products.highlightProduct') : t('products.viewProduct')}
        </ButtonViewProduct>
      )}
    />
  );
}
