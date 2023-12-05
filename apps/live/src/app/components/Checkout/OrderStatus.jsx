import React from 'react'
import PropTypes from 'prop-types'
import {
  CALL_CARD_CASH_CHECKOUT_FAILURE,
  CALL_CARD_CASH_CHECKOUT_SUCCESS,
  CALL_CARD_CHECKOUT_FAILURE,
  CALL_CARD_CHECKOUT_SUCCESS,
} from '../../reducers/uiSlice'
import { CashCheckoutFinish } from './CashCheckoutFinish'
import { CheckoutFinish } from './CheckoutFinish'
import { ViewContainer } from '../Call/DesktopCards/DesktopCard'

export const OrderStatus = ({ activeCallCard }) => {
  return (
    <ViewContainer>
      {activeCallCard === CALL_CARD_CHECKOUT_SUCCESS ? (
        <CheckoutFinish />
      ) : activeCallCard === CALL_CARD_CHECKOUT_FAILURE ? (
        <CheckoutFinish error />
      ) : activeCallCard === CALL_CARD_CASH_CHECKOUT_SUCCESS ? (
        <CashCheckoutFinish />
      ) : activeCallCard === CALL_CARD_CASH_CHECKOUT_FAILURE ? (
        <CashCheckoutFinish error />
      ) : (
        <CheckoutFinish />
      )}
    </ViewContainer>
  )
}

OrderStatus.propTypes = {
  activeCallCard: PropTypes.string,
}
