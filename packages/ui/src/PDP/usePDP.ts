import create from 'zustand';
import { assign, createMachine } from 'xstate';
import middleware from 'zustand-xstate-middleware';
import { Product } from '../Products/IProduct';

interface PDPContext {
  productId: Product['id'] | null
}

type OrdersEvent =
| { type: 'SET_PRODUCT'; productId: Product['id'] };

// eslint-disable-next-line operator-linebreak
const pdpMachine =
// eslint-disable-next-line max-len
/** @xstate-layout N4IgpgJg5mDOIC5QAcLILIEMDGALAlgHZgB0R+ALgMQDKAogCoD6ACgEoDyAIgKoDCDANoAGALqIUAe1iV8kwhJABPRAEYALOoA0IAB5qAHOoC+xnagw4CxErFySA7kSgsATpIgBXbNTZ16zCxcLCLiSCDI0rLyivoIALQATKokAJzqqckGAOwArDoqCADMRQBsJLnZBqqJBtXqpanZidmm5mhYeESkdo7Obh7e1AGsnLwCoYqRMhRyCuFxRS0kmrlFNfnKiImluSS7pYlr9Y3NrW0ghB5wUx1W3WSElFNRszELiMIFapoXFp3WHr2JyEFzuLw+F4zOaxNR5EgGUpLapHb7FAyJfbZVKNVTrBpNFp-O5dYhQ6LzUBxeKNNIZLJ5NG5XKmUxAA */
createMachine({
  context: { productId: null },
  tsTypes: {} as import('./usePDP.typegen').Typegen0,
  schema: { context: {} as PDPContext, events: {} as OrdersEvent },
  initial: 'init',
  states: {
    init: {
      on: {
        SET_PRODUCT: {
          target: 'showingProduct',
          actions: 'assignProduct',
        },
      },
    },
    showingProduct: {
      on: {
        SET_PRODUCT: {
          target: 'showingProduct',
          actions: 'assignProduct',
          internal: false,
        },
      },
    },
  },
  id: 'pdpMachine',
}, {
  actions: {
    assignProduct: assign((context, event) => ({
      productId: event.productId,
    })),
  },
});

const usePDP = create(middleware(pdpMachine));

export { usePDP };
