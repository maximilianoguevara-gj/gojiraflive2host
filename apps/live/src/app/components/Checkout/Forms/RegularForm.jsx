import React from 'react'
import PropTypes from 'prop-types'
import { DeliveryData } from './DeliveryData'
import { BillingData } from './BillingData'

export const RegularForm = ({
  control,
  langCheckout,
  isEssenStore,
  countryCode,
  isDeliveryOrder,
  storeLang,
}) => {
  return (
    <>
      <BillingData
        countryCode={countryCode}
        langCheckout={langCheckout}
        control={control}
        isEssenStore={isEssenStore}
        storeLang={storeLang}
      />
      {isDeliveryOrder && (
        <DeliveryData
          isEssenStore={isEssenStore}
          control={control}
          langCheckout={langCheckout}
          countryCode={countryCode}
          storeLang={storeLang}
        />
      )}
    </>
  )
}

RegularForm.propTypes = {
  control: PropTypes.object.isRequired,
  langCheckout: PropTypes.object.isRequired,
  isEssenStore: PropTypes.bool.isRequired,
  countryCode: PropTypes.string.isRequired,
  storeLang: PropTypes.string.isRequired,
  isDeliveryOrder: PropTypes.bool.isRequired,
}
