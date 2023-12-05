import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useAuthStore } from '@gojiraf/auth'
import CallService from '../services/callService'
import ChatService from '../services/chatService'
import { EnvConfig } from '../../config/env'
import { CustomerRoles } from '../constants/customerRoles'
import { PermissionStates } from '../constants/permissionStates'
import { cleanChat } from './uiSlice'
import { CallStates } from '../constants/callStates'
import { setCloseCallDesktop } from '../reducers/uiSlice'

//* ASYNC THUNK ACTIONS
export const joinRTCChannel = createAsyncThunk(
  'call/start',
  async ({ channel, isCohostUser = false }, { getState, dispatch, rejectWithValue }) => {
    const {
      call: {
        options: { appId },
      },
      store: {
        current: { isOneToManySale },
      },
    } = getState()
    const username = useAuthStore.getState().user.name
    try {
      await CallService.joinRTCChannel({
        appId,
        username,
        channel,
        isOneToManySale,
        isCohostUser,
      })
      dispatch(setCloseCallDesktop(true))
    } catch (err) {
      if (err.code === 'PERMISSION_DENIED') {
        dispatch(callSlice.actions.changePermissionStatus(PermissionStates.REJECTED))
      }
      return rejectWithValue({ name: err.name, message: err.message, code: err.code })
    }
  },
)

export const joinRTMChannel = createAsyncThunk(
  'call/start',
  async (sellerId, { dispatch, getState, rejectWithValue }) => {
    const {
      call: {
        options: { appId },
      },
    } = getState()
    const username = useAuthStore.getState().user.name
    dispatch(setSellerId(sellerId))
    try {
      await CallService.joinRTMChannel({
        appId,
        username,
        channelId: sellerId,
      })
    } catch (err) {
      return rejectWithValue({ name: err.name, message: err.message, code: err.code })
    }
  },
)

export const leaveCall = createAsyncThunk('call/leave', async (_, { dispatch, getState }) => {
  try {
    const { user } = useAuthStore.getState()
    const { channelId = null } = getState().call.chat
    if (channelId) await ChatService.leaveChat({ user, channelId })
    await CallService.leaveCall()
    dispatch(cleanChat())
  } catch (err) {
    console.error(err)
  }
})

export const leaveRTM = createAsyncThunk('call/leaveRTM', async () => {
  try {
    await CallService.leaveRTM()
  } catch (err) {
    console.error(err)
  }
})

export const upsertUser = createAsyncThunk('call/upsertUser', async (user, { getState }) => {
  const { channelId } = getState().call.chat
  await ChatService.upsertUser({ user, channelId })
})

export const toggleAudioCall = createAsyncThunk('call/toggleAudio', async (_, { getState }) => {
  const { isMute } = getState().call
  await CallService.setAudioTrackStatus(isMute)
  return !isMute
})

export const setTermsAndConditions = createAsyncThunk(
  'call/setTermsAndConditions',
  ({ countryCode, customTermsAndConditions }, { dispatch }) => {
    if (countryCode !== 'BR' && customTermsAndConditions !== true) {
      dispatch(setTermsAndConditionsAccepted(true))
    }
    return countryCode
  },
)

