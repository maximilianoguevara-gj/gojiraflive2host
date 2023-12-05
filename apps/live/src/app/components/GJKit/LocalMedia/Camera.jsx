import React from 'react'
import PropTypes from 'prop-types'

import { VideocamOutlined, VideocamOffOutlined } from '@material-ui/icons'

import { RoundedButton } from '../../Kit/Buttons'
import { useDispatch } from 'react-redux'
import { selectMainVideo, setChangeMainVideo } from '../../../reducers/uiSlice'
import { useSelector } from 'react-redux'
import Circle from './LocalMediaControlsCircle'
import { selectLocalCameraEnabled } from '../../../reducers/callSlice'

const Camera = ({ toggleCamera }) => {
  const enabled = useSelector(selectLocalCameraEnabled)

  const dispatch = useDispatch()
  const mainVideo = useSelector(selectMainVideo)
  const handleClick = () => {
    if (!mainVideo) {
      dispatch(setChangeMainVideo({ changeMainVideo: enabled }))
    }
    toggleCamera()
  }

  return (
    <RoundedButton filled onClick={handleClick} data-test="toggle-camera-button">
      {enabled ? <VideocamOutlined /> : <VideocamOffOutlined color="error" />}
    </RoundedButton>
  )
}

const CameraWithBorder = ({ videoEnabled, toggleCamera }) => {
  return (
    <Circle
      style={{
        border: videoEnabled ? '2px solid rgb(80,85,92)' : '2px solid rgb(255,0,0)',
      }}
    >
      <Camera toggleCamera={toggleCamera} />
    </Circle>
  )
}

CameraWithBorder.propTypes = {
  videoEnabled: PropTypes.bool.required,
  toggleCamera: PropTypes.func,
}

Camera.propTypes = {
  toggleCamera: PropTypes.func,
}
export { Camera, CameraWithBorder }
