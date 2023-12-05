import React, { useEffect } from 'react'
import { useAuth } from '@gojiraf/auth'
import { useLogger } from '@gojiraf/logger'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useViews } from 'state'
import styled from 'styled-components'
import qs from 'qs'
import UtmUtils from '../../utils/utmUtils'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { selectPostalCodeErrorMessage } from '../../reducers/uiSlice'
import { MainHeading } from 'ui'
import { Button } from '../Kit/Buttons'
import { CheckOutline, DeclineOutline } from './CashCheckoutFinish'
import { clearCheckoutStatus } from '../../reducers/orderSlice'
import useStockErrors from '../../hooks/useStockErrors'
import { useCheckout } from '../../hooks/useCheckout'

export const CheckoutFinish = ({ error = false, isMobile = false }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const store = useSelector(selectCurrentStore)
  const { clearCart } = useCheckout(store)
  const postCodeError = useSelector(selectPostalCodeErrorMessage)
  const { isStockError, stockErrorText, stockErrorTextTwo } = useStockErrors(store)
  const { send: sendViews } = useViews()
  const { addLog } = useLogger()
  const { user } = useAuth()

  useEffect(() => {
    const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })

    addLog({
      event: error === true ? 'CHECKOUT_SUCCESS' : 'CHECKOUT_FAILURE',
      data: {
        ...queryParams,
        storeId: store.id,
        userId: user.id,
        ...UtmUtils.getUtmObject(queryParams),
      },
    })
  }, [])

  const checkoutFailure = () => {
    dispatch(clearCheckoutStatus())
    sendViews({ type: 'GO_BACK' })
  }

  const checkoutSuccess = () => {
    dispatch(clearCheckoutStatus())
    clearCart()
    sendViews({ type: 'GO_BACK' })
  }

  const renderMessages = () => {
    if (postCodeError != '') {
      return <Text>{t('checkout.postalCodeError') + postCodeError}</Text>
    }
    return (
      <>
        <Text>{isStockError ? stockErrorText : t('checkout.textError')}</Text>
        <Text fontWeight="400">
          {isStockError ? stockErrorTextTwo : t('checkout.textErrorTwo')}
        </Text>
      </>
    )
  }

  return (
    <>
      {error ? (
        <>
          <MainHeading title={t('checkout.mainHeaderDelivery')} onBackClicked={checkoutFailure} />
          <TextContainer isMobile={isMobile}>
            <DeclineOutline />
            {renderMessages()}
          </TextContainer>
          <Button variant="contained" onClick={checkoutFailure}>
            {t('checkout.buttonError')}
          </Button>
        </>
      ) : (
        <>
          <MainHeading title={t('checkout.mainHeader')} onBackClicked={checkoutSuccess} />
          <TextContainer isMobile={isMobile}>
            <CheckOutline fontSize="large" />
            <Text>{t('checkout.essenCheckoutSuccessText')}</Text>
          </TextContainer>
        </>
      )}
    </>
  )
}

const Text = styled.p`
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : '600')};
  font-size: 1rem;
  text-align: center;
  margin-bottom: auto;
`
const TextContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: ${({ isMobile }) => (isMobile ? '7rem 1.875rem' : 'auto 1.875rem')};
`

CheckoutFinish.propTypes = {
  error: PropTypes.bool,
  isMobile: PropTypes.bool,
}
