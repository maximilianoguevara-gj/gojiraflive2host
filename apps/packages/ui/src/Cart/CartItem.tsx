/* eslint-disable max-len */
import React from 'react';
import { Variant } from '../Products/IProduct';
import { QuantityInput } from '../Kit/QuantityInput';
import { ICartItem } from './ICartItem';
import { ProductPrice } from '../Kit/ProductPrice';
import { ListItem } from '../Kit/ListItem';

interface CartItemProps {
  item: ICartItem;
  onProductAdded: (product: Variant['id']) => void;
  onProductRemoved: (product: Variant['id']) => void;
}

export function CartItem({
  item,
  onProductAdded = () => {},
  onProductRemoved = () => {},
}: CartItemProps) {
  const noQuantityLimitReached = item.limitPerOrder === undefined || item.quantity < item.limitPerOrder;
  return (
    <ListItem
      itemId={item.id}
      imageUrl={item.images[0].imageUrl}
      onProductClicked={() => {}}
      title={item.product.name}
      renderBottomMid={(
        <span
          style={{
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
          }}
          className="grow overflow-hidden text-ellipsis text-sm font-medium capitalize break-words text-gray-400"
        >
          {Object.entries(item.options)
            .map(([optionId, valueId]) => {
              const foundOption = item.product.variants.find(
                (option) => option.id === optionId,
              );

              const foundValue = foundOption?.values.find((optionValue) => {
                const value = optionValue.id || optionValue.value;
                return value === valueId;
              });

              return foundValue!.value;
            })
            .join(' / ')}
        </span>
      )}
      renderTopRight={
        <ProductPrice from={item.price} to={item.originalPrice} />
      }
      renderBottomRight={(
        <QuantityInput
          canDelete
          noQuantityLimitReached={noQuantityLimitReached}
          quantity={item.quantity}
          onAdd={() => { if (noQuantityLimitReached) onProductAdded(item.id); }}
          onRemove={() => onProductRemoved(item.id)}
          productName={item.product.name}
        />
      )}
    />
  );
}
