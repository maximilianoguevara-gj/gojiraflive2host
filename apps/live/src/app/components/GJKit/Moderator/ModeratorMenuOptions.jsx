import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import ChatService from '../../../services/chatService'
import { Menu, MenuList, MenuItem, ListItemText } from '@material-ui/core'
import { Block, DeleteOutlineOutlined, Place, Reply, VolumeOff } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import {
  selectPinnedMessage,
  setBanUserDialogVisible,
  setCannotDeleteMessage,
  setQuotedMessage,
  setMuteUserDialogVisible,
  selectModeratorMenuMessage,
} from '../../../reducers/uiSlice'
import { StreamRoles } from '../../../constants/streamRoles'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useDeleteHandler } from 'stream-chat-react'
import { useAuth } from '@gojiraf/auth'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

export const ModeratorMenuOptions = ({ isDesktop = false, handleClick, channelId }) => {
  const { t } = useTranslation()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const [loading, setLoading] = useState(true)
  const [userIsBanned, setUserIsBanned] = useState(false)
  const [userIsOnline, setUserIsOnline] = useState(true)
  const {
    message,
    mousePosition: { left, top },
  } = useSelector(selectModeratorMenuMessage)
  const currentlyPinned = useSelector(selectPinnedMessage)
  const dispatch = useDispatch()
  const { setUserForBan, setUserForMute } = useAuth()
  const handleDelete = useDeleteHandler(message)
  const isPinnedMessage = message.pinned === true

  const handleReplyMessage = () => {
    dispatch(setQuotedMessage({ quotedMessage: message }))
    handleClick(false)
  }

  const handlePinMessage = async () => {
    if (!isPinnedMessage) {
      await ChatService.pinMessage(currentlyPinned, message)
    } else {
      await ChatService.unpinMessage(message)
    }

    handleClick(false)
  }

  const handleDeleteMessage = (e) => {
    handleClick(false)
    if (isPinnedMessage) {
      dispatch(setCannotDeleteMessage({ allowDelete: false }))
      return
    }
    handleDelete(e)
  }

  const handleMuteUser = (e) => {
    gaEventTracker('Moderator', 'menu-mute-chat-user')
    matomoTrackEvent('Moderator', 'menu-mute-chat-user')
    setUserForMute({ id: message.user.id, name: message.user.name, channelId })
    dispatch(setMuteUserDialogVisible(true))
    e.stopPropagation()
    handleClick(false)
  }

  const blockUser = (e) => {
    gaEventTracker('Moderator', 'menu-kick-user')
    matomoTrackEvent('Moderator', 'menu-kick-user')
    setUserForBan({ id: message.user.id, name: message.user.name })
    dispatch(setBanUserDialogVisible(true))
    e.stopPropagation()
    handleClick(false)
  }

  const handleClose = () => {
    handleClick(false)
  }

  const getMemberIsBanned = async () => {
    try {
      const member = await ChatService.queryMember({ userId: message.user.id, channelId })
      if (member) {
        setUserIsBanned(member.banned)
      } else {
        setUserIsOnline(false)
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    getMemberIsBanned()
  }, [])

  return (
    <StyledMenu
      left={left}
      top={top}
      isDesktop={isDesktop}
      open={!loading}
      onClose={handleClose}
      data-test={'moderator-dropdown-menu'}
    >
      <MenuListStyled isDesktop={isDesktop}>
        {message.user.role !== StreamRoles.ADMIN && (
          <MenuItemModified onClick={handleReplyMessage} data-test={'moderator-menu-reply-message'}>
            <Reply fontSize="small" />
            {isDesktop && <ListItemText>{t('moderatorMenu.replyMessage')}</ListItemText>}
          </MenuItemModified>
        )}
        <MenuItemModified onClick={handleDeleteMessage}>
          <DeleteOutlineOutlined fontSize="small" />
          {isDesktop && <ListItemText>{t('moderatorMenu.deleteMessage')}</ListItemText>}
        </MenuItemModified>
        <MenuItemModified onClick={handlePinMessage}>
          <Place fontSize="small" />
          {isDesktop && (
            <ListItemText>
              {isPinnedMessage ? t('moderatorMenu.unpinMessage') : t('moderatorMenu.pinMessage')}
            </ListItemText>
          )}
        </MenuItemModified>
        {message.user.role !== StreamRoles.ADMIN && (
          <MenuItemModified
            disabled={userIsBanned || !userIsOnline}
            onClick={handleMuteUser}
            data-test={'moderator-menu-block-user'}
          >
            <VolumeOff fontSize="small" />
            {isDesktop && <ListItemText>{t('moderatorMenu.muteUser')}</ListItemText>}
          </MenuItemModified>
        )}
        {message.user.role !== StreamRoles.ADMIN && (
          <MenuItemModified
            disabled={!userIsOnline}
            onClick={blockUser}
            data-test={'moderator-menu-block-user'}
          >
            <Block fontSize="small" />
            {isDesktop && <ListItemText>{t('moderatorMenu.blockUser')}</ListItemText>}
          </MenuItemModified>
        )}
      </MenuListStyled>
    </StyledMenu>
  )
}

const MenuListStyled = styled(MenuList)`
  ${({ isDesktop }) =>
    !isDesktop
      ? css`
          display: flex;
          flex-direction: row;
          padding: 0;
        `
      : ''}
`

const MenuItemModified = styled(MenuItem)`
  padding: 0 3px;
`

const StyledMenu = styled(Menu)`
  .MuiMenu-paper {
    top: ${({ top }) => `calc(${top}px - 8%)`} !important;
    left: ${({ left, isDesktop }) => (isDesktop ? `${left}px` : `calc(${left}px - 30%)`)}!important;
  }
`

ModeratorMenuOptions.propTypes = {
  handleClick: PropTypes.func.isRequired,
  channelId: PropTypes.string.isRequired,
  isDesktop: PropTypes.bool.isRequired,
}
