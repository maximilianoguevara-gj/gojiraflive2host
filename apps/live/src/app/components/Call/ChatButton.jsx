import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useViews } from 'state'
import { ChatBubble, ChatBubbleOutline } from '@material-ui/icons'
import { RoundedButton } from '../Kit/Buttons'
import { ButtonBubble } from './ButtonBubble'
import {
  selectMobileChatConnected,
  selectMessagesCount,
  setMessagesCount,
  setMobileChatConnected,
} from '../../reducers/callSlice'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

export const ChatButton = ({ initChat }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const dispatch = useDispatch()
  const connected = useSelector(selectMobileChatConnected)
  const { state, send } = useViews()
  const messagesCount = useSelector(selectMessagesCount)

  const openChat = () => {
    gaEventTracker('InCall', 'toggle-chat-button')
    matomoTrackEvent('InCall', 'toggle-chat-button')
    send({
      type: 'SHOW_CHAT',
    })
    dispatch(setMessagesCount(0))
    if (!connected) {
      initChat()
      gaEventTracker('InCall > Chat', 'click-button-enabled-chat-m')
      matomoTrackEvent('InCall > Chat', 'click-button-enabled-chat-m')
      dispatch(setMobileChatConnected(true))
    }
  }

  const ChatIcon = () =>
    state.matches('secondary.showingChat') === true ? <ChatBubble /> : <ChatBubbleOutline />

  return (
    <RoundedButton
      color="secondary"
      onClick={openChat}
      id="toggle-chat-button"
      data-test="toggle-chat-button"
    >
      {messagesCount && state.matches('secondary.showingChat') !== true ? (
        <ButtonBubble badgeContent={messagesCount} color="error">
          <ChatIcon />
        </ButtonBubble>
      ) : (
        <ChatIcon />
      )}
    </RoundedButton>
  )
}

ChatButton.propTypes = {
  initChat: PropTypes.func,
}
