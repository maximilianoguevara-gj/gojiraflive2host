import React from 'react'
import PropTypes from 'prop-types'
import { Card } from './Card'
import { CashCheckoutFinish as ReusableCashCheckoutFinish } from '../../Checkout/CashCheckoutFinish'

export const CashCheckoutFinish = ({ error = false }) => {
  return (
    <Card>
      <ReusableCashCheckoutFinish error={error} />
    </Card>
  )
}

CashCheckoutFinish.propTypes = {
  error: PropTypes.bool.isRequired,
}
