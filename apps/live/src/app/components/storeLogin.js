import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import to from 'await-to-js'
import { useTimeoutCallback } from '@react-hook/timeout'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentStore, setMeetingIsFull } from '../reducers/storeSlice'
import {
  changeCallState,
  joinRTCChannel,
  joinRTMChannel,
  leaveCall,
  leaveRTM,
  setIsOnCall,
} from '../reducers/callSlice'
import UtmUtils from '../utils/utmUtils'
import { EventLogs } from '../constants/eventLogs'
import { PhoneContainer } from './Kit/Container'
import CallService, { CallServiceEvents } from '../services/callService'
import LoadingLayout from './LoadingLayout'
import { CallStates } from '../constants/callStates'
import { CustomerRoles } from '../constants/customerRoles'
import { useLogger } from '@gojiraf/logger'
import { useAuth } from '@gojiraf/auth'

const MAX_QUANTITY_OF_BUYERS = 15

export default function StoreLogin(props) {
  const [submitClicked, setSubmitClicked] = useState(false)
  const store = useSelector(selectCurrentStore)
  const dispatch = useDispatch()
  const { setUsername, user } = useAuth()
  const { addLog } = useLogger()

  const [start, reset] = useTimeoutCallback(() => sellerDoesntAnswer(), 60000)
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const limitBuyers = store.storeConfigurations.features.limitBuyers ?? false

  const sellerDoesntAnswer = () => {
    CallService.off(CallServiceEvents.SELLER_PUBLISHED_CAMERA, sellerPublishedCameraHandler)
    CallService.off(CallServiceEvents.SELLER_HUNG_UP, props.onCallFinished)
    dispatch(leaveCall())
    props.onCallFinished(EventLogs.SELLER_DOES_NOT_PICK_UP)
    props.navigateToSellerNotAvailable()
  }

  const sellerPublishedCameraHandler = (params) => {
    reset()
    if (!props.buyerEnteredStore) {
      dispatch(setIsOnCall(true))
      props.setBuyerEnteredStore(!props.buyerEnteredStore)
      CallService.identifyMySelf()
    }
    props.onCallStarted(params)
  }

  useEffect(() => {
    window.dataLayer.push({ event: 'optimize.activate' })
  }, [])

  const onSubmit = async ({ name }) => {
    setSubmitClicked(true)

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
      const onError = (error) => {
        addLog({
          event: 'CALL_FAILED',
          data: {
            storeId: store.id,
            username: name,
            error: JSON.stringify(error),
            userId: user.id,
            ...UtmUtils.getUtmObject(queryParams),
          },
        })
        dispatch(leaveCall())
        props.onCallFinished()
        setSubmitClicked(false)
      }

      addLog({
        event: 'BUYER_NAME_SETTED',
        data: {
          storeId: store.id,
          name,
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })

      CallService.on(CallServiceEvents.SELLER_PUBLISHED_CAMERA, sellerPublishedCameraHandler)

      CallService.on(CallServiceEvents.SELLER_HUNG_UP, props.onCallFinished)
      if (user.role === CustomerRoles.BUYER) {
        setUsername(name)
      }
      const [error, seller] = await to(CallService.getSeller(store.id))
      if (error || !seller.isAvailable) {
        console.log(error)
        dispatch(leaveCall())
        props.onCallFinished(EventLogs.SELLER_NOT_AVAILABLE)
        props.navigateToSellerNotAvailable()
        return
      }

      if (seller.isOffCall) start()

      const [errorRTM, joinRTM] = await to(dispatch(joinRTMChannel(seller.agoraChannelId)))
      if (errorRTM || !joinRTM) {
        onError(errorRTM)
        console.log(errorRTM)
        return
      }

      addLog({
        event: 'BUYER_CALLING',
        data: {
          storeId: store.id,
          username: name,
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })

      const { otherBuyers } = await CallService.getCallMembersCount()
      if (otherBuyers >= MAX_QUANTITY_OF_BUYERS || limitBuyers) {
        dispatch(leaveRTM())
        props.onCallFinished(EventLogs.MEETING_IS_FULL)
        dispatch(setMeetingIsFull(true))
        return
      }

      const [errorRTC, joinRTC] = await to(
        dispatch(joinRTCChannel({ channel: seller.agoraChannelId })),
      )
      if (!joinRTC) {
        onError(errorRTC)
        return
      }

      history.pushState(CallStates.IN_CALL_STATE, CallStates.IN_CALL_STATE)
      dispatch(changeCallState(CallStates.CALL_STARTED))

      addLog({
        event: 'CALL_INITIALIZED',
        data: {
          storeId: store.id,
          username: name,
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })
    }
  }

  return (
    <PhoneContainer data-test="login-screen-container">
      <LoadingLayout
        onSubmit={onSubmit}
        disabled={submitClicked}
        allowsMultipleBuyers={store.storeConfigurations.allowsMultipleBuyers}
        toggleMicrophone={props.toggleMicrophone}
        toggleCamera={props.toggleCamera}
      />
    </PhoneContainer>
  )
}

StoreLogin.propTypes = {
  onCallStarted: PropTypes.func.isRequired,
  onCallFinished: PropTypes.func.isRequired,
  setBuyerEnteredStore: PropTypes.func,
  navigateToSellerNotAvailable: PropTypes.func,
  buyerEnteredStore: PropTypes.bool,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
}
