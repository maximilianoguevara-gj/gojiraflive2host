import React, { useEffect, useState } from 'react'
import { useLogger } from '@gojiraf/logger'
import { useAuth } from '@gojiraf/auth'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectStoreError,
  setSellerVideoTrack,
  selectSellerVideoTrack,
} from '../reducers/storeSlice'
import {
  changeCallState,
  selectLocalCameraTrack,
  selectPermissionState,
  setIsOnCall,
  setMobileChatConnected,
  setSellerNetworkError,
} from '../reducers/callSlice'
import StoreLogin from '../components/storeLogin'
import StoreNotFound from './storeNotFound'
import { Call } from '../components/Call/Call'
import StoreUtils from '../utils/storeUtils'
import homeStyles from '../styles/home.styles'
import qs from 'qs'
import UtmUtils from '../utils/utmUtils'
import { EventLogs } from '../constants/eventLogs'
import { EventLogsEs } from '../constants/eventLogsEs'
import HangUpCallDialog from '../components/dialogs/hangUpCallDialog'
import PermissionsPendingDialog from '../components/dialogs/PermissionsPendingDialog'
import { FlexContainer } from '../components/Kit/Container'
import { PermissionStates } from '../constants/permissionStates'
import { GJLogo, LiveShopping } from '../components/GJKit/newGJLogo'
import { selectMainVideo, selectUiSize, setShowStoreInfo, UI_IS_TABLET } from '../reducers/uiSlice'
import { CallProvider } from '../../state/CallContext'
import { CallStates } from '../constants/callStates'
import { useNavigate } from 'react-router-dom'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const useStyles = makeStyles((theme) => homeStyles(theme))
export default function OneToOneLayout({
  store,
  toggleMicrophone,
  closeMicrophone,
  toggleCamera,
  closeCamera,
  navigateToSellerNotAvailable,
}) {
  const dispatch = useDispatch()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const [loading, setLoading] = useState(false)
  const [callStarted, setCallStarted] = useState(false)
  const uiSize = useSelector(selectUiSize)
  const storeError = useSelector(selectStoreError)
  const classes = useStyles()
  const { user } = useAuth()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const [isCallFinishedDialogOpen, setIsCallFinishedDialogOpen] = useState(false)
  const [buyerEngagementHandler, setBuyerEngagementHandler] = useState()
  const permissionState = useSelector(selectPermissionState)
  const [permissionDialogClosed, setPermissionDialogClosed] = useState(false)
  const [timeoutPassed, setTimeoutPassed] = useState(false)
  const mainVideo = useSelector(selectMainVideo)
  const sellerVideoTrack = useSelector(selectSellerVideoTrack)
  const buyerVideoTrack = useSelector(selectLocalCameraTrack)
  const [buyerEnteredStore, setBuyerEnteredStore] = useState(false)
  const [duration, setDuration] = useState(null)
  const [callDuration, setCallDuration] = useState(null)
  const { addLog } = useLogger()
  const navigate = useNavigate()
  const { backgroundUrlMobile = null, backgroundUrl } = store
  const isMobile = uiSize === UI_IS_TABLET

  useEffect(() => {
    let timeoutId

    if (callStarted && !timeoutId) {
      timeoutId = setTimeout(() => {
        setTimeoutPassed(true)
      }, 5000)
    }

    return () => timeoutId && clearTimeout(timeoutId)
  }, [callStarted])

  const getMainContent = () => {
    if (loading) {
      return (
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <div className={classes.loader__fullheight}>
            <LiveShopping />
            <GJLogo />
          </div>
        </Grid>
      )
    } else {
      if (storeError) {
        return <StoreNotFound />
      }
      if (callStarted) {
        return (
          <>
            <CallProvider>
              <Call
                onCallFinished={onCallFinished}
                setLoading={setLoading}
                setDuration={setDuration}
                setCallDuration={setCallDuration}
                toggleMicrophone={toggleMicrophone}
                toggleCamera={toggleCamera}
              />
            </CallProvider>
            <PermissionsPendingDialog
              isOpen={
                !permissionDialogClosed &&
                permissionState == PermissionStates.PENDING &&
                timeoutPassed
              }
              onClose={() => setPermissionDialogClosed(true)}
            />
          </>
        )
      } else {
        return (
          <>
            <StoreLogin
              onCallStarted={onCallStarted}
              onCallFinished={onCallFinished}
              setBuyerEnteredStore={setBuyerEnteredStore}
              navigateToSellerNotAvailable={navigateToSellerNotAvailable}
              buyerEnteredStore={buyerEnteredStore}
              toggleMicrophone={toggleMicrophone}
              toggleCamera={toggleCamera}
            />
            <HangUpCallDialog
              onClose={() => setIsCallFinishedDialogOpen(false)}
              isOpen={isCallFinishedDialogOpen}
              isOneToMany={store.isOneToManySale}
            />
          </>
        )
      }
    }
  }

  const onCallStarted = (videoController) => {
    setCallStarted(true)
    setVideoTrack(videoController)
    dispatchCallEngagementEvent()
    dispatch(setSellerVideoTrack({ sellerVideoTrack: videoController }))
    dispatch(setShowStoreInfo({ showStoreInfo: true }))
  }

  const setVideoTrack = (videoController) => {
    videoController.play('video__streaming', { fit: 'cover' })
  }
  useEffect(() => {
    if (mainVideo && sellerVideoTrack !== undefined) {
      setVideoTrack(sellerVideoTrack)
    } else if (buyerVideoTrack) {
      setVideoTrack(buyerVideoTrack)
    }
  }, [mainVideo])

  const dispatchCallEngagementEvent = () => {
    const timer = setTimeout(() => {
      addLog({
        event: 'BUYER_CALL_ENGAGEMENT',
        data: {
          userId: user.id ?? EventLogsEs.ANONIMO_WEB,
          storeId: store.id,
          storeName: store.name,
          companyName: store.company.name,
          flow: 'OTO',
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
    setLoading(false)
    setCallStarted(false)
    clearTimeout(buyerEngagementHandler)
    dispatchFinishEvent(event)
    showDialogsByEvent(event)
    dispatch(setShowStoreInfo({ showStoreInfo: false }))
    setTimeout(() => {
      closeMicrophone()
      closeCamera()
    }, 1000)
    if (event === EventLogs.SELLER_HANG_UP_ALL) {
      gaEventTracker('InCall', `end-call-OTO-OTF [${store?.id}]`)
      matomoTrackEvent('InCall', `end-call-OTO-OTF [${store?.id}]`)
      navigate(`/store/${store.id}/form`)
    }
  }

  const showDialogsByEvent = (event) => {
    switch (event) {
      case EventLogs.SELLER_HANG_UP_ALL:
      case EventLogs.SELLER_HANG_UP_BUYER:
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
          userId: user.id ?? EventLogsEs.ANONIMO_WEB,
          storeId: store.id,
          ...UtmUtils.getUtmObject(queryParams),
          duration,
          callDuration,
        },
      })
    } else {
      addLog({
        event: 'USER_HANG_UP',
        data: {
          userId: user.id ?? EventLogsEs.ANONIMO_WEB,
          storeId: store.id,
          ...UtmUtils.getUtmObject(queryParams),
          duration,
          callDuration,
          storeName: store.name,
          companyName: store.company.name,
        },
      })
    }
  }

  return (
    <CallHomeContainer
      isMobile={isMobile}
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

OneToOneLayout.propTypes = {
  store: PropTypes.object,
  closeMicrophone: PropTypes.func,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
  closeCamera: PropTypes.func,
  navigateToSellerNotAvailable: PropTypes.func,
}

export const CallHomeContainer = styled(FlexContainer)`
  height: 100vh;
  justify-content: ${({ isMobile }) => (isMobile ? 'start' : 'center')};
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`
