import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '../Kit/Buttons/Button'
import { WhatsApp as WhatsAppIcon } from '@material-ui/icons'

export const CustomButton = ({ children, onClick, isWhatsApp }) => (
  <StyledButton
    variant="contained"
    startIcon={isWhatsApp ? <WhatsAppIcon fontSize="small" /> : null}
    onClick={onClick}
    data-test="custom-button"
    isWhatsApp={isWhatsApp}
  >
    {children}
  </StyledButton>
)

const StyledButton = styled(Button)`
  display: inline-flex;
  background-color: ${({ isWhatsApp }) => (isWhatsApp ? 'rgba(100, 177, 97, 1)' : '#000000')};
  color: white;
  margin-top: 0;
  &:hover {
    background-color: ${({ isWhatsApp }) => (isWhatsApp ? 'rgba(100, 177, 97, 1)' : '#000000')};
  }
`

CustomButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
  isWhatsApp: PropTypes,
}
