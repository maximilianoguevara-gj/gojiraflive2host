import React from 'react'
import styled from 'styled-components'
import { Button as MuiButton } from '@material-ui/core'

const StyledButton = styled(MuiButton)`
  display: ${({ display }) => (display ? display : 'block')};
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  text-transform: ${({ textTransform }) => (textTransform ? textTransform : 'uppercase')};
  font-size: ${({ goToCart }) => (goToCart ? '0.625rem' : '0.75rem')};
  letter-spacing: ${({ letterSpacing }) => (letterSpacing ? letterSpacing : '0.188rem')};
  line-height: 1rem;
  font-weight: ${({ variant, goToCart }) => (variant ? 600 : goToCart ? 500 : 400)};
  padding: ${({ padding }) => (padding ? padding : '1em 2.5em')};
  border-radius: ${({ variant }) => (variant ? 'calc(1rem + 1em)' : 0)};
  background-color: ${({ backgroundColor }) => backgroundColor};
  &:hover {
    background-color: ${({ backgroundColor }) => backgroundColor};
  }
`

export const Button = ({ ...props }) => {
  return <StyledButton color="primary" {...props} />
}
