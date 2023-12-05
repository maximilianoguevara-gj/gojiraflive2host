import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loggerService } from '@gojiraf/logger'
import { useAuthStore } from '@gojiraf/auth'
import qs from 'qs'
import OrderService from '../services/orderService'
import ProductService from '../services/productService'
import CallService from '../services/callService'
import ShippingService from '../services/shippingService'
import StorageService from '../../storage'
import { StoreKeys } from '../constants/storeKeys'
import { ShippingTypes } from '../constants/shippingTypes'
import { EventLogsEs } from '../constants/eventLogsEs'
import { CheckoutStates } from '../constants/checkoutStates'
import UtmUtils from '../utils/utmUtils'
import Payment from '../strategy/payment/payment'
import { ENVIROMENTS } from '../constants/enviroments'

//* ASYNC THUNK ACTIONS
export const startCheckout = createAsyncThunk(
  'order/startCheckout',
  async ({ checkoutWindow, paymentGateway, orderData, productsList }, { getState }) => {
    const {
      order: { order },
      store: { current: store },
    } = getState()
    const { user } = useAuthStore.getState()
    let payment = new Payment(paymentGateway)
    let checkoutInitializeStatus = CheckoutStates.STARTED

    payment.createQuote({ user, store, order, orderData, productsList })

    // TODO
    // startCheckoutStatus deberia eliminarse y usar checkoutInitializeStatus
    // pero payment.startCheckout() afecta a todas las integraciones, con lo cual deberiamos devolver el status en todas las integraciones
    // por ahora lo dejamos así
    const startCheckoutStatus = await payment.startCheckout()
    const checkoutStartFailed =
      startCheckoutStatus === CheckoutStates.NOT_INITIALIZED ||
      startCheckoutStatus === CheckoutStates.INSUFFICIENT_STOCK

    if (checkoutStartFailed) {
      return startCheckoutStatus
    }

    const total = order.orderDetails
      .map((detail) => detail.product.price)
      .reduce((total, price) => (total += price), 0)
    const products = order.orderDetails
      .map((detail) => detail.product.name.split(' ').join(''))
      .filter((product) => product)
      .join(' ')

    try {
      const isLoggerEnabled = process.env.REACT_APP_FEATURE_FLAG_LOGGER === 'true'

      if (isLoggerEnabled) {
        loggerService.addLog({
          event: 'CHECKOUT_STARTED',
          data: {
            storeId: store.id,
            storeName: store.name,
            paymentGateway: paymentGateway.type,
            mount: total,
            order: order.id,
            companyName: store.company.name,
            shippingOrderEmail: order.shippingOrderEmail ? order.shippingOrderEmail : 'anonimo',
            buyer: order.buyerName ? order.buyerName : 'anonimo',
            products: products,
            ...UtmUtils.getUtmObject(qs.parse(window.location.search, { ignoreQueryPrefix: true })),
            userId: user.id ?? EventLogsEs.ANONIMO_WEB,
          },
        })
      }
    } catch {
      console.warn("CHECKOUT_STARTED log couldn't be sent")
    }

    payment.goToCheckout({
      checkoutWindow,
      countryCode: store.countryCode,
      paymentGateway,
      orderId: order.id,
    })
    return checkoutInitializeStatus
  },
)

export const createOrder = createAsyncThunk('order/createOrder', async (data, { getState }) => {
  let buyerName = data.fullName || `${data.name} ${data.lastName}`
  const {
    order: { shippingType },
    store: { current: store },
    call: {
      seller: { rtmUID: sellerId },
    },
  } = getState()
  const { user } = useAuthStore.getState()

  const shipping =
    shippingType === ShippingTypes.DELIVERY && (await ShippingService.createShipping(data))

  const { order } = await OrderService.createOrder({
    user,
    store,
    sellerId,
    shippingEmail: data.email,
    username: buyerName,
    shippingId: shipping?.shipping?.id,
    shippingType,
    paymentType: data.paymentType,
    buyerDni: data.dni || '-',
    buyerPhoneCode: data.buyerPhoneCode,
    buyerPhoneNumber: data.buyerPhoneNumber,
    shippingPrice: store.shippingPrice || 0,
    utmParams: data.utmParams,
    details: data.details,
    resellerNumber: data.resellerNumber,
    zoneNumber: data.zoneNumber,
  })

  if (process.env.REACT_APP_CHECKOUT_ENVIRONMENT === ENVIROMENTS.SANDBOX) {
    StorageService.setValue(StoreKeys.ORDER_DATA, data)
  }

  return order
})

export const createOrderDetail = createAsyncThunk(
  'order/createOrderDetail',
  async (product, { getState }) => {
    const { order } = getState().order
    const response = await ProductService.createOrderDetail(
      order.id,
      product,
      product.variantOptionName || product.variant?.join(' '),
    )
    return response.orderDetail
  },
)

export const sendEmails = createAsyncThunk('order/sendEmails', async (_, { getState }) => {
  const { order } = getState().order
  const response = await OrderService.sendEmails(order.id)
  return response.orderDetail
})

