import React from 'react'
import PropTypes from 'prop-types'
import { useMessageContext } from 'stream-chat-react'
import { MessagesListItem } from './style'
import { CommonMessage } from './messages/CommonMessage'
import { RepliedMessage } from './messages/RepliedMessage'
import { setPinnedMessage } from '../../reducers/uiSlice'
import { useDispatch } from 'react-redux'
import { StreamRoles } from '../../constants/streamRoles'
import { ModeratorMenu } from '../GJKit/Moderator/ModeratorMenu'
import { useModeratorMenu } from '../../hooks/useModeratorMenu'

export const ChatMessage = ({ isDesktop, user, handleShowModeratorMenu }) => {
  const { showModeratorMenu, onMouseOver, onMouseLeave } = useModeratorMenu(user)
  const dispatch = useDispatch()
  const { message } = useMessageContext()

  const showMessage = message.type !== 'deleted' || message.user.id === user.id

  const renderMessage = (message) => {
    const isModerator = message.user.role == StreamRoles.ADMIN

    if (message.pinned) dispatch(setPinnedMessage(message))

    if (message.quoted_message) return <RepliedMessage message={message} isDesktop={isDesktop} />

    return <CommonMessage message={message} isDesktop={isDesktop} isModerator={isModerator} />
  }

  return (
    <>
      {showMessage ? (
        <MessagesListItem onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
          {renderMessage(message)}
          {showModeratorMenu && (
            <ModeratorMenu message={message} handleClick={handleShowModeratorMenu} />
          )}
        </MessagesListItem>
      ) : null}
    </>
  )
}

ChatMessage.propTypes = {
  isDesktop: PropTypes.bool,
  user: PropTypes.object.isRequired,
  handleShowModeratorMenu: PropTypes.func.isRequired,
}
