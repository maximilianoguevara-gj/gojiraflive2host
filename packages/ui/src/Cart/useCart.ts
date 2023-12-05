import { createMachine, assign } from 'xstate';
import create from 'zustand';
import middleware from 'zustand-xstate-middleware';
import { Product, Variant } from '../Products/IProduct';

interface CartContext {
  variants: Map<Variant['id'], number>;
}

type CartEvent =
  | { type: 'Add product variant'; productVariantId: Variant['id']; quantity: number }
  | { type: 'Remove product variant'; productVariantId: Variant['id'] }
  | { type: 'Products list changed'; productsList: Product[] }
  | { type: 'Reset Cart'; };

// eslint-disable-next-line operator-linebreak
const cartMachine =
  // eslint-disable-next-line max-len
  /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgWVcgFgJYB2YAdAKIC2ADpgJ4DEAghBAAQ3oD2EArskzsAbhkKpimANoAGALqJQNbrEKZC3YopAAPRAEYALAHYyAJgCcANgAcxmTZOGAzIbNWANCHqJnAVjMyfWczGxsZZ2NjP0M-fQBfeK80LFwCEnIAMUIAGxyWNk4efkERMQlpeW1lVXVNbT0EY2cbMis-K3cO-SNgz29EM2iyCxkrEJsemQs-DqtE5IwcPCJSMmy8xgAlMCpuYTAi3gEhUXRxSVkFJBAatQ0tG8ajU0tbe0djFzd+nwQzWZtYwWaJRNxGOwLEApZbpNYbfI7PYHI4lU7lS76a5KFT3epPRBWKymWLOHpvPxjaJeP76YFkUlmGQxaKzCxmZxQmFpVZZXL5AAKxROsHYOUIsCEBAkMAgV2quLqj1AjWa+jIjki4QihmJMkMNMQNmcZBkZpklichhkxg5iSSIGIvDg2m5KwyCtqDwaiAAtL8-VZTeaQ6GbVyljyMpRaAxPXjlbpEG5DQhnESyAErPomS4zTELBHUu74fz40qfU0LK0HH4LKSejnU5FTP565SvuMAgl7UA */
  createMachine({
    context: { variants: new Map<Variant['id'], number>() },
    tsTypes: {} as import('./useCart.typegen').Typegen0,
    schema: { context: {} as CartContext, events: {} as CartEvent },
    initial: 'Empty',
    states: {
      Empty: {
        on: {
          'Add product variant': {
            target: 'Fill',
            actions: 'addProductOnCart',
          },
        },
      },
      Fill: {
        on: {
          'Add product variant': {
            target: 'Fill',
            actions: 'addProductOnCart',
            internal: false,
          },
          'Remove product variant': [
            {
              target: 'Empty',
              cond: 'cart is empty after removing the product',
              actions: 'removeProductOnCart',
            },
            {
              target: 'Fill',
              actions: 'removeProductOnCart',
              internal: false,
            },
          ],
          'Products list changed': {
            target: 'Fill',
            actions: 'checkVariantsOnCart',
            internal: false,
          },
          'Reset Cart':
          {
            target: 'Empty',
            actions: 'resetCart',
          },
        },
      },
    },
    id: 'cartMachine',
  }, {
    guards: {
      'cart is empty after removing the product': (context) => context.variants.size === 0,
    },
    actions: {
      addProductOnCart: assign((context, event) => {
        const newProducts = new Map(context.variants);

        const { productVariantId, quantity } = event;
        const currentQuantity = context.variants.get(productVariantId) ?? 0;

        newProducts.set(productVariantId, currentQuantity + quantity);

        return {
          variants: newProducts,
        };
      }),
      removeProductOnCart: assign((context, event) => {
        const newProducts = new Map(context.variants);

        const { productVariantId } = event;
        const quantity = context.variants.get(productVariantId) ?? 1;

        if (quantity === 1) {
          newProducts.delete(productVariantId);
        } else {
          newProducts.set(productVariantId, quantity - 1);
        }

        return {
          variants: newProducts,
        };
      }),
      checkVariantsOnCart: assign((context, event) => {
        const { productsList } = event;
        const newVariants = new Map<Variant['id'], number>();

        context.variants.forEach((quantity, skuId) => {
          const variantExists = productsList.some(
            (product) => product.skus.some((sku) => sku.id === skuId),
          );

          if (variantExists === true) {
            newVariants.set(skuId, quantity);
          }
        });

        return {
          variants: newVariants,
        };
      }),
      resetCart: assign(() => ({
        variants: new Map<Variant['id'], number>(),
      })),
    },
  });

const useCart = create(middleware(cartMachine));

export { useCart };
