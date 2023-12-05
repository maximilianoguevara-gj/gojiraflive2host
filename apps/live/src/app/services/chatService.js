import axios from 'axios'
import { StreamChat } from 'stream-chat'
import store from '../core/store'
import { chatType } from '../constants/chatType'
import { CustomerRoles } from '../constants/customerRoles'
import {
  clearQuotedMessage,
  setPinnedMessage,
  clearPinnedMessage,
  setChatError,
  disableChatInput,
} from '../reducers/uiSlice'
import { setChannelId, setMessagesCount } from '../reducers/callSlice'
import { ChatErrors, MessageTypes } from '../constants/chatErrors'
import { sendEventToElastic } from '@gojiraf/analytics'
import ReactGA from 'react-ga4'

const { REACT_APP_STREAM_ACCESS_KEY, REACT_APP_CHAT_SERVICE } = process.env

class ChatService {
  constructor() {
    this.client = new StreamChat(REACT_APP_STREAM_ACCESS_KEY)
  }

  get dispatch() {
    return store.dispatch
  }

  async getStreamToken({ userId, tokens }) {
    const {
      data: { streamToken },
    } = await axios.post(
      `${REACT_APP_CHAT_SERVICE}/streamChat/getToken`,
      {
        userId,
      },
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      },
    )
    return streamToken
  }

  showErrorModal({ errorMessage, errorTitle, showDialog, errorCode }) {
    store.dispatch(
      setChatError({
        errorMessage,
        errorTitle,
        showDialog,
        errorCode,
      }),
    )
  }

  sendMessageErrorHandler(error) {
    switch (error.code) {
      case ChatErrors.MutedByAdmin:
        store.dispatch(disableChatInput())
        break
      case ChatErrors.BadWord:
        this.showErrorModal({
          errorMessage: 'errorMessage.badWord',
          errorTitle: 'errorMessage.badWordTitle',
          errorCode: error.code,
          showDialog: true,
        })
        break
      default:
        this.showErrorModal({
          errorMessage: 'errorMessage.sendMessageError',
          errorTitle: 'errorMessage.defaultErrorMessageTitle',
          errorCode: error.code,
          showDialog: true,
        })
        break
    }
  }

  async queryMember({ userId, channelId }) {
    const channel = this.client.channel(chatType.LIVESTREAM, channelId)
    try {
      const { members } = await channel.queryMembers({ user_id: userId })
      return members[0]
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async muteUser({ userId, moderatorId, channelId }) {
    const channel = this.client.channel(chatType.LIVESTREAM, channelId)
    const bannedUser = await channel.banUser(userId, {
      banned_by_id: moderatorId,
      reason: 'Muted by moderator',
    })

    return bannedUser
  }

  async sendMessage({ channel, message }) {
    const {
      message: { type },
    } = await channel.sendMessage({
      text: message,
    })
    if (type === MessageTypes.error) throw { code: ChatErrors.BadWord }
  }

  async sendReplyMessage({ quotedMessage, channel, message }) {
    store.dispatch(clearQuotedMessage())
    await channel.sendMessage({
      text: message,
      quoted_message_id: quotedMessage.id,
    })
  }

  async sendMessageToChat({ quotedMessage, channelId, message }) {
    try {
      const channel = await this.client.channel(chatType.LIVESTREAM, channelId)
      if (quotedMessage) {
        await this.sendReplyMessage({ quotedMessage, channel, message })
      } else {
        await this.sendMessage({ channel, message })
      }
    } catch (error) {
      this.sendMessageErrorHandler(error)
      return error
    }
    return 'ok'
  }

  async requestPinnedMessage(channelId) {
    try {
      const channel = await this.client.channel(chatType.LIVESTREAM, channelId)
      const { messages } = await channel.getPinnedMessages({ limit: 1 })
      const lastPinnedMessage = messages[messages.length - 1]
      if (lastPinnedMessage) store.dispatch(setPinnedMessage(lastPinnedMessage))
    } catch (error) {
      console.error(error)
    }
  }

  async upsertUser({ user, channelId }) {
    const { id: userId, tokens, name, role } = user
    const upsertRole = await axios.patch(
      `${REACT_APP_CHAT_SERVICE}/streamChat/upsertRoles`,
      {
        eventId: channelId,
        userId,
        name,
        role,
      },
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      },
    )

    return upsertRole
  }

  async connectUser(user) {
    const { id: userId, tokens, name } = user
    const streamToken = await this.getStreamToken({ userId, tokens })
    await this.client.connectUser(
      {
        id: userId,
        name,
      },
      streamToken,
    )
  }

  messagesNotificationListener(channel) {
    channel.on('message.new', (event) => {
      store.dispatch(setMessagesCount(event.total_unread_count))
    })
    channel.on('notification.message_new', (event) => {
      store.dispatch(setMessagesCount(event.total_unread_count))
    })
  }

  messageUpdateListener(channel) {
    channel.on('message.updated', (event) => {
      if (event.message.pinned == false) {
        store.dispatch(clearPinnedMessage())
        this.requestPinnedMessage(event.channel_id)
      }
    })
  }

  async joinChat({ user, channelId, isDesktop }) {
    try {
      await this.connectUser(user)
      const channel = this.client.channel(chatType.LIVESTREAM, channelId)
      if (!isDesktop) this.messagesNotificationListener(channel)
      this.messageUpdateListener(channel)
      await channel.addMembers([user.id])
      if (user.role === CustomerRoles.MODERATOR) await this.upsertUser({ user, channelId })
      await this.requestPinnedMessage(channelId)
      store.dispatch(setChannelId(channel.id))
      return { client: this.client, channel }
    } catch (error) {
      console.error(error)
      ReactGA.event({
        category: 'Chat-ChatService',
        action: `error-connecting-user-to-chat`,
        label: `error-connecting-user-to-chat`,
      })
      const storeState = store.getState()
      await sendEventToElastic(
        storeState.store.current,
        user,
        'errors',
        'error-connecting-user-to-chat',
      ) //FIXME: Borrar en el futuro
      const errorMessage =
        user.role === CustomerRoles.MODERATOR
          ? 'dialogs.joinChatErrorDescriptionModerator'
          : 'dialogs.joinChatErrorDescription'
      this.showErrorModal({
        showDialog: true,
        errorCode: error.code,
        errorMessage,
        errorTitle: 'errorMessage.defaultErrorMessageTitle',
      })
    }
  }

  async pinMessage(currentlyPinned, message) {
    try {
      if (currentlyPinned) await this.client.unpinMessage(currentlyPinned.id)
      await this.client.pinMessage(message.id)
      store.dispatch(setPinnedMessage(message))
    } catch (error) {
      console.error(error)
      this.showErrorModal({
        showDialog: true,
        errorCode: error.code,
        errorMessage: 'errorMessage.pinErrorMessage',
        errorTitle: 'errorMessage.defaultErrorMessageTitle',
      })
    }
  }

  async unpinMessage(currentlyPinned) {
    try {
      await this.client.unpinMessage(currentlyPinned.id)
      store.dispatch(clearPinnedMessage())
    } catch (error) {
      console.error(error)
      this.showErrorModal({
        showDialog: true,
        errorCode: error.code,
        errorMessage: 'errorMessage.unpinMessageError',
        errorTitle: 'errorMessage.defaultErrorMessageTitle',
      })
    }
  }

  async leaveChat({ user, channelId }) {
    const { id: userId } = user
    try {
      const channel = this.client.channel(chatType.LIVESTREAM, channelId)
      await channel.removeMembers([userId])
    } catch (err) {
      console.log(err)
    }
  }

  listenChannelDeleted(callback) {
    const channelDeletedHandler = (event) => {
      callback(event)
    }
    this.client.on('channel.deleted', channelDeletedHandler)
    return () => {
      this.client.off('channel.deleted', channelDeletedHandler)
    }
  }
}

const instance = new ChatService()
Object.freeze(instance)

export default instance
