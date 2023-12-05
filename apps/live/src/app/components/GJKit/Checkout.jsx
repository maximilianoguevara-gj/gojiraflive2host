import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import qs from 'qs'
import StorageService from '../../../storage'
import {
  CALL_CARD_CASH_CHECKOUT_SUCCESS,
  CALL_CARD_CASH_CHECKOUT_FAILURE,
  setActiveCallCard,
  CALL_CARD_CHECKOUT_FAILURE,
  setStockError,
  CALL_CARD_CHECKOUT_SUCCESS,
  CALL_CARD_PRODUCTS,
  selectActiveCallCard,
  closeCallCard,
} from '../../reducers/uiSlice'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { ShippingTypes } from '../../constants/shippingTypes'
import { StoreKeys } from '../../constants/storeKeys'
import { OwnFormCheckout, OwnWindowIntegrations } from '../../constants/integrations'
import UtmUtils from '../../utils/utmUtils'
import { getDireccionObject } from '../../utils/essenDireccionesUtils'
import { SecondaryHeading } from '../Kit/Headings/SecondaryHeading'
import { ProductPrice } from '../Kit/ProductRow'
import { useTranslation } from 'react-i18next'
import { selectCountry } from '../../reducers/callSlice'
import {
  selectShippingType,
  createOrder,
  checkoutProcessStatusStarted,
  startCheckout,
  getOrderWithProducts,
  selectCheckoutFinished,
  selectCheckoutSuccess,
  selectTotal,
} from '../../reducers/orderSlice'
import 'react-phone-number-input/style.css'
import { openWindow } from '../../utils/browserDetectUtils'
import PaymentGateways from '../../strategy/payment/constants'
import { unwrapResult } from '@reduxjs/toolkit'
import { CheckoutStates } from '../../constants/checkoutStates'
import { useLangCheckout } from '../../hooks/useLangCheckout'
import { useCart } from 'ui'
import { useCheckout } from '../../hooks/useCheckout'
import { useViews } from 'state'
import { ViewContainer } from '../Call/DesktopCards/DesktopCard'
import { useAuth } from '@gojiraf/auth'
import { useLogger } from '@gojiraf/logger'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import StoreUtils from '../../utils/storeUtils'
import { formatNumber, getDynamicText, MainHeading } from 'ui'
import { CheckoutButtons } from '../Checkout/CheckoutButtons'
import { ENVIROMENTS } from '../../constants/enviroments'
import { TermsAndConditionsCheckbox } from '../Checkout/TermsAndConditionsCheckbox'
import {
  BoldText,
  BottomActions,
  Form,
  FormContainer,
  StyledSpinner,
  SummaryLine,
  SummaryTotal,
  Text,
} from './Checkout.styles'
import { RegularForm } from '../Checkout/Forms/RegularForm'
import { IntegrationForms } from '../Checkout/Forms/Integrations/IntegrationsForms'

