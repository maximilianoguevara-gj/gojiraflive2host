import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import to from 'await-to-js'
import { Splash } from '../components/Splash'
import { CallHomeContainer } from '../pages/oneToOneLayout'
import { useTimeoutCallback } from '@react-hook/timeout'
import { useSelector, useDispatch } from 'react-redux'
import { selectStoreError, setMeetingIsFull } from '../reducers/storeSlice'
import {
  leaveCall,
  joinRTMChannel,
  setSellerNetworkError,
  joinRTCChannel,
  changeCallState,
  setIsOnCall,
  setMobileChatConnected,
  leaveRTM,
} from '../reducers/callSlice'
import StoreUtils from '../utils/storeUtils'
import CallingLoader from '../components/callingLoader'
import StoreNotFound from './storeNotFound'
import qs from 'qs'
import { EventLogs } from '../constants/eventLogs'
import { EventLogsEs } from '../constants/eventLogsEs'
import HangUpCallDialog from '../components/dialogs/hangUpCallDialog'
import UtmUtils from '../utils/utmUtils'
import { Call } from '../components/Call/Call'
import { PhoneContainer } from '../components/Kit/Container'
import CallService, { CallServiceEvents } from '../services/callService'
import { selectUiSize, setShowStoreInfo, UI_IS_TABLET } from '../reducers/uiSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { CallStates } from '../constants/callStates'
import { CallProvider } from '../../state/CallContext'
import { useLogger } from '@gojiraf/logger'
import { useAuth } from '@gojiraf/auth'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUtm } from '@gojiraf/useutm'
import { getEventOnGoing } from '../utils/countdownTimerUtils'
import { useLocalCamera } from '../hooks/useLocalCamera'
import { useLocalMicrophone } from '../hooks/useLocalMicrophone'
const { REACT_APP_JOIN_OTM_TIMEOUT = 30000 } = process.env

