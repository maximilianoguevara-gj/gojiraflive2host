import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectIsStockError } from '../reducers/uiSlice'
import StoreUtils from '../utils/storeUtils'
import PaymentGateways from '../strategy/payment/constants'
import { useTranslation } from 'react-i18next'

const useStockErrors = (store) => {
  const [stockErrorMessages, setStockErrorMessages] = useState({
    stockErrorText: '',
    stockErrorTextTwo: '',
  })
  const { t } = useTranslation()
  const [paymentGateway] = StoreUtils.getPaymentGateways(store)
  const isStockError = useSelector(selectIsStockError)

  useEffect(() => {
    if (paymentGateway.type === PaymentGateways.TIENDA_NUBE) {
      setStockErrorMessages({
        stockErrorText: t('checkout.stockErrorTN'),
        stockErrorTextTwo: t('checkout.stockErrorTNTwo'),
      })
    }
    if (paymentGateway.type === PaymentGateways.ESSEN_ECOMMERCE) {
      setStockErrorMessages({
        stockErrorText: t('checkout.stockErrorEssen'),
        stockErrorTextTwo: t('checkout.stockErrorEssenTwo'),
      })
    }
  }, [])

  return {
    isStockError,
    stockErrorText: stockErrorMessages.stockErrorText,
    stockErrorTextTwo: stockErrorMessages.stockErrorTextTwo,
  }
}

export default useStockErrors
