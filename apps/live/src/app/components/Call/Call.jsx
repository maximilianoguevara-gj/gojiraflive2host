import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useLogger } from '@gojiraf/logger'
import CallCard from '../callCard'
import { DesktopCard } from './DesktopCards/DesktopCard'
import { FlexContainer } from '../Kit/Container'
import { ChatDesktop } from '../Chat/ChatDesktop'
import {
  UI_IS_LAPTOP,
  selectUiSize,
  UI_IS_TABLET,
  selectAutoJoinChat,
} from '../../reducers/uiSlice'
import AskNameDialog from '../dialogs/AskNameDialog'
import { BanUserDialog } from '../dialogs/BanUserDialog'
import { CannotDeleteMessageDialog } from '../dialogs/CannotDeleteMessageDialog'
import { useBeforeunload } from 'react-beforeunload'
import { useCall } from '../../../state/CallContext'
import CallService from '../../services/callService'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { EventLogsEs } from '../../constants/eventLogsEs'
import { CustomerRoles } from '../../constants/customerRoles'
import { MuteUserDialog } from '../dialogs/MuteUserDialog'
import { ChatErrorDialog } from '../dialogs/ChatErrorDialog'
import { useAuth } from '@gojiraf/auth'
import { useViews } from 'state'
import { TermsAndConditions } from '../dialogs/TermsAndConditions'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { PayPalCheckoutDialog } from '../dialogs/PayPalCheckoutDialog'

const Container = styled(FlexContainer)`
  flex-direction: row;
  justify-content: center;
  align-items: ${({ isMobile }) => (isMobile ? 'start' : 'center')};
  width: 100%;
  height: 100vh;
  gap: 1em;
`

const Call = ({
  onCallFinished: onCallFinishCallback,
  setLoading,
  setDuration,
  setCallDuration,
  toggleMicrophone,
  toggleCamera,
}) => {
  const uiSize = useSelector(selectUiSize)
  const store = useSelector(selectCurrentStore)
  const {
    storeConfigurations: {
      features: { termsAndConditions },
    },
  } = store
  const autoJoinChat = useSelector(selectAutoJoinChat)
  const { secondsToFinishEvent } = store.storeConfigurations.features.finishEvent
  const { user } = useAuth()
  const { onCallStarted, onCallFinishedDuration, onCallFinished, state } = useCall()
  const { send: sendViews } = useViews()
  const isModerator = user.role === CustomerRoles.MODERATOR
  const { addLog } = useLogger()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()

  const { REACT_APP_DEFAULT_VIEW_MOBILE = 'SHOW_PRODUCTS' } = process.env

  useBeforeunload((event) => {
    event.preventDefault()
    handleCallFinished()
  })

  useEffect(() => {
    onCallStarted()
  }, [])

  useEffect(() => {
    if (uiSize === UI_IS_TABLET) {
      const view = autoJoinChat ? REACT_APP_DEFAULT_VIEW_MOBILE : 'SHOW_PRODUCTS'
      sendViews({ type: view })
    }
  }, [uiSize])

  useEffect(() => {
    CallService.setOnCallFinished(() => {
      handleCallFinished()
    })
  }, [state])

  const handleCallFinished = () => {
    if (state.endCall === null) {
      gaEventTracker('InCall', 'close-browser-and-exit-event')
      matomoTrackEvent('InCall', 'close-browser-and-exit-event')
      const callDuration = onCallFinishedDuration()
      const duration = onCallFinished()
      setDuration(duration)
      setCallDuration(callDuration)

      addLog({
        event: 'CALL_FINISHED',
        data: {
          data: {
            eventType: EventLogsEs.CALL_FINISHED,
            userId: user.id ?? EventLogsEs.ANONIMO_WEB,
            storeId: store.id,
            duration,
            callDuration,
            storeName: store.name,
            companyName: store.company.name,
          },
        },
      })
    }
  }

  return (
    <Container isMobile={uiSize === UI_IS_TABLET}>
      {uiSize === UI_IS_LAPTOP ? (
        <ChatDesktop toggleMicrophone={toggleMicrophone} toggleCamera={toggleCamera} />
      ) : null}
      <CallCard
        onCallFinished={onCallFinishCallback}
        setLoading={setLoading}
        toggleMicrophone={toggleMicrophone}
        toggleCamera={toggleCamera}
        secondsToFinishEvent={secondsToFinishEvent}
      />
      <TermsAndConditions
        customTermsAndConditions={termsAndConditions}
        onCallFinished={onCallFinishCallback}
      />
      <AskNameDialog />
      <BanUserDialog />
      <MuteUserDialog />
      <PayPalCheckoutDialog />
      <CannotDeleteMessageDialog />
      <ChatErrorDialog />
      {uiSize === UI_IS_LAPTOP ? (
        <DesktopCard isModerator={isModerator} onCallFinished={onCallFinishCallback} />
      ) : null}
    </Container>
  )
}

Call.propTypes = {
  onCallFinished: PropTypes.func,
  setLoading: PropTypes.func,
  setCallDuration: PropTypes.func,
  setDuration: PropTypes.func,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
}

export { Call }
