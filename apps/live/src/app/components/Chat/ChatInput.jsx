import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '@gojiraf/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  CancelButton,
  Container,
  InputContainer,
  QuotedMessagePreview,
  SendButton,
  Input,
} from './ChatInput.styles'
import {
  checkForSpam,
  clearQuotedMessage,
  disableChatInput,
  selectChatDisabled,
  selectChatMuted,
  selectQuotedMessage,
  spamControlEnable,
  SPAM_REENABLE_TIME,
} from '../../reducers/uiSlice'
import { setShowAskNameDialog } from '../../reducers/uiSlice'
import { CustomerRoles } from '../../constants/customerRoles'
import { selectCurrentStore } from '../../reducers/storeSlice'
import ChatService from '../../services/chatService'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'
import { DefaultBuyerName } from '@gojiraf/auth'
import { useViews } from 'state'

const MAX_CHARS = 90
const MAX_CHARS_MODERATOR = 200

const ChatInput = ({ isDesktop = false, channelId }) => {
  const { t } = useTranslation()
  const { gaEventTracker } = useGoogleAnalytics()
  const { sendEventPostToElastic } = useElasticEventTracker()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const [text, setText] = useState(null)
  const [sendFirstMessage, setSendFirstMessage] = useState(false)
  const inputRef = useRef(null)
  const [timeoutId, setTimeoutId] = useState(null)
  const dispatch = useDispatch()
  const { id: storeId } = useSelector(selectCurrentStore)
  const chatSpamDisabled = useSelector(selectChatDisabled)
  const chatMuted = useSelector(selectChatMuted)
  const quotedMessage = useSelector(selectQuotedMessage)
  const { user } = useAuth()
  const { send: sendViews } = useViews()
  const maxLengthMessage = user.role === CustomerRoles.MODERATOR ? MAX_CHARS_MODERATOR : MAX_CHARS

  const handleInput = (e) => {
    if ((user.name === DefaultBuyerName || user.name === 'Anónimo') && !chatMuted) {
      e.currentTarget.blur()
      if (isDesktop) {
        dispatch(setShowAskNameDialog({ showAskNameDialog: true }))
      } else {
        sendViews({ type: 'SHOW_JOIN_CHAT' })
      }
    }
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const isValidMessage = (message) => {
    if (!/\S/.test(message) || message.length < 1) {
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!sendFirstMessage) {
      gaEventTracker('InCall > Chat', 'user-initialized-chat')
      sendEventPostToElastic('user-initialized-chat')
      matomoTrackEvent('InCall > Chat', 'user-initialized-chat')
      setSendFirstMessage(true)
    }
    inputRef.current.focus()
    if (!isValidMessage(text)) return
    dispatch(checkForSpam())
    setText('')
    await ChatService.sendMessageToChat({
      quotedMessage,
      channelId,
      message: text,
    })
  }

  const onMessageCancel = () => {
    dispatch(clearQuotedMessage())
  }

  const chatInputPlaceHolder = () => {
    if (chatMuted || chatSpamDisabled) return t('chat.chatMuted')

    return t('chat.inputPlaceholder')
  }

  const handleKeyPress = async (event) => {
    if (event.key == 'Enter') {
      await handleSubmit()
    }
  }

  const checkUserMute = () => {
    const isMuted = user.mutes[storeId]
    if (isMuted) dispatch(disableChatInput())
  }

  useEffect(() => {
    checkUserMute()
    if (isDesktop && user.name !== DefaultBuyerName && user.name !== 'Anónimo') {
      inputRef.current.focus()
    }
    if (!isDesktop && quotedMessage) inputRef.current.focus()
  }, [quotedMessage])

  useEffect(() => {
    if (chatSpamDisabled) {
      setTimeoutId(
        setTimeout(() => {
          dispatch(spamControlEnable())
        }, SPAM_REENABLE_TIME),
      )
    }
    return () => clearTimeout(timeoutId)
  }, [chatSpamDisabled])

  return (
    <Container data-test="input-container">
      <InputContainer data-test="input-box" isDesktop={isDesktop} onClick={(e) => handleInput(e)}>
        {quotedMessage && (
          <QuotedMessagePreview
            isDesktop={isDesktop}
          >{`@${quotedMessage.user.name}`}</QuotedMessagePreview>
        )}
        <Input
          data-test="input-chat"
          ref={inputRef}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          name="message"
          value={text}
          placeholder={chatInputPlaceHolder()}
          maxLength={maxLengthMessage}
          disabled={chatMuted || chatSpamDisabled}
          onClick={handleInput}
          isDesktop={isDesktop}
          autoComplete="off"
        />
        {quotedMessage && (
          <CancelButton data-test="send" isDesktop={isDesktop} onClick={onMessageCancel} />
        )}
        <SendButton
          onClick={handleSubmit}
          disabled={chatMuted || chatSpamDisabled}
          data-test="chat-send-message-button"
          isDesktop={isDesktop}
        />
      </InputContainer>
    </Container>
  )
}

ChatInput.propTypes = {
  isDesktop: PropTypes.bool,
  channelId: PropTypes.string.isRequired,
}

export { ChatInput }