export const callSlice = createSlice({
  name: 'call',
  initialState: {
    options: {
      appId: EnvConfig.agoraAppId,
      channel: '',
    },
    chat: {
      channelId: null,
      messagesCount: 0,
      mobileChat: {
        connected: false,
      },
    },
    country: 'AR',
    permissionStatus: PermissionStates.PENDING,
    role: CustomerRoles.BUYER,
    leaveCallError: '',
    termsAndConditionsAccepted: false,
    displayFinishEventCountdown: false,
    displayStartEventCountdown: false,
    displayPopUp: false,
    sellerIsOnCall: true,
    sellerNetworkError: false,
    buyerPoorNetwork: false,
    audioPermission: false,
    videoPermission: false,
    audioOrVideoPermission: false,
    isOnCall: false,
    seller: {
      rtcUID: 2,
      externalrtcUID: 3,
      rtmUID: null,
    },
    localTracks: {
      camera: {
        track: null,
        enabled: false,
        facingMode: null,
      },
      microphone: {
        track: null,
        enabled: false,
        mutedBySeller: false,
      },
    },
    ban: false,
    users: [],
    callState: CallStates.CALL_NOT_STARTED,
    userCount: 0,
    lastVideo: false,
  },
  reducers: {
    setTermsAndConditionsAccepted: (state, action) => {
      state.termsAndConditionsAccepted = action.payload
    },
    setSellerNetworkError: (state, action) => {
      state.sellerNetworkError = action.payload
      state.sellerIsOnCall = !action.payload
    },
    setAudioPermission: (state, action) => {
      state.audioPermission = action.payload
    },
    setVideoPermission: (state, action) => {
      state.videoPermission = action.payload
    },
    setAudioOrVideoPermission: (state, action) => {
      state.audioOrVideoPermission = action.payload
    },
    setBuyerPoorNetwork: (state, action) => {
      state.buyerPoorNetwork = action.payload
    },
    setSellerId: (state, action) => {
      state.seller.rtmUID = action.payload
    },
    setLocalCameraTrack: (state, action) => {
      state.localTracks.camera.track = action.payload
    },
    enableLocalCameraTrack: (state, action) => {
      state.localTracks.camera.enabled = action.payload
    },
    setLocalMicrophoneTrack: (state, action) => {
      state.localTracks.microphone.track = action.payload
    },
    enableLocalMicrophoneTrack: (state, action) => {
      state.localTracks.microphone.enabled = action.payload
    },
    changePermissionStatus: (state, action) => {
      state.permissionStatus = action.payload
    },
    setDisplayStartEventCountdown: (state, action) => {
      state.displayStartEventCountdown = action.payload
    },
    setDisplayFinishEventCountdown: (state, action) => {
      state.displayFinishEventCountdown = action.payload
    },
    setDisplayPopUpState: (state, action) => {
      state.displayPopUp = action.payload
    },
    removeUser: (state, action) => {
      const { userUid } = action.payload
      const newUsers = state.users.filter((user) => user.id !== userUid)
      state.users = newUsers
    },
    addUser: (state, action) => {
      const newUser = action.payload.user.text

      state.users.push(newUser)
    },
    addUsers: (state, action) => {
      const newUsers = action.payload.users

      state.users = newUsers
    },
    changeCallState: (state, action) => {
      state.callState = action.payload
    },
    setUserCount: (state, action) => {
      state.userCount = action.payload.userCount
    },
    setMutedByPeer: (state, action) => {
      state.localTracks.microphone.mutedBySeller = action.payload
    },
    setBanUser: (state, action) => {
      state.ban = action.payload
    },
    setIsOnCall: (state, action) => {
      state.isOnCall = action.payload
    },
    setChannelId: (state, action) => {
      state.chat.channelId = action.payload
    },
    setLocalCameraFacingMode: (state, action) => {
      state.localTracks.camera.facingMode = action.payload
    },
    setVideoState: (state, action) => {
      const { rtcUID, videoTrack } = action.payload
      const [user] = state.users.filter((user) => user.rtcUID === rtcUID)
      if (videoTrack) {
        user.videoState = true
        state.lastVideo = rtcUID
      } else {
        user.videoState = false
        state.lastVideo = null
      }
    },
    setCohostVideoState: (state, action) => {
      const { rtcUID, videoState } = action.payload
      const [user] = state.users.filter((user) => user.rtcUID === rtcUID)
      user.hasVideo = videoState
    },
    setVideoStateExternal: (state, action) => {
      const { externalrtcUID, videoTrack } = action.payload
      const [user] = state.users.filter((user) => user.externalrtcUID === externalrtcUID)
      if (videoTrack) {
        user.videoState = true
        state.lastVideo = externalrtcUID
      } else {
        user.videoState = false
        state.lastVideo = null
      }
    },
    setCohostVideoStateExternal: (state, action) => {
      const { externalrtcUID, videoState } = action.payload
      const [user] = state.users.filter((user) => user.externalrtcUID === externalrtcUID)
      user.hasVideo = videoState
    },
    setMobileChatConnected: (state, action) => {
      state.chat.mobileChat.connected = action.payload
    },
    setMessagesCount: (state, action) => {
      state.chat.messagesCount = action.payload
    },
  },
  extraReducers: {
    [leaveCall.fulfilled]: (state) => {
      state.leaveCallError = ''
      state.callState = CallStates.CALL_NOT_STARTED
    },
    [leaveCall.rejected]: (state, action) => {
      state.leaveCallError = action.error.code
      state.callState = CallStates.CALL_NOT_STARTED
    },
    [setTermsAndConditions.fulfilled]: (state, action) => {
      state.country = action.payload
    },
  },
})

