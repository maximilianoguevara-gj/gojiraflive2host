import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useBeforeunload } from 'react-beforeunload'
import Snackbar from '@material-ui/core/Snackbar'

import {
  selectDisplayFinishEventCountdownstate,
  selectDisplayPopUpState,
  selectDisplayStartEventCountdownstate,
  selectSellerNetworkError,
  setDisplayFinishEventCountdown,
  setDisplayPopUpState,
  setDisplayStartEventCountdown,
} from '../reducers/callSlice'
import {
  selectIsNotificationVisible,
  selectNotificationMessage,
  setLikeMessageReceivedHandler,
  setIsLikeAnimationVisible,
  setVideoStartedHandler,
  setVideoDimensions,
  setIsNotificationVisible,
  selectUiSize,
  UI_IS_TABLET,
  showOnCloseMessageCall,
  setFinishEventCountdownMessageHandler,
  setFinishEventDateTime,
  setDisplayPopUpMessageHandler,
  setStartEventDateTime,
  setStartEventCountdownMessageHandler,
} from '../reducers/uiSlice'

import { CallLayout } from './Call/Layout'
import { Streaming } from './Call/Streaming'
import { PhoneContainer } from './Kit/Container'
import styled from 'styled-components'
import { Cards as CallCards } from './Call/Cards'
import { CheckoutIframeDialog } from './dialogs/CheckoutIframeDialog'
import { addMessageIntoChat, setChatMessageReceivedHandler } from '../reducers/uiSlice'
import CustomDialog from './dialogs/customDialog'
import { useTranslation } from 'react-i18next'
import { PoorNetworkDialog } from './dialogs/PoorNetworkDialog'
import { useViews } from 'state'
import { Products } from './Products/Products'
import { SECONDS_TO_ADD_EVENT_DATE } from '../constants/startEventDate'
import { useLocation } from 'react-router-dom'
import { selectCurrentStore } from '../reducers/storeSlice'

export default function CallCard({
  onCallFinished,
  toggleMicrophone,
  toggleCamera,
  secondsToFinishEvent,
}) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const displayFinishEventCountdown = useSelector(selectDisplayFinishEventCountdownstate)
  const displayStartEventCountdown = useSelector(selectDisplayStartEventCountdownstate)
  const {
    storeConfigurations: {
      features: { popUpCohostVideo },
    },
  } = useSelector(selectCurrentStore)
  const displayPopUpState = useSelector(selectDisplayPopUpState)
  const sellerNetworkError = useSelector(selectSellerNetworkError)
  const [sellerNetworkErrorAcknowledged, setSellerNetworkErrorAcknowledged] = useState(false)
  const uiSize = useSelector(selectUiSize)
  const { state } = useViews()
  const location = useLocation()
  const isCohostUser = location.state?.isCohostUser

  useBeforeunload(() => t('homePage.useBeforeUnload'))

  useEffect(() => {
    function popstateHandler() {
      closeCall()
    }

    window.addEventListener('popstate', popstateHandler)
    return function () {
      window.removeEventListener('popstate', popstateHandler)
    }
  }, [])

  const closeCall = () => {
    dispatch(showOnCloseMessageCall())
  }

  const onChatMessageReceived = (message) => {
    dispatch(addMessageIntoChat({ message }))
  }

  const onLikeMessageReceived = () => {
    dispatch(setIsLikeAnimationVisible({ isLikeAnimationVisible: true }))
  }

  const onFinishEventCountMessage = async (displayFinishCountdown) => {
    await dispatch(setFinishEventDateTime(secondsToFinishEvent))
    dispatch(setDisplayFinishEventCountdown(displayFinishCountdown))
  }

  const onStartEventCountMessage = async (displayStartCountdown) => {
    await dispatch(setStartEventDateTime(SECONDS_TO_ADD_EVENT_DATE))
    dispatch(setDisplayStartEventCountdown(displayStartCountdown))
  }

  const onDisplayPopUpMessage = (displayPopUp) => {
    dispatch(setDisplayPopUpState(displayPopUp))
  }

  const onVideoStarted = (mediaTrack) => {
    // mediaTrack: MediaStreamTrack (https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)
    const settings = mediaTrack.getSettings()

    // Stream is rotated by Agora, so the width and height properties of
    // the browser API are inverted
    dispatch(
      setVideoDimensions({
        width: settings.height,
        height: settings.width,
        aspectRatio: settings.aspectRatio,
      }),
    )
  }

  const handleClose = () => {
    dispatch(setIsNotificationVisible({ isNotificationVisible: false }))
  }

  useEffect(() => {
    dispatch(setChatMessageReceivedHandler(onChatMessageReceived))
    dispatch(setLikeMessageReceivedHandler(onLikeMessageReceived))
    dispatch(setVideoStartedHandler(onVideoStarted))
  }, [dispatch])

  useEffect(() => {
    dispatch(setFinishEventCountdownMessageHandler(onFinishEventCountMessage))
  }, [displayFinishEventCountdown])

  useEffect(() => {
    dispatch(setStartEventCountdownMessageHandler(onStartEventCountMessage))
  }, [displayStartEventCountdown])

  useEffect(() => {
    dispatch(setDisplayPopUpMessageHandler(onDisplayPopUpMessage))
  }, [displayPopUpState])

  const render = () => {
    if (uiSize !== UI_IS_TABLET) {
      return null
    }

    if (state.matches('main.showingCart') === true) {
      return <Products />
    } else if (state.matches('main.showingOrder') === true) {
      return <CallCards.Checkout onCallFinished={onCallFinished} />
    } else if (state.matches('main.showingOrderStatus') === true) {
      return <CallCards.CashCheckoutFinish />
    } else if (state.matches('main.showingProducts') === true) {
      return <CallCards.ProductDetail />
    }
  }

  return (
    <>
      <PhoneContainer data-test="main-container-video">
        <CustomDialog
          tittle={t('homePage.phoneContainerCustomDialogTitle')}
          description={t('homePage.phoneContainerCustomDialogDescription')}
          onClose={() => setSellerNetworkErrorAcknowledged(true)}
          isOpen={sellerNetworkError && !sellerNetworkErrorAcknowledged}
        />
        <PoorNetworkDialog />
        <Notification
          open={useSelector(selectIsNotificationVisible)}
          autoHideDuration={3000}
          onClose={handleClose}
          data-test="main-container-notification"
        >
          <span>{useSelector(selectNotificationMessage)}</span>
        </Notification>

        {render}

        <CallLayout
          onCallFinished={onCallFinished}
          toggleMicrophone={toggleMicrophone}
          toggleCamera={toggleCamera}
        />

        <Streaming
          blurStreaming={displayFinishEventCountdown || displayStartEventCountdown}
          isCohostUser={isCohostUser}
          popUpCohostVideo={popUpCohostVideo}
        />
      </PhoneContainer>
      <CheckoutIframeDialog />
    </>
  )
}

const Notification = styled(Snackbar)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: unset;
  top: 0;
  z-index: 3;
  background-color: white;
  color: black;
  transform: none;
  padding: 1.5rem 0;
`

CallCard.propTypes = {
  onCallFinished: PropTypes.func.isRequired,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
  secondsToFinishEvent: PropTypes.number,
}
