import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import qs from 'qs'
import { useViews } from 'state'
import { ErrorOutline, CheckCircleOutline } from '@material-ui/icons'
import UtmUtils from '../../utils/utmUtils'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { clearCheckoutStatus, selectPaymentType } from '../../reducers/orderSlice'
import { Button } from '../Kit/Buttons'
import { useTranslation } from 'react-i18next'
import { getDynamicText, MainHeading } from 'ui'
import { useLogger } from '@gojiraf/logger'
import { useAuth } from '@gojiraf/auth'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import PaymentGateways from '../../strategy/payment/constants'
import { ToAgreeCheck } from '../../assets/svg/ToAgreeCheck'

export const CashCheckoutFinish = ({ error = false }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const paymentType = useSelector(selectPaymentType)
  const store = useSelector(selectCurrentStore)
  const { user } = useAuth()
  const { send: sendViews } = useViews()
  const { addLog } = useLogger()

  useEffect(() => {
    const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    dispatch(clearCheckoutStatus())
    addLog({
      event: error === true ? 'CHECKOUT_SUCCESS' : 'CHECKOUT_FAILURE',
      data: {
        storeId: store.id,
        userId: user.id,
        ...UtmUtils.getUtmObject(qs.parse(window.location.search, { ignoreQueryPrefix: true })),
        ...queryParams,
      },
    })
  }, [])

  const goBackToProducts = () => {
    sendViews({ type: 'GO_BACK' })
  }

  const tryAgain = () => {
    gaEventTracker('InCall > Checkout', 'checkout-try-again-button')
    matomoTrackEvent('InCall > Checkout', 'checkout-try-again-button')
    sendViews({ type: 'GO_FORWARD' })
  }

  return (
    <>
      <MainHeading
        title={
          error
            ? t('checkout.mainHeaderError')
            : getDynamicText({
                paymentType,
                textsOptions: {
                  to_agree: t('checkout.toAgreeHeader'),
                  storeCustomizationText: '',
                  defaultText: t('checkout.mainHeader'),
                },
              })
        }
        onBackClicked={goBackToProducts}
      />
      <ItemsContainer>
        <IconContainer>
          {error ? (
            <DeclineOutline />
          ) : (
            <>
              {paymentType === PaymentGateways.TO_AGREE ? <StyledToAgreeCheck /> : <CheckOutline />}
            </>
          )}
        </IconContainer>

        <Container data-test="cash-container">
          {error ? (
            <Text data-test="cash-error">{t('checkout.textError')}</Text>
          ) : (
            <>
              <Text data-test="cash-text">
                <strong>
                  {getDynamicText({
                    paymentType,
                    textsOptions: {
                      to_agree: t('checkout.thanksToAgree'),
                      storeCustomizationText: '',
                      defaultText: t('checkout.thanksCash'),
                    },
                  })}
                </strong>
                <br></br>
                {getDynamicText({
                  paymentType,
                  textsOptions: {
                    to_agree: t('checkout.textToAgree'),
                    storeCustomizationText: '',
                    defaultText: t('checkout.textCash'),
                  },
                })}
              </Text>
              <Text style={{ fontSize: '0.75rem' }}>
                {t('checkout.gojirafText')}
                <strong> GoJiraf.</strong>
              </Text>
            </>
          )}
        </Container>
      </ItemsContainer>
      {error && (
        <Container>
          <Button
            data-test="try-again-button"
            id="checkout-try-again-button"
            variant="outlined"
            onClick={tryAgain}
          >
            {t('checkout.buttonError')}
          </Button>
        </Container>
      )}
    </>
  )
}

const Text = styled.p`
  text-align: center;
  margin-bottom: auto;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3rem;
`
const ItemsContainer = styled.div`
  margin: auto 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const CheckOutline = styled(CheckCircleOutline)`
  fill: #32d74b;
  font-size: 3rem;
`

export const StyledToAgreeCheck = styled(ToAgreeCheck)`
  font-size: 3rem;
`

export const DeclineOutline = styled(ErrorOutline)`
  font-size: 3rem;
  fill: #b00020;
`

CashCheckoutFinish.propTypes = {
  error: PropTypes.bool,
}
