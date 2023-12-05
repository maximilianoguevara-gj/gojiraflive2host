import React from 'react'
import PropTypes from 'prop-types'
import { Card } from './Card'
import { Checkout as ReusableCheckout } from '../../GJKit/Checkout'
import { ContainerWithTransparentScroll } from './style'

export const Checkout = ({ onCallFinished }) => {
  return (
    <Card>
      <ContainerWithTransparentScroll>
        <ReusableCheckout onCallFinished={onCallFinished} />
      </ContainerWithTransparentScroll>
    </Card>
  )
}

Checkout.propTypes = {
  onCallFinished: PropTypes.func.isRequired,
}
