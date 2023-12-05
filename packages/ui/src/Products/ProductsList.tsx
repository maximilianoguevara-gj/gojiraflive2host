import React from 'react';
import { useTranslation } from 'react-i18next';
import { List } from '../Kit/List';
import { Product } from './IProduct';

interface ProductsListProps {
  products: Product[];
  renderItem: (product: Product, index: number) => React.ReactNode
}

export function ProductsList({
  products,
  renderItem,
}: ProductsListProps) {
  const { t } = useTranslation();
  return (
    <List
      emptyListText={t('products.productListEmpty')}
      items={products}
      renderItem={renderItem}
    />
  );
}