export const startPaypal = createAsyncThunk(
  'order/startPaypal',
  async ({ quote, paymentGatewayId, orderId }) => {
    return await OrderService.startPaypal({
      quote,
      paymentGatewayId,
      orderId,
    })
  },
)

export const paypalNotification = createAsyncThunk(
  'order/paypalNotification',
  async ({ paymentGatewayId, paymentToken, orderId }) => {
    return await OrderService.paypalNotification({
      paymentGatewayId,
      orderId,
      paymentToken,
    })
  },
)

export const rejectPaypal = createAsyncThunk('order/rejectPaypal', async (_, { getState }) => {
  const { order } = getState().order
  const response = await OrderService.rejectPaypal(order)
  return response
})

export const notifyOrderShipped = createAsyncThunk('order/notifyOrderShipped', async (products) => {
  let productsIds = ''
  products.forEach(async (product) => {
    productsIds += product.id + ','
  })
  productsIds =
    productsIds.length > 0 ? productsIds.substring(0, productsIds.length - 1) : productsIds
  await CallService.notifyChannelOrderShipped(productsIds)
})

export const checkoutProcessStatusStarted = createAsyncThunk(
  'order/checkoutProcessStatusStarted',
  async (_, { getState }) => {
    const { user } = useAuthStore.getState()
    const { order } = getState().order
    const response = await OrderService.startCheckoutProcessStatus(order, user)
    return response.order
  },
)

export const getOrderWithProducts = createAsyncThunk(
  'order/getOrderWithProducts',
  async (_, { getState }) => {
    const { order } = getState().order
    const response = await OrderService.getOrderById(order.id)
    return response.order
  },
)

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    result: '',
    error: undefined,
    order: '',
    orderError: undefined,
    productsIntoOrder: [],
    productsIntoOrderError: undefined,
    checkoutProcessStatusStartedError: undefined,
    shippingType: ShippingTypes.TAKEAWAY,
    checkoutIframeUrl: '',
    checkoutState: CheckoutStates.NOT_FINISHED,
    checkoutPayPalFinalize: false,
    data: {},
    total: 0,
  },
  reducers: {
    setOrderData: (state, action) => {
      state.data = action.payload
    },
    setShippingType: (state, action) => {
      state.shippingType = action.payload
    },
    setCheckoutIframeUrl: (state, action) => {
      state.checkoutIframeUrl = action.payload.url
    },
    setCheckoutStarted: (state, action) => {
      state.checkoutState = action.payload ? CheckoutStates.STARTED : CheckoutStates.NOT_FINISHED
    },
    setCheckoutFinishedSuccess: (state, action) => {
      state.checkoutState = action.payload ? CheckoutStates.SUCCESS : CheckoutStates.FAILED
    },
    clearCheckoutStatus: (state) => {
      state.checkoutState = CheckoutStates.NOT_FINISHED
    },
    setTotal: (state, action) => {
      state.total = action.payload.total
    },
  },
  extraReducers: {
    [startCheckout.fulfilled]: (state, action) => {
      state.result = action.payload
    },
    [startCheckout.rejected]: (state, action) => {
      state.error = action.error.code
    },
    [createOrder.fulfilled]: (state, action) => {
      const { order } = action.payload
      state.order = order
      StorageService.setValue(StoreKeys.ORDER_ID, order.id, StoreKeys.GOJIRAF_USER_TTL)
    },
    [createOrder.rejected]: (state, action) => {
      state.orderError = action.error.code
    },
    [createOrderDetail.fulfilled]: (state, action) => {
      state.productsIntoOrder = [...state.productsIntoOrder, action.payload]
      state.order.orderDetails = state.productsIntoOrder
    },
    [createOrderDetail.rejected]: (state, action) => {
      state.productsIntoOrderError = action.error.code
    },
    [checkoutProcessStatusStarted.rejected]: (state, action) => {
      state.checkoutProcessStatusStartedError = action.error.code
    },
    [getOrderWithProducts.fulfilled]: (state, action) => {
      state.order = action.payload
    },
    [getOrderWithProducts.rejected]: (state, action) => {
      state.orderError = action.error.code
    },
  },
})

//* ACTIONS
export const {
  setOrderData,
  setShippingType,
  setCheckoutIframeUrl,
  setCheckoutStarted,
  setCheckoutFinishedSuccess,
  clearCheckoutStatus,
  setTotal,
} = orderSlice.actions

//* SELECTORS
export const selectOrderData = (state) => state.order.data
export const selectShippingType = (state) => state.order.shippingType
export const selectPaymentType = (state) => state.order.order.paymentType
export const selectTotal = (state) => state.order.total
export const selectCheckoutIframeUrl = (state) => state.order.checkoutIframeUrl
export const selectCheckoutFinished = (state) =>
  state.order.checkoutState !== CheckoutStates.NOT_FINISHED &&
  state.order.checkoutState !== CheckoutStates.STARTED
export const selectCheckoutStarted = (state) => state.order.checkoutState === CheckoutStates.STARTED
export const selectCheckoutSuccess = (state) => state.order.checkoutState === CheckoutStates.SUCCESS
//* REDUCER
export default orderSlice.reducer
