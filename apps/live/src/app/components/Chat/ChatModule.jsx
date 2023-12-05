import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MessageInput, Window, Thread, Channel, Chat } from 'stream-chat-react'
import { Messages } from './Messages'
import { ChatInput } from './ChatInput'
import { ChatHeader } from './ChatHeader'
import { selectUserCount, setMessagesCount } from '../../reducers/callSlice'
import { useDispatch, useSelector } from 'react-redux'
import { CustomerRoles } from '../../constants/customerRoles'
import { ChatContainer, Container } from './style'
import { ScrollToBottom } from './buttons/ScrollToBottom'
import { CircularProgress } from '@material-ui/core'
import { selectAutoJoinChat } from '../../reducers/uiSlice'
import { AskJoinChat } from './AskJoinChat'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

export const ChatModule = ({ isDesktop = false, chatData, initChat, user }) => {
  const { chatClient, chatChannel } = chatData
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const dispatch = useDispatch()
  const autoJoinChat = useSelector(selectAutoJoinChat)
  const [loading, setLoading] = useState(true)
  const usersCount = useSelector(selectUserCount)
  const isModerator = user.role === CustomerRoles.MODERATOR

  useEffect(() => {
    if (!autoJoinChat && isDesktop) setLoading(false)
    return () => {
      dispatch(setMessagesCount(0))
    }
  }, [])

  const handleClick = () => {
    gaEventTracker('InCall > Chat', 'click-button-enabled-chat-d')
    matomoTrackEvent('InCall > Chat', 'click-button-enabled-chat-d')
    setLoading(true)
    initChat()
  }

  return (
    <ChatContainer isDesktop={isDesktop} isLoading={!chatClient} data-test="chat-container">
      {isDesktop === true && <ChatHeader isModerator={isModerator} usersCount={usersCount} />}
      {!chatClient ? (
        <Container>
          {loading ? (
            <CircularProgress color={isDesktop ? 'primary' : 'secondary'} />
          ) : (
            <AskJoinChat handleClick={handleClick} />
          )}
        </Container>
      ) : (
        <>
          <Chat client={chatClient}>
            <Channel
              MessageNotification={ScrollToBottom}
              channel={chatChannel}
              EmptyStateIndicator="thread"
              TypingIndicator={() => null}
            >
              <Window>
                <Messages isDesktop={isDesktop} user={user} channelId={chatChannel.id} />
                <MessageInput Input={() => null} />
              </Window>
              <Thread />
            </Channel>
          </Chat>
          <ChatInput isDesktop={isDesktop} channelId={chatChannel.id} />
        </>
      )}
    </ChatContainer>
  )
}

ChatModule.propTypes = {
  isDesktop: PropTypes.bool,
  chatData: PropTypes.object.isRequired,
  initChat: PropTypes.func,
  user: PropTypes.object.isRequired,
}
