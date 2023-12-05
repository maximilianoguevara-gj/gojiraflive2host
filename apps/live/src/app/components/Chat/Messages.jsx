import React, { useEffect, useRef, useState } from 'react'
import { useChannelStateContext, VirtualizedMessageList } from 'stream-chat-react'
import { MessagesContainer } from './style'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { selectPinnedMessage } from '../../reducers/uiSlice'
import { ChatMessage } from './ChatMessage'
import { PinnedMessage } from './messages/PinnedMessage'
import { ModeratorMenuOptions } from '../GJKit/Moderator/ModeratorMenuOptions'
import { useModeratorMenu } from '../../hooks/useModeratorMenu'

const Messages = ({ isDesktop = false, user, channelId }) => {
  const ref = useRef(null)
  const offsetTop = ref?.current?.offsetTop
  const [hidescroll, setHideScroll] = useState(isDesktop)
  const pinnedMessage = useSelector(selectPinnedMessage)
  const { messages } = useChannelStateContext()
  const { showMenuOptions, handleShowModeratorMenu, onMouseOver, onMouseLeave } =
    useModeratorMenu(user)

  useEffect(() => {
    if (isDesktop && hidescroll && offsetTop <= 73) setHideScroll(false)
  }, [messages])

  return (
    <MessagesContainer
      isDesktop={isDesktop}
      ref={ref}
      hidescroll={hidescroll}
      data-test="messages-container"
    >
      <VirtualizedMessageList
        Message={() =>
          ChatMessage({
            isDesktop,
            onMouseOver,
            onMouseLeave,
            user,
            handleShowModeratorMenu,
          })
        }
      />
      {pinnedMessage && (
        <PinnedMessage
          message={pinnedMessage}
          user={user}
          handleShowModeratorMenu={handleShowModeratorMenu}
          isDesktop={isDesktop}
        />
      )}

      {showMenuOptions && (
        <ModeratorMenuOptions
          isDesktop={isDesktop}
          handleClick={handleShowModeratorMenu}
          channelId={channelId}
        />
      )}
    </MessagesContainer>
  )
}

Messages.propTypes = {
  isDesktop: PropTypes.bool,
  user: PropTypes.object.isRequired,
  channelId: PropTypes.string.isRequired,
}

export { Messages }
