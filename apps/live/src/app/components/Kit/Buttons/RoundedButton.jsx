import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { IconButton } from '@material-ui/core'

const CustomIconButton = styled(IconButton)`
  ${({ filled }) =>
    filled
      ? css`
          background-color: white;

          &:hover {
            background-color: white;
          }
        `
      : ''}
  background-color: ${({ ismobilemenu }) => (ismobilemenu ? 'rgba(255, 255, 255, 0.1)' : '')};
  box-shadow: ${({ ismobilemenu }) => (ismobilemenu ? '0.5px 2px 5px 0 rgba(0,0,0,0.4)' : '')};
  padding: ${({ ismobilemenu }) => (ismobilemenu ? '5px' : '3px')};
`

const RoundedButton = ({ filled, isMobileMenu, ...props }) => {
  return (
    <CustomIconButton
      size="small"
      color="error"
      filled={filled}
      ismobilemenu={isMobileMenu}
      {...props}
    />
  )
}

RoundedButton.propTypes = {
  filled: PropTypes.bool,
  isMobileMenu: PropTypes.bool,
}

export { RoundedButton }
