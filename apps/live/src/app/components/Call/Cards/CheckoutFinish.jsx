import React from 'react'
import PropTypes from 'prop-types'
import { Card } from './Card'
import { CheckoutFinish as ReusableCheckoutFinish } from '../../Checkout/CheckoutFinish'

export const CheckoutFinish = ({ error = false, isMobile = false }) => {
  return (
    <Card>
      <ReusableCheckoutFinish error={error} isMobile={isMobile} />
    </Card>
  )
}

CheckoutFinish.propTypes = {
  error: PropTypes.bool,
  isMobile: PropTypes.bool,
}
