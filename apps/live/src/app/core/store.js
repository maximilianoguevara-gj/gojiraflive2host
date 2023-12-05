import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import storeReducer from '../reducers/storeSlice'
import callReducer from '../reducers/callSlice'
import orderReducer from '../reducers/orderSlice'
import cartReducer from '../reducers/cartSlice'
import chatReducer from '../reducers/uiSlice'
import uiReducer from '../reducers/uiSlice'

const middlewares = getDefaultMiddleware().concat(createLogger())

const reducers = {
  store: storeReducer,
  call: callReducer,
  order: orderReducer,
  cart: cartReducer,
  chat: chatReducer,
  ui: uiReducer,
}

export default configureStore({
  reducer: reducers,
  middleware: middlewares,
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'PROD',
  /**
   * The initial state, same as Redux's createStore.
   * You may optionally specify it to hydrate the state
   * from the server in universal apps, or to restore a previously serialized
   * user session. If you use `combineReducers()` to produce the root reducer
   * function (either directly or indirectly by passing an object as `reducer`),
   * this must be an object with the same shape as the reducer map keys.
   */
  // preloadedState?: DeepPartial<S extends any ? S : S>
  /**
   * The store enhancers to apply. See Redux's `createStore()`.
   * All enhancers will be included before the DevTools Extension enhancer.
   * If you need to customize the order of enhancers, supply a callback
   * function that will receive the original array (ie, `[applyMiddleware]`),
   * and should return a new array (such as `[applyMiddleware, offline]`).
   * If you only need to add middleware, you can use the `middleware` parameter instead.
   */
  // enhancers?: StoreEnhancer[] | ConfigureEnhancersCallback
})

//* getDefaultMiddleware
//* Dev Default middleware [thunk, immutableStateInvariant, serializableStateInvariant]
//* Prod Default middleware [thunk]
