import React from 'react';
import { useTranslation } from 'react-i18next';
import { List } from '../Kit/List';
import { ICartItem } from './ICartItem';

interface CartListProps {
  items: ICartItem[];
  renderItem: (item: ICartItem, index: number) => React.ReactNode
}

export function CartList({
  items,
  renderItem,
}: CartListProps) {
  const { t } = useTranslation();

  return (
    <List
      emptyListText={t('products.productListEmpty')}
      items={items}
      renderItem={renderItem}
    />
  );
}
