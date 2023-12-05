import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Camera } from './Camera'
import { Microphone } from './Microphone'
import { SwitchCamera } from './SwitchCamera'

const Container = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const LocalMediaControls = ({
  toggleMicrophone,
  toggleCamera,
  isCohostUser = false,
  isMobile = false,
}) => {
  return (
    <Container>
      <Camera toggleCamera={toggleCamera} />
      <Microphone toggleMicrophone={toggleMicrophone} />
      {isCohostUser && isMobile ? <SwitchCamera /> : null}
    </Container>
  )
}
LocalMediaControls.propTypes = {
  isCohostUser: PropTypes.bool,
  isMobile: PropTypes.bool,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
}

export { LocalMediaControls }
