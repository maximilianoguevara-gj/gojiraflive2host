import React from 'react'
import PropTypes from 'prop-types'
import { useViews } from 'state'
import styled from 'styled-components'
import { PhoneContainer } from '../../Kit/Container'
import { Checkout } from '../../GJKit/Checkout'
import { TopNavBar } from '../TopNavBar'
import { useFinishEventCountdown } from '../../../hooks/useFinishEventCountdown'
import { useStartEventCountdown } from '../../../hooks/useStartEventCountdown'
import { usePopUp } from '../../../hooks/usePopUp'
import { Products } from '../../Products/Products'
import { OrderStatus } from '../../Checkout/OrderStatus'
import { selectActiveCallCard } from '../../../reducers/uiSlice'
import { useSelector } from 'react-redux'
import { useProducts } from 'ui'
import { selectSeller } from '../../../reducers/callSlice'

export const ViewContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: ${({ isCheckoutForm }) => (isCheckoutForm ? ' 2rem 0' : '2rem')};
  gap: 0.5rem;
  height: 100%;
  border-radius: 1rem;
  background-color: white;
`

const DesktopCardContainer = styled(PhoneContainer)`
  display: flex;
  flex-direction: column;
  overflow: initial;
`

const DesktopCardBox = styled.section`
  display: flex;
  flex-direction: column;
`

export const DesktopCard = ({ isModerator, onCallFinished }) => {
  const activeCallCard = useSelector(selectActiveCallCard)
  const { dispatchFinishCountdown } = useFinishEventCountdown()
  const { dispatchStartCountdown } = useStartEventCountdown()
  const { dispatchPopUp } = usePopUp()
  const { rtmUID: sellerId } = useSelector(selectSeller)
  const { state, send } = useViews()
  useProducts({
    callId: sellerId,
  })

  const goBack = () => {
    send({
      type: 'GO_BACK',
    })
  }

  return (
    <DesktopCardBox>
      <DesktopCardContainer data-test="desktop-cart-container">
        <TopNavBar
          isDesktop
          isModerator={isModerator}
          dispatchFinishCountdown={dispatchFinishCountdown}
          dispatchStartCountdown={dispatchStartCountdown}
          dispatchPopUp={dispatchPopUp}
          onCallFinished={onCallFinished}
        />
        {state.matches('primary.showingProducts') === true ||
        state.matches('primary.showingPDP') === true ||
        state.matches('primary.showingCart') === true ? (
          <Products />
        ) : state.matches('primary.showingOrder') === true ? (
          <Checkout onCallFinished={onCallFinished} onGoBack={goBack} />
        ) : state.matches('primary.showingOrderStatus') === true ? (
          <OrderStatus activeCallCard={activeCallCard} />
        ) : null}
      </DesktopCardContainer>
    </DesktopCardBox>
  )
}

DesktopCard.propTypes = {
  onCallFinished: PropTypes.func.isRequired,
  isModerator: PropTypes.bool.isRequired,
}