export default function OneToManyLayout(props) {
  const { store } = props
  const {
    backgroundUrl = null,
    backgroundUrlMobile = null,
    company: {
      companyConfigurations: { maxParticipants },
    },
    goJirafUsers: [{ id: agoraChannelId, activeCallTime }],
  } = store
  const dispatch = useDispatch()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { sendEventPostToElastic } = useElasticEventTracker()
  const [loading, setLoading] = useState(false)
  const [callStarted, setCallStarted] = useState(false)
  const uiSize = useSelector(selectUiSize)
  const storeError = useSelector(selectStoreError)
  const { user } = useAuth()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const [isCallFinishedDialogOpen, setIsCallFinishedDialogOpen] = useState(false)
  const eventOnGoing = getEventOnGoing(activeCallTime)
  const [start, reset] = useTimeoutCallback(() => {
    CallService.off(CallServiceEvents.SELLER_PUBLISHED_CAMERA, sellerPublishedCameraHandler)
    CallService.off(CallServiceEvents.SELLER_HUNG_UP, onCallFinished)
    dispatch(leaveCall())
    onCallFinished(EventLogs.SELLER_DOES_NOT_PICK_UP)
    const eventStatus = activeCallTime ? activeCallTime : 'not started'
    sendEventPostToElastic(eventStatus)
    props.navigateToSellerNotAvailable(eventOnGoing)
  }, Number(REACT_APP_JOIN_OTM_TIMEOUT))
  const [duration, setDuration] = useState(null)
  const [callDuration, setCallDuration] = useState(null)
  const [buyerEngagementHandler, setBuyerEngagementHandler] = useState()
  const { addLog } = useLogger()
  const navigate = useNavigate()
  const location = useLocation()
  const isCohostUser = location.state?.isCohostUser
  const { utm_medium } = UtmUtils.getUtmObject(queryParams)
  const { isAllowedToJoinCall } = useUtm(utm_medium)
  const { toggleMicrophone } = useLocalMicrophone()
  const { toggleCamera } = useLocalCamera()
  const isMobile = uiSize === UI_IS_TABLET

  const sellerPublishedCameraHandler = (params) => {
    reset()
    if (!props.buyerEnteredStore) {
      props.setBuyerEnteredStore(!props.buyerEnteredStore)
      CallService.identifyMySelf()
    }
    onCallStarted(params)
  }

  useEffect(() => {
    startCall()
  }, [])

  const startCall = async () => {
    if (!store.isOpen) {
      addLog({
        event: 'STORE_CLOSED',
        data: {
          storeId: store.id,
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })

      props.navigateToSellerNotAvailable()
    } else {
      const onError = async (error) => {
        addLog({
          event: 'CALL_FAILED',
          data: {
            storeId: store.id,
            error: JSON.stringify(error),
            userId: user.id,
            ...UtmUtils.getUtmObject(queryParams),
          },
        })

        await dispatch(leaveCall()).then(unwrapResult)
        onCallFinished()
      }

      CallService.on(CallServiceEvents.SELLER_PUBLISHED_CAMERA, sellerPublishedCameraHandler)
      CallService.on(CallServiceEvents.SELLER_HUNG_UP, onCallFinished)
      start()

      const [errorRTM, joinRTM] = await to(dispatch(joinRTMChannel(agoraChannelId)))
      if (errorRTM || !joinRTM) {
        await onError(errorRTM)
        return
      }
      dispatch(setIsOnCall(true))

      addLog({
        event: 'BUYER_CALLING',
        data: {
          storeId: store.id,
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })

      const { otherBuyers } = await CallService.getCallMembersCount()
      if (otherBuyers >= maxParticipants && !isAllowedToJoinCall && eventOnGoing) {
        dispatch(leaveRTM())
        onCallFinished(EventLogs.EVENT_IS_FULL)
        dispatch(setMeetingIsFull(true))
        return
      }

      const [errorRTC, joinRTC] = await to(
        dispatch(joinRTCChannel({ channel: agoraChannelId, isCohostUser })),
      )
      if (errorRTC || !joinRTC) {
        onError(errorRTC)
        return
      }
      history.pushState(CallStates.IN_CALL_STATE, CallStates.IN_CALL_STATE)
      dispatch(changeCallState(CallStates.CALL_STARTED))

      addLog({
        event: 'CALL_INITIALIZED',
        data: {
          storeId: store.id,
          storeName: store.name,
          flow: 'OTM',
          userId: user.id ?? EventLogsEs.ANONIMO_WEB,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })
    }
  }

  const getMainContent = () => {
    if (loading) {
      return <Splash />
    } else {
      if (storeError) {
        return <StoreNotFound />
      }
      if (callStarted) {
        return (
          <CallProvider>
            <Call
              onCallFinished={onCallFinished}
              setLoading={setLoading}
              setDuration={setDuration}
              toggleMicrophone={toggleMicrophone}
              toggleCamera={toggleCamera}
              setCallDuration={setCallDuration}
            />
          </CallProvider>
        )
      } else {
        return (
          <>
            <PhoneContainer data-test="camera-container-OTF">
              <CallingLoader />
            </PhoneContainer>
            <HangUpCallDialog
              onClose={() => {
                setLoading(true)
                setIsCallFinishedDialogOpen(false)
              }}
              isOneToMany={props.store.isOneToManySale}
              isOpen={isCallFinishedDialogOpen}
            />
          </>
        )
      }
    }
  }

  const onCallStarted = (videoController) => {
    setCallStarted(true)
    videoController.play('video__streaming', { fit: 'cover' })
    dispatchCallEngagementEvent()
    dispatch(setShowStoreInfo({ showStoreInfo: true }))
  }

  const dispatchCallEngagementEvent = () => {
    const timer = setTimeout(() => {
      addLog({
        event: 'BUYER_CALL_ENGAGEMENT',
        data: {
          storeId: store.id,
          storeName: store.name,
          companyName: store.company.name,
          flow: 'OTM',
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })
    }, 15000)
    setBuyerEngagementHandler(timer)
  }

  const onCallFinished = (event) => {
    setLoading(true)
    dispatch(setIsOnCall(false))
    dispatch(setMobileChatConnected(false))
    dispatch(setSellerNetworkError(false))
    setCallStarted(false)
    clearTimeout(buyerEngagementHandler)
    dispatchFinishEvent(event)
    showDialogsByEvent(event)
    dispatch(setShowStoreInfo({ showStoreInfo: false }))
    if (event === EventLogs.SELLER_HANG_UP_ALL) {
      gaEventTracker('InCall', `end-call-OTM [${store?.id}]`)
      matomoTrackEvent('InCall', `end-call-OTM [${store?.id}]`)
      navigate(`/store/${store.id}/form`)
    }
  }

  const showDialogsByEvent = (event) => {
    switch (event) {
      case EventLogs.SELLER_HANG_UP_ALL:
        setIsCallFinishedDialogOpen(true)
        dispatch(changeCallState(CallStates.SELLER_HANG_UP_ALL))
        break
      default:
        break
    }
  }

  const dispatchFinishEvent = (event) => {
    if (event === EventLogs.SELLER_DOES_NOT_PICK_UP) {
      addLog({
        event: 'SELLER_DOES_NOT_PICK_UP',
        data: {
          userTimeInCallMs: duration,
          userTimeInCall: callDuration,
          userId: user.id,
          storeId: store.id,
          storeName: store.name,
          companyName: store.company.name,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })
    } else {
      addLog({
        event: 'USER_HANG_UP',
        data: {
          userTimeInCallMs: duration,
          userTimeInCall: callDuration,
          userId: user.id,
          storeId: store.id,
          storeName: store.name,
          companyName: store.company.name,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })
    }
  }

  return (
    <CallHomeContainer
      isMobile={uiSize === UI_IS_TABLET}
      style={{
        backgroundImage: `url(${StoreUtils.getBackgroundImage({
          isMobile,
          backgroundUrlMobile,
          backgroundUrl,
        })})`,
      }}
      data-test="background-image"
    >
      {getMainContent()}
    </CallHomeContainer>
  )
}

OneToManyLayout.propTypes = {
  store: PropTypes.object,
  setBuyerEnteredStore: PropTypes.func,
  buyerEnteredStore: PropTypes.bool,
  navigateToSellerNotAvailable: PropTypes.func,
}
