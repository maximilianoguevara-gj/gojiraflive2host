import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { device } from '../../../constants/devices'
import { IconButton } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import { setModeratorMenuMessage, setMousePosition } from '../../../reducers/uiSlice'
import { useDispatch } from 'react-redux'

export function ModeratorMenu({ message, marginRight, handleClick }) {
  const dispatch = useDispatch()
  const handleIconButton = (e) => {
    dispatch(setMousePosition({ left: e.clientX, top: e.clientY }))
    dispatch(setModeratorMenuMessage(message))
    handleClick(true)
  }

  return (
    <IconButtonContainer marginRight={marginRight}>
      <IconButtonStyled
        size="small"
        onClick={handleIconButton}
        data-test={'moderator-dot-menu-button'}
      >
        <StyledMoreVert />
      </IconButtonStyled>
    </IconButtonContainer>
  )
}

const IconButtonContainer = styled.div`
  position: absolute;
  right: ${({ marginRight }) => (marginRight ? `${marginRight}px` : '0')};
  align-self: center;
`

const IconButtonStyled = styled(IconButton)`
  background-color: rgba(200, 200, 200, 1);
  margin-right: 1.5rem;
  align-self: center;
  @media ${device.laptop} {
    background-color: rgba(229, 229, 229, 1);
    margin-right: 0;
    align-self: auto;
  }
  &:hover {
    background-color: rgba(229, 229, 229, 1);
  }
`

const StyledMoreVert = styled(MoreVert)`
  color: black;
`
ModeratorMenu.propTypes = {
  message: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  marginRight: PropTypes.number,
}
