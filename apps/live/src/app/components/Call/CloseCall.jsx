import React from 'react'
import PropTypes from 'prop-types'
import { TopNavBarButton } from '../GJKit/Buttons/TopNavBarButton'
import { useDispatch, useSelector } from 'react-redux'
import { leaveCall } from '../../reducers/callSlice'
import { EventLogs } from '../../constants/eventLogs'
import { CloseCallDialog } from '../dialogs/CloseCallDialog'
import { selectOnCloseMessageCall } from '../../reducers/uiSlice'
import { useLocalCamera } from '../../hooks/useLocalCamera'
import { useLocalMicrophone } from '../../hooks/useLocalMicrophone'
import { usePIP } from '../../hooks/usePIP'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { Close } from '@material-ui/icons'

const CloseCall = ({ onCallFinished }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { closeMicrophone } = useLocalMicrophone()
  const { closeCamera } = useLocalCamera()
  const dispatch = useDispatch()
  const closeCallMessageIsVisible = useSelector(selectOnCloseMessageCall)
  const { closePIP } = usePIP()

  const handleOnCloseCall = () => {
    gaEventTracker('InCall', 'close-call-button')
    matomoTrackEvent('InCall', 'close-call-button')
    history.back()
  }

  const handleOnCloseConfirmed = () => {
    gaEventTracker('InCall', 'close-call-confirm-button')
    matomoTrackEvent('InCall', 'close-call-confirm-button')
    closeMicrophone()
    closeCamera()
    dispatch(leaveCall())
    onCallFinished(EventLogs.USER_HANG_UP)
    closePIP()
  }

  return (
    <div>
      <TopNavBarButton id="close-call-button" data-test="close-call" onClick={handleOnCloseCall}>
        <Close />
      </TopNavBarButton>
      {closeCallMessageIsVisible && <CloseCallDialog onClose={handleOnCloseConfirmed} />}
    </div>
  )
}

CloseCall.propTypes = {
  onCallFinished: PropTypes.func.isRequired,
}

export { CloseCall }
