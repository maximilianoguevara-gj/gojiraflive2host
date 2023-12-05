import { v4 as uuidv4 } from 'uuid'
import { createSlice, createSelector } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    cartInitialized: false,
  },
  reducers: {
    setVariantOptionSelected: (state, action) => {
      if (state.products.length > 0) {
        let product = state.products[action.payload.index]
        state.products[action.payload.index] = {
          ...product,
          variantOptionName: action.payload.variantOptionName,
        }
      }
    },
    setCartInitialized: (state) => {
      state.cartInitialized = true
    },
    addProductIntoCart: (state, action) => {
      const { product, variant } = action.payload

      const newProduct = {
        uid: uuidv4(),
        ...product,
        variant,
        variantOptionName: variant ? variant.label ?? variant.name : '',
      }

      state.products.push(newProduct)
    },
    removeProductFromCart: (state, action) => {
      const { uid } = action.payload
      if (uid) {
        state.products = state.products.filter((product) => product.uid !== uid)
      }
    },
    clearCart: (state) => {
      state.products = []
    },
    setQuantity: (state, action) => {
      const { uid, quantity, total } = action.payload
      let idx = state.products.findIndex((product) => product.uid === uid)
      state.products[idx].quantity = quantity
      state.products[idx].total = total
    },
  },
  extraReducers: {},
})

//* ACTIONS
export const {
  addProductIntoCart,
  removeProductFromCart,
  clearCart,
  setCartInitialized,
  setVariantOptionSelected,
  setQuantity,
} = cartSlice.actions

//* SELECTORS
export const selectProducts = (state) => state.cart.products
export const selectCartSize = (state) => state.cart.products.length
export const selectProductHasDue = (state) =>
  state.cart.products.every(
    (product) =>
      product.dueValue !== undefined &&
      product.dueQuantity !== undefined &&
      product.dueValue > 0 &&
      product.dueQuantity > 0,
  )
// export const selectTotal = createSelector(selectProducts, (products) => {
//   const productsHasDue = products.every(
//     (product) =>
//       product.dueValue !== undefined &&
//       product.dueQuantity !== undefined &&
//       product.dueValue > 0 &&
//       product.dueQuantity > 0,
//   )
//   const total = productsHasDue
//     ? products.reduce((total, product) => total + product.dueValue * product.quantity, 0)
//     : products.reduce((total, product) => total + product.price * product.quantity, 0)
//   return total
// })
export const selectThirdPriceTotal = createSelector(selectProducts, (products) => {
  const thidPriceTotal = products.reduce((total, product) => {
    const price = product.thirdPrice || product.price
    return total + price * product.quantity
  }, 0)

  return thidPriceTotal
})

export const selectExistsThirdPricedProduct = createSelector(selectProducts, (products) => {
  const existsThirdPricedProduct = products.some((product) => product.thirdPrice)
  return existsThirdPricedProduct
})
export const selectIsCartInitialized = (state) => state.cart.cartInitialized
//* REDUCER
export default cartSlice.reducer
