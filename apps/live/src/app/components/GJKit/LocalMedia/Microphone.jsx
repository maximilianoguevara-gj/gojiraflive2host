import React from 'react'
import PropTypes from 'prop-types'

import { MicNone, MicOff } from '@material-ui/icons'

import { RoundedButton } from '../../Kit/Buttons'
import Circle from './LocalMediaControlsCircle'
import { selectLocalMicrophoneEnabled } from '../../../reducers/callSlice'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Microphone = ({ toggleMicrophone }) => {
  const enabled = useSelector(selectLocalMicrophoneEnabled)

  return (
    <RoundedButton filled onClick={toggleMicrophone} data-test="toggle-microphone-button">
      {enabled ? <MicNone /> : <MicOff color="error" />}
    </RoundedButton>
  )
}

const MicrophoneWithBorder = ({ audioEnabled, toggleMicrophone }) => {
  return (
    <StyledCircle audioEnabled={audioEnabled}>
      <Microphone toggleMicrophone={toggleMicrophone} />
    </StyledCircle>
  )
}

const StyledCircle = styled(Circle)`
  border: ${({ audioEnabled }) =>
    audioEnabled ? '2px solid rgb(80,85,92)' : '2px solid rgb(255,0,0)'};
`

Microphone.propTypes = {
  toggleMicrophone: PropTypes.func,
}

MicrophoneWithBorder.propTypes = {
  audioEnabled: PropTypes.bool.required,
  toggleMicrophone: PropTypes.func,
}
export { Microphone, MicrophoneWithBorder }
