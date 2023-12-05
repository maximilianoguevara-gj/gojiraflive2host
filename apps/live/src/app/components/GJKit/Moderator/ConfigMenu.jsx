import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Actions } from './ConfigComponents/Actions'
import { Header } from './ConfigComponents/Header'

export const ConfigMenu = ({ dispatchFinishCountdown, dispatchStartCountdown, dispatchPopUp }) => {
  return (
    <Container>
      <Header></Header>
      <Actions
        dispatchStartCountdown={dispatchStartCountdown}
        dispatchFinishCountdown={dispatchFinishCountdown}
        dispatchPopUp={dispatchPopUp}
      ></Actions>
    </Container>
  )
}

const Container = styled.div`
  background-color: rgba(242, 242, 242, 1);
  border-radius: 8px;
`
ConfigMenu.propTypes = {
  dispatchFinishCountdown: PropTypes.func.isRequired,
  dispatchStartCountdown: PropTypes.func.isRequired,
  dispatchPopUp: PropTypes.func.isRequired,
}
