import React from 'react'
import PropTypes from 'prop-types'
import { Message, PinMessage, PinnedMessageContainer, Username, ModeratorIcon } from '../style'
import MessageWithLink from './MessageWithLink'
import PushPinIcon from '@mui/icons-material/PushPin'
import { ModeratorMenu } from '../../GJKit/Moderator/ModeratorMenu'
import { useModeratorMenu } from '../../../hooks/useModeratorMenu'

export const PinnedMessage = ({ isDesktop, user, handleShowModeratorMenu, message }) => {
  const {
    showModeratorMenu,
    onMouseOver,
    onMouseLeave,
    ref,
    parentStyles: { height, marginRight },
  } = useModeratorMenu(user)

  return (
    <PinMessage maxHeight={height} ref={ref} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <PinnedMessageContainer>
        <span>
          <ModeratorIcon isPin />
        </span>
        {isDesktop ? (
          <PushPinIcon fontSize="inherit" />
        ) : (
          <PushPinIcon fontSize="inherit" style={{ color: 'white' }} />
        )}
        <Username isDesktop={isDesktop} data-test="username-inner-chat">
          {message.user.name}:
        </Username>
        <MessageWithLink isDesktop={isDesktop}>
          <Message isDesktop={isDesktop} data-test="user-message">
            {message.text}
          </Message>
        </MessageWithLink>
      </PinnedMessageContainer>
      {showModeratorMenu && (
        <ModeratorMenu
          marginRight={marginRight}
          message={message}
          handleClick={handleShowModeratorMenu}
        />
      )}
    </PinMessage>
  )
}

PinnedMessage.propTypes = {
  isDesktop: PropTypes.bool,
  user: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  handleShowModeratorMenu: PropTypes.func.isRequired,
}
