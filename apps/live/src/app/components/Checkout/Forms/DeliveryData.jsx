import React from 'react'
import PropTypes from 'prop-types'
import { EssenForm } from './EssenForm'
import { RegularDelivery } from './RegularDelivery'

export const DeliveryData = ({ control, langCheckout, isEssenStore, countryCode, storeLang }) => {
  return (
    <>
      {isEssenStore ? (
        <EssenForm control={control} />
      ) : (
        <RegularDelivery
          control={control}
          langCheckout={langCheckout}
          countryCode={countryCode}
          storeLang={storeLang}
        />
      )}
    </>
  )
}

DeliveryData.propTypes = {
  control: PropTypes.object.isRequired,
  langCheckout: PropTypes.object.isRequired,
  isEssenStore: PropTypes.bool.isRequired,
  storeLang: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
}