//* ACTIONS
export const {
  setTermsAndConditionsAccepted,
  setSellerNetworkError,
  setBuyerPoorNetwork,
  setSellerId,
  setLocalCameraTrack,
  enableLocalCameraTrack,
  setLocalMicrophoneTrack,
  enableLocalMicrophoneTrack,
  removeUser,
  addUser,
  addUsers,
  changeCallState,
  setUserCount,
  setMutedByPeer,
  setBanUser,
  setLocalCameraFacingMode,
  setAudioPermission,
  setVideoPermission,
  setAudioOrVideoPermission,
  setVideoState,
  setVideoStateExternal,
  setDisplayFinishEventCountdown,
  setDisplayStartEventCountdown,
  setDisplayPopUpState,
  setMobileChatConnected,
  setMessagesCount,
  setIsOnCall,
  setChannelId,
  setCohostVideoState,
  setCohostVideoStateExternal,
} = callSlice.actions

//* SELECTORS
export const selectTermsAndConditionsAccepted = (state) => state.call.termsAndConditionsAccepted
export const selectCountry = (state) => state.call.country
export const selectRole = (state) => state.call.role
export const selectPermissionState = (state) => state.call.permission
export const selectSellerNetworkError = (state) => state.call.sellerNetworkError
export const selectSellerIsOnCall = (state) => state.call.sellerIsOnCall
export const selectBuyerPoorNetwork = (state) => state.call.buyerPoorNetwork
export const selectAudioPermission = (state) => state.call.audioPermission
export const selectVideoPermission = (state) => state.call.videoPermission
export const selectAudioOrVideoPermission = (state) => state.call.audioOrVideoPermission
export const selectSeller = (state) => state.call.seller
export const selectLocalCameraTrack = (state) => state.call.localTracks.camera.track
export const selectLocalCameraFacingMode = (state) => state.call.localTracks.camera.facingMode
export const selectLocalCameraEnabled = (state) => state.call.localTracks.camera.enabled
export const selectLocalMicrophoneTrack = (state) => state.call.localTracks.microphone.track
export const selectLocalMicrophoneEnabled = (state) => state.call.localTracks.microphone.enabled
export const selectUsers = (state) => state.call.users
export const selectCallState = (state) => state.call.callState
export const selectUserCount = (state) => state.call.userCount
export const selectMutedByPeer = (state) => state.call.localTracks.microphone.mutedBySeller
export const selectBanUser = (state) => state.call.ban
export const selectLastVideo = (state) => state.call.lastVideo
export const selectIsOnCall = (state) => state.call.isOnCall
export const selectDisplayFinishEventCountdownstate = (state) =>
  state.call.displayFinishEventCountdown
export const selectDisplayStartEventCountdownstate = (state) =>
  state.call.displayStartEventCountdown
export const selectDisplayPopUpState = (state) => state.call.displayPopUp
export const selectMobileChatConnected = (state) => state.call.chat.mobileChat.connected
export const selectMessagesCount = (state) => state.call.chat.messagesCount
export const selectChannelId = (state) => state.call.chat.channelId

//* REDUCER
export default callSlice.reducer
