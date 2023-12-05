import React, { useState } from 'react'
import styled from 'styled-components'
import { IconButton, Menu, Fade } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareButton from './ShareButton'
import { useViews } from 'state'

const MobileIconsMenu = () => {
  const { state, send: sendViews } = useViews()

  const [lastView, setLastView] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const viewType = {
    showingChat: 'SHOW_CHAT',
    showingParticipants: 'SHOW_PARTICIPANTS',
    showingProducts: 'SHOW_PRODUCTS',
  }

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
    setLastView(state.value.secondary)
    sendViews({
      type: 'SHOW_EMPTY',
    })
  }
  const handleClose = () => {
    setAnchorEl(null)
    sendViews({
      type: viewType[lastView],
    })
  }

  return (
    <>
      <IconButton
        aria-label="iconsMenu"
        id="iconsMenu-button"
        aria-controls={open ? 'iconsMenu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ padding: '3px' }}
      >
        <MoreVertIcon sx={{ color: '#fff' }} />
      </IconButton>
      <Menu
        id="iconsMenu"
        MenuListProps={{
          'aria-labelledby': 'iconsMenu',
          style: {
            width: '41px',
            height: '121px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{
          style: {
            elevation: 0,
            width: '41px',
            height: '131px',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            marginLeft: '5px',
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItemStyled onClick={handleClose}>
          <ShareButton />
        </MenuItemStyled>
      </Menu>
    </>
  )
}

const MenuItemStyled = styled.li`
  padding: 0;
  background-color: transparent;
  :hover {
    background-color: transparent;
  }
`

export { MobileIconsMenu }
