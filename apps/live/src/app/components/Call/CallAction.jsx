import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { selectActiveCallCard } from '../../reducers/uiSlice'
import { ChatModule } from '../Chat/ChatModule'
import { Cameras } from '../GJKit/Cameras/Cameras'
import { GJSwiper } from '../GJKit/Swiper/GJSwiper'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { useViews } from 'state'
import { PDPContainer, Modal, useProducts } from 'ui'
import { AnimatePresence } from 'framer-motion'
import { Products } from '../Products/Products'
import { Checkout } from '../GJKit/Checkout'
import { OrderStatus } from '../Checkout/OrderStatus'
import { useChat } from '../../hooks/useChat'
import { selectSeller } from '../../reducers/callSlice'
import { useAuth } from '@gojiraf/auth'
import { useCheckout } from '../../hooks/useCheckout'
import { JoinChatForm } from '../Chat/JoinChatForm'

const CallAction = ({ onCallFinished, setInitChat }) => {
  const { user } = useAuth()
  const { chatData, initChat } = useChat({ user, isDesktop: false })
  const activeCallCard = useSelector(selectActiveCallCard)
  const store = useSelector(selectCurrentStore)
  const { isOneToManySale, storeConfigurations } = store
  const { isLightIntegration } = useCheckout(store)
  const { rtmUID: sellerId } = useSelector(selectSeller)
  const { state, send } = useViews()
  const { products } = useProducts({
    callId: sellerId,
  })

  useEffect(() => {
    setInitChat({ initChat: initChat })
  }, [])

  const onPDPClose = () => {
    send({
      type: 'SHOW_PRODUCTS',
    })
  }

  const goBack = () => {
    send({
      type: 'GO_BACK',
    })
  }

  return (
    <>
      {state.matches('secondary.showingChat') === true && (
        <ChatModule chatData={chatData} user={user} />
      )}
      {state.matches('secondary.showingJoinChat') === true && (
        <Modal onClose={goBack}>
          <JoinChatForm />
        </Modal>
      )}
      {state.matches('secondary.showingProducts') === true && <GJSwiper products={products} />}
      <AnimatePresence>
        {state.matches('main.showingCart') === true && (
          <Modal size="LARGE" onClose={onPDPClose}>
            <Products />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state.matches('main.showingPDP') === true && (
          <Modal size="LARGE" onClose={onPDPClose}>
            <PDPContainer isLightIntegration={isLightIntegration} goBack={goBack} />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state.matches('main.showingOrder') === true && (
          <Modal onClose={onPDPClose}>
            <Checkout onCallFinished={onCallFinished} onGoBack={goBack} />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state.matches('main.showingOrderStatus') === true && (
          <Modal onClose={goBack}>
            <OrderStatus activeCallCard={activeCallCard} />
          </Modal>
        )}
      </AnimatePresence>
      {!isOneToManySale && (
        <HidableCameras
          allowsMultipleBuyers={storeConfigurations.allowsMultipleBuyers}
          visible={state.matches('secondary.showingParticipants') === true}
        />
      )}
      {state.matches('secondary.showingNone') === true && null}
    </>
  )
}

CallAction.propTypes = {
  onCallFinished: PropTypes.func.isRequired,
  setInitChat: PropTypes.func.isRequired,
}

const HidableCameras = styled(Cameras)`
  ${({ visible }) => (visible ? '' : 'display: none;')}
`

export { CallAction }