export const Checkout = ({ onCallFinished, onGoBack = () => {} }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { t } = useTranslation()
  const store = useSelector(selectCurrentStore)
  const paymentGateways = StoreUtils.getPaymentGateways(store)
  const [paymentGateway, setPaymentGateway] = useState(paymentGateways[0])
  const dispatch = useDispatch()
  const [loadingPayment, setLoadingPayment] = useState(false)
  const activeCallCard = useSelector(selectActiveCallCard)
  const checkoutFinished = useSelector(selectCheckoutFinished)
  const checkoutSuccess = useSelector(selectCheckoutSuccess)
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const { user } = useAuth()
  const shippingType = useSelector(selectShippingType)
  const total = useSelector(selectTotal)
  const countryCode = useSelector(selectCountry)
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm()
  const { shippingPrice = 0, storeConfigurations } = store
  const isDeliveryOrder = shippingType === ShippingTypes.DELIVERY
  const [checkoutInitializeStatus, setCheckoutInitializeStatus] = useState(null)
  const { langCheckout } = useLangCheckout(store)
  const { state } = useCart()
  const [productsQtyInCart] = useState(state.context.variants.size)
  const { send: sendViews } = useViews()
  const { clearCart } = useCheckout(store)
  const { addLog } = useLogger()

  const goToProducts = () => {
    sendViews({ type: 'GO_BACK_TO_PRODUCTS' })
  }

  // esta función se ejecuta cuando el usuario se encuentra en el checkout y algún producto de su carrito fue eliminado del catalogo
  // tambien se ejecuta cuando el carrito se limpia despues de seleccionar un metodo de pago que no involucre un cambio especifico de la vista
  useEffect(() => {
    if (state.context.variants.size !== productsQtyInCart) goToProducts()
  }, [state.context.variants])

  const goToCheckoutFinished = () => {
    sendViews({ type: 'GO_FORWARD' })
  }

  useEffect(() => {
    if (process.env.REACT_APP_CHECKOUT_ENVIRONMENT === ENVIROMENTS.SANDBOX) {
      reset(StorageService.getValue(StoreKeys.ORDER_DATA))
    }
  }, [reset])

  useEffect(() => {
    if (activeCallCard == CALL_CARD_PRODUCTS) {
      goToProducts()
      dispatch(closeCallCard())
    }
  }, [activeCallCard])

  useEffect(() => {
    if (checkoutFinished) {
      goToCheckoutFinished()
      if (checkoutSuccess) {
        if (
          paymentGateway.type === PaymentGateways.CASH ||
          paymentGateway.type === PaymentGateways.TO_AGREE
        ) {
          dispatch(setActiveCallCard(CALL_CARD_CASH_CHECKOUT_SUCCESS))
        } else {
          dispatch(setActiveCallCard(CALL_CARD_CHECKOUT_SUCCESS))
        }
      } else {
        dispatch(setActiveCallCard(CALL_CARD_CASH_CHECKOUT_FAILURE))
      }
    }
  }, [checkoutFinished])

  useEffect(() => {
    if (checkoutInitializeStatus === CheckoutStates.NOT_INITIALIZED) {
      goToCheckoutFinished()
      dispatch(setStockError(false))
      dispatch(setActiveCallCard(CALL_CARD_CHECKOUT_FAILURE))
    } else if (checkoutInitializeStatus === CheckoutStates.INSUFFICIENT_STOCK) {
      goToCheckoutFinished()
      clearCart()
      dispatch(setStockError(true))
      dispatch(setActiveCallCard(CALL_CARD_CHECKOUT_FAILURE))
    }
  }, [checkoutInitializeStatus])

  const onSubmit = async (data, selectedPaymentGateway) => {
    gaEventTracker('InCall > Checkout', 'checkout-pay-button')
    matomoTrackEvent('InCall > Checkout', 'checkout-pay-button')
    setPaymentGateway(selectedPaymentGateway)
    setLoadingPayment(true)
    let checkoutWindow
    try {
      const details = []
      for (const [skuId, quantity] of state.context.variants.entries()) {
        details.push({
          skuId,
          quantity,
        })
      }

      let orderData = {
        ...data,
        paymentType: selectedPaymentGateway.type,
        utmParams: { ...UtmUtils.getUtmObject(queryParams) },
        details,
      }
      const isPaymentGatewayPayPal = selectedPaymentGateway.type === PaymentGateways.PAYPAL

      addLog({
        event: 'USER_CLICKED_PAY',
        data: {
          storeId: store.id,
          shippingType,
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })

      if (OwnWindowIntegrations.includes(selectedPaymentGateway.type)) checkoutWindow = openWindow()

      if (['essen_ecommerce'].includes(selectedPaymentGateway.type)) {
        const directionObject = getDireccionObject(
          orderData.shipping.province.id,
          orderData.shipping.city.id,
        )
        orderData = { ...orderData, directionObject }
      }
      try {
        await dispatch(createOrder(orderData)).then(unwrapResult)
        await dispatch(checkoutProcessStatusStarted()).then(unwrapResult)
        await dispatch(getOrderWithProducts()).then(unwrapResult)
        const startCheckoutStatus = await dispatch(
          startCheckout({
            store,
            checkoutWindow,
            paymentGateway: selectedPaymentGateway,
            orderData,
          }),
        ).then(unwrapResult)
        setLoadingPayment(false)
        if (!isPaymentGatewayPayPal && startCheckoutStatus === CheckoutStates.STARTED) {
          clearCart()
        } else if (startCheckoutStatus !== CheckoutStates.STARTED) {
          checkoutWindow.close()
          setCheckoutInitializeStatus(startCheckoutStatus)
        }
      } catch (err) {
        console.error(err)
        onGoBack()
      }
    } catch (err) {
      console.error(err)
      onCallFinished()
    }
  }

  const getShippingPrice = (total) => {
    return shippingType === ShippingTypes.TAKEAWAY ? total : total + shippingPrice
  }

  const mainHeaderText = (paymentType) => {
    if (paymentType === PaymentGateways.TO_AGREE) return t('checkout.mainHeaderToAgree')
    if (paymentType === PaymentGateways.TIENDA_NUBE) return t('checkout.fillUserData')
    if (shippingType === ShippingTypes.TAKEAWAY) return t('checkout.mainHeaderTakeaway')

    return t('checkout.mainHeaderDelivery')
  }

  const secondaryHeaderText = (paymentType) => {
    if (paymentType === PaymentGateways.TO_AGREE)
      return (
        <>
          <span>{t('checkout.secondaryHeadingToAgreeOne')}</span>{' '}
          <BoldText>{t('checkout.secondaryHeadingToAgreeTwo')}</BoldText>
        </>
      )
    if (paymentType === PaymentGateways.TIENDA_NUBE)
      return (
        <>
          <span>{t('checkout.secondaryHeadingToAgreeOne')}</span>{' '}
        </>
      )
    return <BoldText>{t('checkout.secondaryHeadingTakeaway')}</BoldText>
  }

  return (
    <ViewContainer isCheckoutForm>
      <MainHeading
        className="px-8"
        title={mainHeaderText(paymentGateway.type)}
        onBackClicked={() => {
          onGoBack()
        }}
      />

      <FormContainer>
        <Form>
          <SecondaryHeading data-test="datos-de-facturacion">
            {secondaryHeaderText(paymentGateway.type)}
          </SecondaryHeading>
          {OwnFormCheckout.includes(paymentGateway.type) ? (
            <IntegrationForms
              integrationName={paymentGateway.type}
              control={control}
              langCheckout={langCheckout}
              countryCode={countryCode}
              storeLang={store.lang}
              isReseller={paymentGateway.isReseller}
            />
          ) : (
            <RegularForm
              isEssenStore={paymentGateway.type === PaymentGateways.ESSEN_ECOMMERCE}
              control={control}
              langCheckout={langCheckout}
              countryCode={countryCode}
              isDeliveryOrder={isDeliveryOrder}
              storeLang={store.lang}
            />
          )}

          <TermsAndConditionsCheckbox
            control={control}
            customTermsAndConditionsArray={store.customTermsAndConditions ?? []}
            termsAndConditionsError={errors.termsAndConditions}
          />
          <SecondaryHeading data-test="detalles-de-compra">
            {getDynamicText({
              paymentType: paymentGateway.type,
              textsOptions: {
                to_agree: t('checkout.secondaryHeadingDetailToAgree'),
                storeCustomizationText: '',
                defaultText: t('checkout.secondaryHeadingDetail'),
              },
            })}
          </SecondaryHeading>
          {paymentGateway.type !== PaymentGateways.TO_AGREE && (
            <SummaryLine data-test="monto-checkout">
              <span>{t('checkout.summaryLine')}</span>
              <ProductPrice>{formatNumber({ countryCode, num: total })}</ProductPrice>
            </SummaryLine>
          )}
          {isDeliveryOrder ? (
            <SummaryLine data-test="costo-de-envio-checkout">
              <span>{t('checkout.shippingPrice')}</span>
              <ProductPrice data-test="costo-envio-price">
                {formatNumber({ countryCode, num: shippingPrice })}
              </ProductPrice>
            </SummaryLine>
          ) : null}
          <SummaryTotal data-test="total-checkout">
            <span>Total</span>
            <span>{formatNumber({ countryCode, num: getShippingPrice(total) })}</span>
          </SummaryTotal>
          {shippingType === ShippingTypes.TAKEAWAY &&
          paymentGateway.type !== PaymentGateways.TO_AGREE ? (
            <Text data-test="takeawayText">{t('checkout.takeawayText')}</Text>
          ) : null}
          <BottomActions>
            {loadingPayment ? (
              <StyledSpinner />
            ) : (
              <CheckoutButtons
                storeConfigurations={storeConfigurations}
                paymentGateways={paymentGateways}
                handleSubmit={handleSubmit(onSubmit)}
              />
            )}
          </BottomActions>
        </Form>
      </FormContainer>
    </ViewContainer>
  )
}

Checkout.propTypes = {
  paymentGateways: PropTypes.func.isRequired,
  onCallFinished: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
}
