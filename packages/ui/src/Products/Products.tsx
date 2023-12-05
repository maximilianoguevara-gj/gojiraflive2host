import React from 'react';
import { Product } from './IProduct';
import { ProductsCard } from './ProductsCard';
import { ProductItem } from './ProductItem';
import { ProductsList } from './ProductsList';
import { CartCountProps } from '../Cart/CartCount';

export interface ProductsDesktopProps extends CartCountProps {
  canBuy: boolean
  products: Product[]
  paymentType: string;
  onItemClicked: (productId: Product['id']) => void
  isLightIntegration: boolean
}

export function Products({
  canBuy = false,
  paymentType,
  products = [],
  onItemClicked = () => { },
  isLightIntegration,
}: ProductsDesktopProps) {
  return (
    <ProductsCard
      paymentType={paymentType}
      isLightIntegration={isLightIntegration}
      canBuy={canBuy}
      renderList={(
        <ProductsList
          products={products}
          renderItem={(product) => (
            <ProductItem
              key={product.id}
              product={product}
              onProductClicked={() => onItemClicked(product.id)}
            />
          )}
        />
      )}
    />
  );
}
