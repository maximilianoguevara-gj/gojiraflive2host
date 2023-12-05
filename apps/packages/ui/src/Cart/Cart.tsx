import React from 'react';
import { useStore } from 'state';
import { Product } from '../Products/IProduct';
import { ICartItem } from './ICartItem';
import { CartCard } from './CartCard';
import { CartCardCarso, CartCardCarsoProps } from './CartCardCarso';
import { CartList } from './CartList';
import { CartItem } from './CartItem';

export interface CartCarsoProps extends CartCardCarsoProps {
  items: ICartItem[]
  cartHeaderText: string,
  payButtonText: string,
  onProductAdded: (productId: Product['id']) => void
  onProductRemoved: (productId: Product['id']) => void
}

export function Cart({
  total = 0,
  canBuy = false,
  items = [],
  cartHeaderText,
  payButtonText,
  onBuyClicked = () => { },
  onProductAdded = () => { },
  onProductRemoved = () => { },
  ...props
}: CartCarsoProps) {
  const { paymentGateways } = useStore((storeState: any) => storeState.store);
  const paymentGateway = paymentGateways
    .find((paymentGatewayItem: any) => paymentGatewayItem.isDefault === true);
  return (
    <>
      {
        paymentGateway.type === 'carso'
          ? (
            <CartCardCarso
              {...props}
              cartHeaderText={cartHeaderText}
              payButtonText={payButtonText}
              total={total}
              canBuy={canBuy}
              onBuyClicked={onBuyClicked}
              renderList={(
                <CartList
                  items={items}
                  renderItem={(item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onProductAdded={() => onProductAdded(item.id)}
                      onProductRemoved={() => onProductRemoved(item.id)}
                    />
                  )}
                />
              )}
            />
          )
          : (
            <CartCard
              {...props}
              paymentType={paymentGateway.type}
              cartHeaderText={cartHeaderText}
              payButtonText={payButtonText}
              total={total}
              canBuy={canBuy}
              onBuyClicked={onBuyClicked}
              renderList={(
                <CartList
                  items={items}
                  renderItem={(item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onProductAdded={() => onProductAdded(item.id)}
                      onProductRemoved={() => onProductRemoved(item.id)}
                    />
                  )}
                />
              )}
            />
          )
      }

    </>
  );
}
