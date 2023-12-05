import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLogger } from '@gojiraf/logger';
import { Variant } from '../Products/IProduct';
import { useProducts } from '../Products/useProducts';
import { Cart, CartCarsoProps } from './Cart';
import { ICartItem } from './ICartItem';
import { useCart } from './useCart';
import EmptyCart from './EmptyCart';

interface CartViewProps extends CartCarsoProps {
}

export function CartView({ cartHeaderText, ...props }: CartViewProps) {
  const { state: cartState, send } = useCart();
  const { products } = useProducts();
  const { t } = useTranslation();
  const { addLog } = useLogger();

  const items = useMemo(() => {
    const cartItems: ICartItem[] = [];

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

  // eslint-disable-next-line max-len
  const total = useMemo(() => items.reduce((acc, item) => acc + (item.price * item.quantity), 0), [items]);

  const handleProductAdded = (variantId: Variant['id']) => {
    send({
      type: 'Add product variant',
      productVariantId: variantId,
      quantity: 1,
    });

    addLog({
      event: 'PRODUCT_ADDED_TO_CART',
      data: {
        // storeId: store.id,
        variantId,
        // userId
      },
    });
  };

  const handleProductRemoved = (variantId: Variant['id']) => {
    send({
      type: 'Remove product variant',
      productVariantId: variantId,
    });

    addLog({
      event: 'PRODUCT_REMOVED_FROM_CART',
      data: {
        // storeId: store.id,
        variantId,
        // userId
      },
    });
  };
  const isEmpty = useMemo(() => items.length === 0, [items]);

  return (
    <>
      {isEmpty === true ? (
        <EmptyCart
          {...props}
          title={cartHeaderText}
          subtitle={t('cart.emptyCart')}
        />
      ) : (
        <Cart
          {...props}
          cartHeaderText={cartHeaderText}
          canBuy={isEmpty === false}
          total={total}
          items={items}
          onProductAdded={handleProductAdded}
          onProductRemoved={handleProductRemoved}
        />
      )}
    </>
  );
}
