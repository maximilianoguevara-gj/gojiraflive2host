import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { RoundedButton as MuiButton } from '../../Kit/Buttons/RoundedButton'

const StyledButton = styled(MuiButton)`
  background-color: rgb(0, 0, 0, 0.5);

  &:hover {
    background-color: rgb(0, 0, 0, 0.6);
  }
`

export const TopNavBarButton = ({ children, onClick, ...props }) => {
  return (
    <StyledButton color="secondary" onClick={onClick} {...props}>
      {children}
    </StyledButton>
  )
}

TopNavBarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element,
}
