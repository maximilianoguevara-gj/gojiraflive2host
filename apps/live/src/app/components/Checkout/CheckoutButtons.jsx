import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import PaymentGateways from '../../strategy/payment/constants'
import { useTranslation } from 'react-i18next'
import { getDynamicText, Button } from 'ui'
import { MercadoPagoLogo } from '../../assets/svg/MercadoPagoLogo'
import { StripeLogo } from '../../assets/svg/StripeLogo'
import { PayPalLogo } from '../../assets/svg/PayPalLogo'
import { HasLogoUIIntegrations } from '../../constants/integrations'

export const CheckoutButtons = ({ storeConfigurations, paymentGateways, handleSubmit }) => {
  const { t } = useTranslation()
  const checkoutButtonText = storeConfigurations?.storeCustomization?.checkoutButtonText

  const getBackgroundColor = (paymentType) => {
    if (paymentType === PaymentGateways.MERCADO_PAGO) return '#99E0FF'
    if (paymentType === PaymentGateways.STRIPE) return '#635BFF'
    if (paymentType === PaymentGateways.PAYPAL) return '#FFC439'
  }
  const getText = (paymentType) => {
    if (hasLogo(paymentType)) return ''
    if (paymentType === PaymentGateways.CASH) return t('checkout.labelCash')
    return t('cart.pay')
  }

  const hasLogo = (paymentType) => HasLogoUIIntegrations.includes(paymentType)

  const Logo = ({ paymentType }) => {
    if (paymentType === PaymentGateways.PAYPAL) return <PayPalLogo />
    if (paymentType === PaymentGateways.STRIPE) return <StripeLogo />
    if (paymentType === PaymentGateways.MERCADO_PAGO) return <MercadoPagoLogo />
  }

  Logo.propTypes = {
    paymentType: PropTypes.string.isRequired,
  }

  return (
    <Container>
      {paymentGateways.map((paymentGateway, index) => {
        const { type: paymentType } = paymentGateway
        return (
          <Button
            key={index}
            id="checkout-pay-button"
            data-test="checkout-pay"
            backgroundColor={getBackgroundColor(paymentType)}
            className="w-full bg-indigo-500 text-sm font-semibold uppercase leading-4 tracking-widest"
            onClick={() => handleSubmit(paymentGateway)}
          >
            {hasLogo(paymentType) ? (
              <Logo paymentType={paymentType} />
            ) : (
              getDynamicText({
                paymentType,
                textsOptions: {
                  to_agree: t('cart.continue'),
                  storeCustomizationText: checkoutButtonText,
                  defaultText: getText(paymentType),
                },
              })
            )}
          </Button>
        )
      })}
    </Container>
  )
}

CheckoutButtons.propTypes = {
  paymentGateways: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  storeConfigurations: PropTypes.object,
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`
