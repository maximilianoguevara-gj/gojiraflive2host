/* eslint-disable no-case-declarations */
import AgoraRTC from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'
import { useAuthStore } from '@gojiraf/auth'
import { CallMessage } from '../constants/callMessages'
import { AgoraRoles } from '../constants/agoraRoles'
import { EventLogs } from '../constants/eventLogs'
import dayjs from 'dayjs'
import store from '../core/store'
import {
  addUser,
  addUsers,
  setMutedByPeer,
  setSellerNetworkError,
  setBuyerPoorNetwork,
  setUserCount,
  setBanUser,
} from '../reducers/callSlice'
import { http } from './callClient'
import ReactGA from 'react-ga4'
import { FacingModesStates } from '../constants/cameraFacingModes'

const { REACT_APP_GET_EVENTID_MAX_ATTEMPTS = 3 } = process.env

class CallService {
  constructor() {
    this.rtcClient = null
    this.rtmClient = null
    this.rtmChannel = null
    this.rtcUID = null
    this.externalrtcUID = null
    this.rtmUID = null
    this.remoteAudioTracks = []

    if (!CallService.instance) {
      this._map = new Map()
      this.eventHandlers = {}
      CallService.instance = this
    }
    return CallService.instance
  }

  async getSeller(storeId) {
    const { tokens } = useAuthStore.getState().user

    const response = await http.post(
      '/call',
      {
        storeId,
      },
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      },
    )
    return response.data
  }

  async getSellerExternal(storeId) {
    const { tokens } = useAuthStore.getState().userexternal

    const response = await http.post(
      '/call',
      {
        storeId,
      },
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      },
    )
    return response.data
  }

  async getEventId(storeId, token) {
    const { data } = await http.post(
      '/getEventId',
      {
        storeId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return data
  }

  async findEventId(storeId) {
    const delay = () => new Promise((resolve) => setTimeout(resolve, 1000))
    const { tokens } = useAuthStore.getState().user
    let response

    for (let i = 0; i < REACT_APP_GET_EVENTID_MAX_ATTEMPTS; i++) {
      try {
        await delay()
        response = await this.getEventId(storeId, tokens.accessToken)
        if (response?.eventId) {
          ReactGA.event({
            category: 'Chat-CallService',
            action: `got-event-id [${response?.eventId}] [${storeId}]`,
            label: `got-event-id [${response?.eventId}] [${storeId}]`,
          })
          return response?.eventId
        }
      } catch (error) {
        ReactGA.event({
          category: 'Chat-CallService',
          action: `error-get-event-id`,
          label: `error-get-event-id`,
        })
        response = error
      }
    }
    return response
  }

  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = []
    }
    this.eventHandlers[event].push(handler)
  }

  off(event, handler) {
    const index = this.eventHandlers[event]?.indexOf(handler)
    if (index >= 0) {
      this.eventHandlers[event].splice(index, 1)
    }
  }

  dispatchEvent(event, params) {
    this.eventHandlers[event]?.forEach((handler) => handler(...params))
  }

  callActions() {
    return this._map.get('callActions')
  }

  isRTMChannelOpen() {
    return this._map.get('isRTMChannelOpen')
  }

  get dispatch() {
    return store.dispatch
  }

  restartAudioTracks() {
    for (let audioTrack of this.remoteAudioTracks) {
      audioTrack.stop()
      audioTrack.play()
    }
  }

  setVideoStartedHandler(videoStarted) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onVideoStart: videoStarted,
    })
  }

  setCallProductsHandler(callsProducts) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onCallProductsUpdated: callsProducts,
    })
  }

  setChatMessageReceivedHandler(handleMeesage) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onChatMessageReceived: handleMeesage,
    })
  }

  setLikeMessageReceivedHandler(handleMeesage) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onLikeMessageReceived: handleMeesage,
    })
  }

  setFinishEventCountdownMessageHandler(handleMeesage) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onFinishEventCountMessage: handleMeesage,
    })
  }

  setStartEventCountdownMessageHandler(handleMeesage) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onStartEventCountMessage: handleMeesage,
    })
  }

  setDisplayPopUpMessageHandler(handleMeesage) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onDisplayPopUpMessage: handleMeesage,
    })
  }

  setClearProductsInCallHandler(clearProductsInCallHandler) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onClearProductsInCall: clearProductsInCallHandler,
    })
  }

  setOnMessageAdded(cb) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onMessageAdded: cb,
    })
  }

  setOnMessagePinned(cb) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onMessagePinned: cb,
    })
  }

  setOnMessageDeleted(cb) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onMessageDeleted: cb,
    })
  }

  setOnMessagesReceived(cb) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onMessagesReceived: cb,
    })
  }

  setOnCallFinished(cb) {
    const actions = this.callActions()
    this._map.set('callActions', {
      ...actions,
      onCallFinished: cb,
    })
  }

  async joinRTMChannel(args) {
    try {
      this._initRTMClient(args.appId)
      this.rtmUID = useAuthStore.getState().user.id
      await this.rtmClient.login({
        uid: this.rtmUID,
      })
      this._initRTMChannel(args.channelId)
      this.subscribeRTMClientOnMessage()
      this.subscribeRTMChannelOnMessage()
      this.subscribeRtmClientUserLeft()
      this.subscribeRtmClientMemberCountUpdated()
      await this.rtmChannel.join()
    } catch (error) {
      console.error(error)
    }
  }

  async joinRTCChannel(args) {
    try {
      this._initRTCClient({
        host: !args.isOneToManySale || args.isCohostUser,
      })
      await this.subscribeRtcClientUserJoined()
      await this.subscribeRtcClientUserLeft()
      const rtcUID = await this.rtcClient.join(args.appId, args.channel, null, null)
      this.rtcUID = rtcUID
    } catch (error) {
      console.error(error)
    }
  }
  async joinRTCChannelExternal(args) {
    try {
      this._initRTCClient({
        host: !args.isOneToManySale || args.isCohostUser,
      })
      await this.subscribeRtcClientUserJoined()
      await this.subscribeRtcClientUserLeft()
      const externalrtcUID = await this.rtcClient.join(args.appId, args.channel, null, null)
      this.externalrtcUID = externalrtcUID
    } catch (error) {
      console.error(error)
    }
  }

  _initRTCClient({ host }) {
    this.rtcClient = AgoraRTC.createClient({
      mode: host ? 'rtc' : 'live',
      codec: 'vp8',
      role: host ? AgoraRoles.HOST : AgoraRoles.AUDIENCE,
      clientRoleOptions: { level: 1 },
    })
  }

  _initRTMClient(appId) {
    this.rtmClient = AgoraRTM.createInstance(appId, {
      enableLogUpload: true,
      logFilter: AgoraRTM.LOG_FILTER_ERROR,
    })
  }

  _initRTMChannel(channel) {
    this.rtmChannel = this.rtmClient.createChannel(channel)
  }

  async startLocalVideo(isMobile, isCohostUser) {
    if (isCohostUser) return await this.startCohostCamera()
    return await this.startBuyerCamera(isMobile)
  }

  async stopLocalVideo(isMobile, isCohostUser) {
    if (isCohostUser) return await this.stopCohostCamera()
    return await this.stopBuyerCamera(isMobile)
  }

  async getCamerasDevices() {
    return await AgoraRTC.getCameras()
  }

  async startCohostCamera() {
    const configPreset = {
      facingMode: FacingModesStates.ENVIROMENT,
    }
    const agoraCamera = await AgoraRTC.createCameraVideoTrack(configPreset)
    return agoraCamera
  }

  async startBuyerCamera(isMobile) {
    const configPreset = {
      encoderConfig: {
        width: isMobile ? 640 : 240,
        height: isMobile ? 480 : 320,
        frameRate: 15,
        bitrateMin: isMobile ? 450 : 150,
        bitrateMax: isMobile ? 550 : 200,
      },
    }
    const agoraCamera = await AgoraRTC.createCameraVideoTrack(configPreset)
    return agoraCamera
  }
  async stopBuyerCamera(isMobile) {
    const configPreset = {
      encoderConfig: {
        width: isMobile ? 640 : 240,
        height: isMobile ? 480 : 320,
        frameRate: 15,
        bitrateMin: isMobile ? 450 : 150,
        bitrateMax: isMobile ? 550 : 200,
      },
    }
    const agoraCamera = await AgoraRTC.createCameraVideoTrack(configPreset)
    return agoraCamera
  }

  startLocalAudio() {
    return AgoraRTC.createMicrophoneAudioTrack()
  }

  publishTrack(track) {
    return this.rtcClient.publish(track)
  }

  async getOtherBuyers() {
    const buyers = {}
    for (const user of this.rtcClient.remoteUsers) {
      if (user.uid === this._getSeller().rtcUID) continue
      buyers[user.uid] = user
    }
    return buyers
  }

  subscribeToVideo(buyer) {
    return this.rtcClient.subscribe(buyer, 'video')
  }

  subscribeToAudio(buyer) {
    return this.rtcClient.subscribe(buyer, 'audio')
  }

  setUser(username) {
    this._map.set('user', {
      userName: username,
      id: this.rtcClient.uid.toString(),
      uid: this.rtcClient.uid.toString(),
    })
  }

  async subscribeRTMClientOnMessage() {
    this.rtmClient.on('MessageFromPeer', async (message) => {
      const { event, payload } = JSON.parse(message.text)
      switch (event) {
        case CallMessage.HANG_UP:
          this.dispatchEvent(CallServiceEvents.SELLER_HUNG_UP, [EventLogs.SELLER_HANG_UP_BUYER])
          this.leaveCall()
          break
        case CallMessage.ON_CUSTOMER_IDENTIFICATED:
          const { user } = useAuthStore.getState()
          const filteredUsers = payload.filter((remoteUser) => remoteUser.id !== user.id)
          store.dispatch(
            addUsers({
              users: filteredUsers,
            }),
          )
          break
        case CallMessage.MUTE_AUDIO:
          this.dispatch(setMutedByPeer(true))
          break
        case CallMessage.LEAVE_CHANNEL:
          this.dispatch(setBanUser(true))
          break
        default:
          break
      }
    })
  }

  subscribeRTMChannelOnMessage() {
    this.rtmChannel.on('ChannelMessage', (message) => {
      const { event, payload } = JSON.parse(message.text)
      switch (event) {
        case CallMessage.CHAT_MESSAGE:
          this.callActions().onMessageAdded(payload.message)
          break
        case CallMessage.LIKE_MESSAGE:
          this.callActions().onLikeMessageReceived(payload)
          break
        case CallMessage.FINISH_COUNTDOWN_MESSAGE:
          this.callActions().onFinishEventCountMessage(payload)
          break
        case CallMessage.START_COUNTDOWN_MESSAGE:
          this.callActions().onStartEventCountMessage(payload)
          break
        case CallMessage.DISPLAY_POPUP_MESSAGE:
          this.callActions().onDisplayPopUpMessage(payload)
          break
        case CallMessage.ON_CUSTOMER_IDENTIFICATION:
          store.dispatch(
            addUser({
              user: payload,
            }),
          )
          break
        case CallMessage.PIN_MESSAGE:
          this.callActions().onMessagePinned(payload)
          break
        case CallMessage.DELETE_MESSAGE:
          this.callActions().onMessageDeleted(payload)
          break
        default:
          break
      }
    })

    //This callback is disabled when the number of the channel members exceeds 512. (Agora documentation)
    this.rtmChannel.on('MemberJoined', async (memberId) => {
      this._onRTMMemberJoined(memberId)
    })
  }

  //This callback is disabled when the number of the channel members exceeds 512. (Agora documentation)
  subscribeRtmClientUserLeft() {
    this.rtmChannel.on('MemberLeft', async (memberId) => {
      const sellerUID = this._getSeller()
      if (memberId != sellerUID.rtmUID) {
        this.dispatchEvent(CallServiceEvents.BUYER_LEFT, [memberId])
      }
    })
  }

  //When the number of channel members ≤ 512, the SDK returns this callback when the number changes at a frequency of once per second.
  //When the number of channel members exceeds 512, the SDK returns this callback when the number changes at a frequency of once every three seconds.
  subscribeRtmClientMemberCountUpdated() {
    this.rtmChannel.on('MemberCountUpdated', async (membersCount) => {
      const { sellerIsOnCall } = store.getState().call
      this.dispatch(
        setUserCount({
          userCount: membersCount - (sellerIsOnCall ? 1 : 0),
        }),
      )
    })
  }

  async subscribeRtcClientUserJoined() {
    this.rtcClient.on('user-published', async (user, mediaType) => {
      await this.rtcClient.subscribe(user, mediaType)
      if (mediaType === 'audio') {
        this.remoteAudioTracks.push(user.audioTrack)
      }
      //externalrtcUID add
      //Pause rtcUID video and audio track
      const externalstate = store.getState()
      if (user.uid === externalstate.call.seller.externalrtcUID) {
        if (mediaType === 'video') {
          this.dispatchEvent(CallServiceEvents.SELLER_PUBLISHED_CAMERA, [user.videoTrack])
          user.videoTrack.on('first-frame-decoded', () => {
            if (this.callActions()?.onVideoStart) {
              this.callActions().onVideoStart(user.videoTrack.getMediaStreamTrack())
            }
          })
        }
      }
      const state = store.getState()
      if (user.uid === state.call.seller.rtcUID) {
        if (mediaType === 'video') {
          this.dispatchEvent(CallServiceEvents.SELLER_PUBLISHED_CAMERA, [user.videoTrack])
          user.videoTrack.on('first-frame-decoded', () => {
            if (this.callActions()?.onVideoStart) {
              this.callActions().onVideoStart(user.videoTrack.getMediaStreamTrack())
            }
          })
        }
        if (mediaType === 'audio') {
          user.audioTrack.play()
        }
      } else {
        if (mediaType === 'audio') {
          this.dispatchEvent(CallServiceEvents.BUYER_PUBLISHED_MICROPHONE, [
            user.uid,
            user.audioTrack,
          ])
        }
        if (mediaType === 'video') {
          this.dispatchEvent(CallServiceEvents.BUYER_PUBLISHED_CAMERA, [user.uid, user.videoTrack])
          user.videoState = true
        }
      }
    })
    this.rtcClient.on('user-unpublished', async (user, mediaType) => {
      if (user.uid !== this._getSeller().rtcUID) {
        if (mediaType === 'audio') {
          this.dispatchEvent(CallServiceEvents.BUYER_UNPUBLISHED_MICROPHONE, [user.uid])
        }
        if (mediaType === 'video') {
          this.dispatchEvent(CallServiceEvents.BUYER_UNPUBLISHED_CAMERA, [user.uid])
          user.videoState = false
        }
      }
    })
    this.rtcClient.on('network-quality', async (stats) => {
      if (stats.downlinkNetworkQuality > 2) {
        this.dispatch(setBuyerPoorNetwork(true))
      }
      console.log('network-quality: ' + stats.downlinkNetworkQuality)
    })
    this.rtcClient.on('user-joined', async (user) => {
      if (user.uid === this._getSeller().rtcUID) {
        this.dispatch(setSellerNetworkError(false))
        const channelId = this.rtmChannel.channelId
        const { [channelId]: membersCount } = await this.rtmClient.getChannelMemberCount([
          channelId,
        ])
        this.dispatch(
          setUserCount({
            userCount: membersCount - 1,
          }),
        )
      } else {
        this.dispatchEvent(CallServiceEvents.BUYER_JOINED, [user])
      }
    })
  }

  async getCallMembersCount() {
    const channelId = this.rtmChannel.channelId
    const { [channelId]: membersCount } = await this.rtmClient.getChannelMemberCount([channelId])
    const { sellerIsOnCall } = store.getState().call

    const seller = sellerIsOnCall ? 1 : 0
    const buyers = membersCount - seller
    const otherBuyers = buyers - 1
    const total = membersCount
    return {
      seller,
      buyers,
      otherBuyers,
      total,
    }
  }

  async subscribeRtcClientUserLeft() {
    this.rtcClient.on('user-left', (user, reason) => {
      const state = store.getState()
      if (user.uid === state.call.seller.rtcUID && reason === 'ServerTimeOut') {
        this.dispatch(setSellerNetworkError(true))
      } else if (user.uid === state.call.seller.rtcUID) {
        this.leaveCall()
        this.dispatchEvent(CallServiceEvents.SELLER_HUNG_UP, [EventLogs.SELLER_HANG_UP_ALL])
      } else {
        this.dispatchEvent(CallServiceEvents.BUYER_LEFT, [user.uid])
      }
    })
  }

  sendMessageToPeer(uid, message) {
    this.rtmClient
      .sendMessageToPeer(
        {
          text: JSON.parse(message),
        },
        uid,
      )
      .catch((error) => {
        console.error('Error sending message to peer: ', error.toString())
      })
  }

  async _sendPrefixedMessageToPeer(uid, prefix, data) {
    try {
      await this.rtmClient.sendMessageToPeer(
        {
          event: prefix,
          payload: data,
        },
        uid,
      )
    } catch (error) {
      console.error('Error sending message to peer: ', error.toString())
    }
  }

  _sendPrefixedMessageToSeller(prefix, data) {
    const state = store.getState()
    const sellerUID = state.call.seller.rtmUID
    return this._sendPrefixedMessageToPeer(sellerUID, prefix, data)
  }

  async _sendPrefixedBroadcast(prefix, data) {
    const msg = {
      event: prefix,
      payload: data,
    }
    try {
      await this.rtmChannel.sendMessage({ text: JSON.stringify(msg) })
    } catch (error) {
      console.error('Error sending broadcast message: ', error.toString())
    }
  }

  async notifyChannelOrderShipped(productsIds) {
    const msg = {
      event: CallMessage.ORDER_SHIPPED,
      payload: productsIds,
    }
    await this.sendMessageToChannel(msg)
  }

  async notifyChannelLikeMessage() {
    const username = useAuthStore.getState().user.name

    let messageToSend = {
      uid: this.rtmUID,
      userName: username,
      timestamp: dayjs().valueOf(),
    }
    const msg = {
      event: CallMessage.LIKE_MESSAGE,
      payload: messageToSend,
    }
    const isSuccessful = await this.sendMessageToChannel(msg)

    if (isSuccessful) {
      return messageToSend
    }
  }

  async notifyChannelFinishEventCountdownMessage(finishCountdownMessage) {
    const msg = {
      event: CallMessage.FINISH_COUNTDOWN_MESSAGE,
      payload: finishCountdownMessage,
    }
    const isSuccessful = await this.sendMessageToChannel(msg)

    if (isSuccessful) {
      return msg
    }
  }

  async notifyChannelStartEventCountdownMessage(startCountdownMessage) {
    const msg = {
      event: CallMessage.START_COUNTDOWN_MESSAGE,
      payload: startCountdownMessage,
    }
    const isSuccessful = await this.sendMessageToChannel(msg)

    if (isSuccessful) {
      return msg
    }
  }

  async notifyChannelDisplayPopUpMessage(popUpMessage) {
    const msg = {
      event: CallMessage.DISPLAY_POPUP_MESSAGE,
      payload: popUpMessage,
    }
    const isSuccessful = await this.sendMessageToChannel(msg)

    if (isSuccessful) {
      return msg
    }
  }

  async sendMessageToChannel(message) {
    try {
      await this.rtmChannel.sendMessage({ text: JSON.stringify(message) })
      return true
    } catch (error) {
      console.error(
        `An error ocurred trying to send a message into the RTM channel, ${error.toString()}`,
      )
    }
  }

  async leaveCall() {
    if (this.callActions()?.onCallFinished) {
      this.callActions().onCallFinished()
    }
    if (this.callActions()?.onClearProductsInCall) {
      this.callActions().onClearProductsInCall()
    }
    await this.rtmChannel.leave()
    await this.rtmClient.logout()
    await this.rtcClient.leave()
    this._map.clear()
  }

  async leaveRTM() {
    await this.rtmChannel.leave()
    await this.rtmClient.logout()
  }

  _getSeller() {
    const state = store.getState()
    return state.call.seller
  }

  _getCustomer() {
    const username = useAuthStore.getState().user.name
    const userRole = useAuthStore.getState().user.role

    return {
      text: {
        userName: username,
        role: userRole,
        id: this.rtmUID,
        uid: this.rtmUID,
        rtcUID: this.rtcUID,
      },
    }
  }

  // RTM
  async _onRTMMemberJoined(memberUID) {
    const sellerUID = this._getSeller()
    if (memberUID === sellerUID.rtmUID) {
      return this.identifyMySelf(memberUID)
    }
  }

  async _onRTMMemberLeft(memberUID) {
    const sellerUID = this._getSeller()
    if (memberUID === sellerUID.rtmUID) {
      this.dispatchEvent(CallServiceEvents.SELLER_HUNG_UP, [EventLogs.SELLER_HANG_UP_ALL])
      this.leaveCall()
    }
  }

  identifyMySelf(rtcUID = null) {
    if (rtcUID == null) {
      this._sendPrefixedBroadcast(CallMessage.ON_CUSTOMER_IDENTIFICATION, this._getCustomer())
    } else {
      const sellerUID = this._getSeller()

      this._sendPrefixedMessageToPeer(
        sellerUID.rtmUID,
        CallMessage.ON_CUSTOMER_IDENTIFICATION,
        this._getCustomer(),
      )
    }
    return
  }
  async banUser(uuid) {
    try {
      await this.rtmClient.sendMessageToPeer(
        {
          text: JSON.stringify({ event: CallMessage.LEAVE_CHANNEL }),
        },
        uuid,
      )
    } catch (error) {
      console.error('Error ban user to channel: ', error.toString())
    }
  }
}

export const CallServiceEvents = {
  SELLER_PUBLISHED_CAMERA: 'SELLER_PUBLISHED_CAMERA',
  SELLER_HUNG_UP: 'SELLER_HUNG_UP',
  BUYER_JOINED: 'BUYER_JOINED',
  BUYER_LEFT: 'BUYER_LEFT',
  BUYER_PUBLISHED_CAMERA: 'BUYER_PUBLISHED_CAMERA',
  BUYER_UNPUBLISHED_CAMERA: 'BUYER_UNPUBLISHED_CAMERA',
  BUYER_PUBLISHED_MICROPHONE: 'BUYER_PUBLISHED_MICROPHONE',
  BUYER_UNPUBLISHED_MICROPHONE: 'BUYER_UNPUBLISHED_MICROPHONE',
  ON_MESSAGE_ADDED: 'ON_MESSAGE_ADDED',
  ON_MESSAGE_PINNED: 'ON_MESSAGE_PINNED',
  ON_MESSAGE_DELETED: 'ON_MESSAGE_DELETED',
  ON_MESSAGES_RECEIVED: 'ON_MESSAGES_RECEIVED',
}

const instance = new CallService()

export default instance
