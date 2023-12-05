/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { TiendaNubeData } from './TiendaNubeData'
import PaymentGateways from '../../../../strategy/payment/constants'
import { ToAgreeData } from './ToAgreeData'

export const IntegrationForms = ({
  integrationName,
  control,
  langCheckout,
  countryCode,
  storeLang,
  isReseller,
}) => {
  const getFormByIntegrationName = (name) => {
    switch (name) {
      case PaymentGateways.TIENDA_NUBE:
        return <TiendaNubeData control={control} langCheckout={langCheckout} />
      case PaymentGateways.TO_AGREE:
        return (
          <ToAgreeData
            control={control}
            langCheckout={langCheckout}
            countryCode={countryCode}
            storeLang={storeLang}
            isReseller={isReseller}
          />
        )
      default:
        return null
    }
  }

  return <>{getFormByIntegrationName(integrationName)}</>
}

IntegrationForms.propTypes = {
  control: PropTypes.object.isRequired,
  langCheckout: PropTypes.object.isRequired,
  integrationName: PropTypes.string.isRequired,
  storeLang: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  isReseller: PropTypes.string.isRequired,
}
