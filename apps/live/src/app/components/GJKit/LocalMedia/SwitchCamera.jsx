import React from 'react'
import { useLocalCamera } from '../../../hooks/useLocalCamera'
import { RoundedButton } from '../../Kit/Buttons'
import { SwitchCamera as SwitchCameraIcon } from '@material-ui/icons'

const SwitchCamera = () => {
  const { switchCamera, enabled: isVideoOn } = useLocalCamera()

  return (
    <RoundedButton
      filled
      onClick={switchCamera}
      disabled={!isVideoOn}
      data-test="switch-camera-button"
    >
      <SwitchCameraIcon />
    </RoundedButton>
  )
}

export { SwitchCamera }
