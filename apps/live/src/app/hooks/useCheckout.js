import qs from 'qs'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import {
  checkoutProcessStatusStarted,
  createOrder,
  getOrderWithProducts,
  startCheckout,
} from '../reducers/orderSlice'
import UtmUtils from '../utils/utmUtils'
import { openWindow } from '../utils/browserDetectUtils'
import { useCart, useProducts } from 'ui'
import { ShippingTypes } from '../constants/shippingTypes'
import { OwnCheckoutIntegrations } from '../constants/integrations'
import StoreUtils from '../utils/storeUtils'
import { useLogger } from '@gojiraf/logger'
import { useAuth } from '@gojiraf/auth'
import { useViews } from 'state'
import { CALL_CARD_CHECKOUT_FAILURE, setActiveCallCard, setStockError } from '../reducers/uiSlice'
import { CheckoutStates } from '../constants/checkoutStates'
import PaymentGateways from '../strategy/payment/constants'

export const useCheckout = (store) => {
  const [paymentGateway] = StoreUtils.getPaymentGateways(store)
  const dispatch = useDispatch()
  const { user } = useAuth()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const { state, send } = useCart()
  const { products: productsList } = useProducts()
  const hasOwnCheckout = OwnCheckoutIntegrations.includes(paymentGateway.type)
  const isToAgreeShippingType = paymentGateway.type === PaymentGateways.TO_AGREE
  const isLightIntegration = paymentGateway.type === PaymentGateways.LIGHT
  const { send: sendViews } = useViews()
  const { addLog } = useLogger()

  const clearCart = () => {
    send({ type: 'Reset Cart' })
  }

  const goBack = () => {
    sendViews({ type: 'GO_BACK' })
  }

  const setCheckoutStatus = (checkoutStatus, checkoutWindow) => {
    if (checkoutStatus === CheckoutStates.INSUFFICIENT_STOCK) {
      checkoutWindow.close()
      sendViews({ type: 'SHOW_ORDER_STATUS' })
      dispatch(setStockError(true))
      dispatch(setActiveCallCard(CALL_CARD_CHECKOUT_FAILURE))
      return
    }
    if (checkoutStatus === CheckoutStates.NOT_INITIALIZED) {
      checkoutWindow.close()
      goBack()
      return
    }
    goBack()
  }

  const handleOwnCheckout = async () => {
    addLog({
      event: 'USER_CLICKED_PAY',
      data: {
        storeId: store.id,
        shippingType: ShippingTypes.UNAVAILABLE,
        userId: user.id,
        ...UtmUtils.getUtmObject(queryParams),
      },
    })

    const details = []
    for (const [skuId, quantity] of state.context.variants.entries()) {
      details.push({
        skuId,
        quantity,
      })
    }

    let checkoutWindow
    if (paymentGateway.type !== 'carso') checkoutWindow = openWindow()

    const orderData = {
      paymentType: paymentGateway.type,
      utmParams: { ...UtmUtils.getUtmObject(queryParams) },
      details,
    }
    try {
      await dispatch(createOrder(orderData)).then(unwrapResult)
      await dispatch(checkoutProcessStatusStarted()).then(unwrapResult)
      await dispatch(getOrderWithProducts()).then(unwrapResult)
      const startCheckoutStatus = await dispatch(
        startCheckout({ store, checkoutWindow, paymentGateway, productsList }),
      ).then(unwrapResult)
      setCheckoutStatus(startCheckoutStatus, checkoutWindow)
      clearCart()
    } catch (error) {
      console.error(error)
      goBack()
    }
  }

  return { handleOwnCheckout, hasOwnCheckout, isToAgreeShippingType, isLightIntegration, clearCart }
}
