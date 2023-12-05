import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAutoJoinChat } from '../reducers/uiSlice'
import ChatService from '../services/chatService'
import CallService from '../services/callService'
import { selectCurrentStore } from '../reducers/storeSlice'
import { selectIsOnCall } from '../reducers/callSlice'
import { useViews } from 'state'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'

export const useChat = ({ user, isDesktop = false }) => {
  const [chatData, setChatData] = useState({
    chatClient: null,
    chatChannel: null,
  })
  const { id: storeId } = useSelector(selectCurrentStore)
  const autoJoinChat = useSelector(selectAutoJoinChat)
  const isOnCall = useSelector(selectIsOnCall)
  const { send } = useViews()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { sendEventPostToElastic } = useElasticEventTracker()

  const getChannelId = async () => {
    const currentChannelId = await CallService.findEventId(storeId)
    console.info('chat-channel-id: ', currentChannelId)
    return currentChannelId
  }

  const [channelDeleted, setChannelDeleted] = useState(false)
  useEffect(() => {
    const handleChannelDeleted = () => {
      send({ type: 'SHOW_PRODUCTS' })
      setChannelDeleted(true)
      gaEventTracker('Chat-ChatService', 'deleted-chat-channel')
      sendEventPostToElastic('errors', 'deleted-chat-channel')
      matomoTrackEvent('Chat-ChatService', 'deleted-chat-channel')
    }

    const unsubscribeChannelDeleted = ChatService.listenChannelDeleted(handleChannelDeleted)

    return () => {
      unsubscribeChannelDeleted()
    }
  }, [])

  const initChat = async () => {
    if (isOnCall) {
      try {
        const channelId = await getChannelId()
        const { client, channel } = await ChatService.joinChat({
          user,
          channelId,
          isDesktop,
        })
        setChatData({ chatClient: client, chatChannel: channel })
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    if (autoJoinChat) initChat()
  }, [])

  return {
    chatData,
    initChat,
    channelDeleted,
  }
}
