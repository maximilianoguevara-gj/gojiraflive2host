/* eslint-disable prettier/prettier */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { CustomerRoles } from '../constants/customerRoles'
import CallService from '../services/callService'
import { getDateTime } from '../utils/countdownTimerUtils'
import {
  setDisplayStartEventCountdown,
  setDisplayFinishEventCountdown,
  setDisplayPopUpState,
} from './callSlice'

export const UI_IS_TABLET = 'UI_IS_TABLET'
export const UI_IS_LAPTOP = 'UI_IS_LAPTOP'

export const CALL_CARD_PRODUCTS = 'CALL_CARD_PRODUCTS'
export const CALL_CARD_CHECKOUT = 'CALL_CARD_CHECKOUT'
export const CALL_CARD_CART = 'CALL_CARD_CART'
export const CALL_CARD_PRODUCT_DETAIL = 'CALL_CARD_PRODUCT_DETAIL'
export const CALL_CARD_CHECKOUT_SUCCESS = 'CALL_CARD_CHECKOUT_SUCCESS'
export const CALL_CARD_CASH_CHECKOUT_SUCCESS = 'CALL_CARD_CASH_CHECKOUT_SUCCESS'
export const CALL_CARD_CASH_CHECKOUT_FAILURE = 'CALL_CARD_CASH_CHECKOUT_FAILURE'
export const CALL_CARD_CHECKOUT_FAILURE = 'CALL_CARD_CHECKOUT_FAILURE'
export const CALL_ACTION_CHAT = 'CALL_ACTION_CHAT'
export const CALL_ACTION_PRODUCTS = 'CALL_ACTION_PRODUCTS'
export const CALL_ACTION_CAMERAS = 'CALL_ACTION_CAMERAS'
export const SPAM_REENABLE_TIME = 15000
const SPAM_MAX_MESSAGES = 10
const SPAM_MAX_MESSAGES_TIME = 5000

export const notifyLikeMeesage = createAsyncThunk(
  'ui/notifyLikeMeesage',
  async (_, { dispatch }) => {
    const messageSent = await CallService.notifyChannelLikeMessage()

    if (messageSent) {
      dispatch(setIsLikeAnimationVisible({ isLikeAnimationVisible: true }))
    }
  },
)

export const notifyFinishEventCountdownMessage = createAsyncThunk(
  'ui/notifyFinishEventCountdownMessage',
  async (displayFinishEventCountdown, { dispatch }) => {
    const messageSent = await CallService.notifyChannelFinishEventCountdownMessage(
      displayFinishEventCountdown,
    )
    if (messageSent) {
      dispatch(setDisplayFinishEventCountdown(displayFinishEventCountdown))
    }
  },
)

export const notifyStartEventCountdownMessage = createAsyncThunk(
  'ui/notifyStartEventCountdownMessage',
  async (displayStartEventCountdown, { dispatch }) => {
    const messageSent = await CallService.notifyChannelStartEventCountdownMessage(
      displayStartEventCountdown,
    )
    if (messageSent) {
      dispatch(setDisplayStartEventCountdown(displayStartEventCountdown))
    }
  },
)

export const notifyPopUpMessage = createAsyncThunk(
  'ui/notifyPopUpMessage',
  async (displayPopUp, { dispatch }) => {
    const messageSent = await CallService.notifyChannelDisplayPopUpMessage(displayPopUp)
    if (messageSent) {
      dispatch(setDisplayPopUpState(displayPopUp))
    }
  },
)

export const setLikeMessageReceivedHandler = createAsyncThunk(
  'ui/likeMessageReceivedHandler',
  async (messageHandler) => {
    await CallService.setLikeMessageReceivedHandler(messageHandler)
  },
)

export const setFinishEventCountdownMessageHandler = createAsyncThunk(
  'ui/finishEventcountdownMessageHandler',
  async (messageHandler) => {
    await CallService.setFinishEventCountdownMessageHandler(messageHandler)
  },
)

export const setStartEventCountdownMessageHandler = createAsyncThunk(
  'ui/startEventcountdownMessageHandler',
  async (messageHandler) => {
    await CallService.setStartEventCountdownMessageHandler(messageHandler)
  },
)

export const setDisplayPopUpMessageHandler = createAsyncThunk(
  'ui/setDisplayPopUpMessageHandler',
  async (messageHandler) => {
    await CallService.setDisplayPopUpMessageHandler(messageHandler)
  },
)

export const setVideoStartedHandler = createAsyncThunk(
  'ui/videoStartedHandler',
  async (videoStartedHandler) => {
    CallService.setVideoStartedHandler(videoStartedHandler)
  },
)

export const setEventStartDateTime = createAsyncThunk(
  'ui/setEventStartDateTime',
  async (remainingSeconds) => {
    if (remainingSeconds) {
      const eventStartDateTime = await getDateTime(remainingSeconds)

      return eventStartDateTime
    }
  },
)

export const setFinishEventDateTime = createAsyncThunk(
  'ui/setFinishEventDateTime',
  async (secondsToFinishEvent) => {
    if (secondsToFinishEvent) {
      const finishEventDateTime = await getDateTime(secondsToFinishEvent)

      return finishEventDateTime
    }
  },
)

export const setStartEventDateTime = createAsyncThunk(
  'ui/setStartEventDateTime',
  async (secondsToStartEvent) => {
    if (secondsToStartEvent) {
      const startEventDateTime = await getDateTime(secondsToStartEvent)

      return startEventDateTime
    }
  },
)

export const setChatMessageReceivedHandler = createAsyncThunk(
  'chat/messageReceivedHandler',
  async (messageHandler) => {
    await CallService.setChatMessageReceivedHandler(messageHandler)
  },
)

export const notifyChatMeesage = createAsyncThunk(
  'chat/notifyChatMeesage',
  async (message, { dispatch }) => {
    const messageSent = await CallService.notifyChannelChatMessage(message)
    if (messageSent) {
      dispatch(addMessageIntoChat({ message: messageSent }))
    }
  },
)

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    messages: [],
    spamControl: {
      dates: [],
      disabled: false,
    },
    lang: 'es',
    isOneToMany: false,
    notificationMessage: [],
    isNotificationVisible: false,
    uiSize: UI_IS_TABLET,
    chat: {
      quotedMessage: null,
      pinnedMessage: null,
      moderatorMenuMessage: {
        message: null,
        mousePosition: null,
      },
      inputDisabled: false,
      autoJoin: true,
    },
    isLikeAnimationVisible: false,
    isLikeButtonVisible: false,
    activeCallCard: '',
    activeCallAction: CALL_ACTION_CHAT,
    videoDimensions: {
      width: null,
      height: null,
      aspectRatio: null,
    },
    carousel: {
      currentRow: 0,
    },
    cart: {
      showCheckoutIframe: false,
    },
    call: {
      onCloseMessage: false,
    },
    countdown: {
      disableStartEvent: false,
      eventStartServerDateTime: null,
      finisEventServerDateTime: null,
    },
    chatError: { showDialog: false, errorCode: null, errorMessage: null, errorTitle: null },
    banUserDialogVisible: false,
    muteUserDialogVisible: false,
    payPalDialogVisible: false,
    payPalButtonMounted: false,
    cannotDeleteMessage: {
      allowDelete: true,
    },
    showStoreInfo: false,
    changeMainVideo: true,
    scrollPosition: 0,
    stockError: false,
    postalCodeErrorMessage: '',
    showDraggable: false,
    showCloseCallDesktop: false,
  },
  reducers: {
    addMessageIntoChat: (state, action) => {
      state.messages.push(action.payload.message)
    },
    cleanChat: (state) => {
      state.messages = []
    },
    checkForSpam: (state) => {
      // If the user sends more than a number of messages
      // in less than some time, disable the user input
      let lastDate = new Date().getTime()

      while (
        state.spamControl.dates.length > 0 &&
        lastDate - state.spamControl.dates[0] > SPAM_MAX_MESSAGES_TIME
      ) {
        state.spamControl.dates.shift()
      }

      state.spamControl.dates.push(lastDate)
      if (state.spamControl.dates.length >= SPAM_MAX_MESSAGES) {
        state.spamControl.disabled = true
      }
    },
    setAutoJoinChat: (state, action) => {
      state.chat.autoJoin = action.payload
    },
    spamControlEnable: (state) => {
      state.spamControl.disabled = false
    },
    setIsNotificationVisible: (state, action) => {
      state.isNotificationVisible = action.payload.isNotificationVisible
    },
    setNotificationMessage: (state, action) => {
      state.notificationMessage = action.payload.notificationMessage
    },
    setUiSize: (state, action) => {
      state.uiSize = action.payload.chatSize
    },
    setQuotedMessage: (state, action) => {
      state.chat.quotedMessage = action.payload.quotedMessage
    },
    disableChatInput: (state) => {
      state.chat.inputDisabled = true
    },
    clearQuotedMessage: (state) => {
      state.chat.quotedMessage = null
    },
    setPinnedMessage: (state, action) => {
      state.chat.pinnedMessage = action.payload
    },
    clearPinnedMessage: (state) => {
      state.chat.pinnedMessage = null
    },
    setModeratorMenuMessage: (state, action) => {
      state.chat.moderatorMenuMessage.message = action.payload
    },
    setMousePosition: (state, action) => {
      state.chat.moderatorMenuMessage.mousePosition = action.payload
    },
    setIsLikeAnimationVisible: (state, action) => {
      state.isLikeAnimationVisible = action.payload.isLikeAnimationVisible
    },
    setIsOneToMany: (state, action) => {
      state.isOneToMany = action.payload.isOneToMany
      state.isLikeButtonVisible = action.payload.isOneToMany
      state.activeCallAction =
        state.uiSize === UI_IS_TABLET
          ? CALL_ACTION_PRODUCTS
          : action.payload.isOneToMany
            ? CALL_ACTION_CHAT
            : CALL_ACTION_CAMERAS
    },
    setActiveCallCard: (state, action) => {
      state.activeCallCard = action.payload
    },
    closeCallCard: (state) => {
      state.activeCallCard = ''
    },
    goToProducts: (state) => {
      state.activeCallCard = CALL_CARD_PRODUCTS
    },
    setActiveCallAction: (state, action) => {
      state.activeCallAction = action.payload
    },
    setVideoDimensions: (state, action) => {
      state.videoDimensions.width = action.payload.width
      state.videoDimensions.height = action.payload.height
      state.videoDimensions.aspectRatio = action.payload.aspectRatio
    },
    setCurrenRowOnCarousel: (state, action) => {
      state.carousel.currentRow = action.payload.currentRow
    },
    showCheckoutIframe: (state) => {
      state.cart.showCheckoutIframe = true
    },
    hideCheckoutIframe: (state) => {
      state.cart.showCheckoutIframe = false
    },
    showOnCloseMessageCall: (state) => {
      state.call.onCloseMessage = true
    },
    hideOnCloseMessageCall: (state) => {
      state.call.onCloseMessage = false
    },
    setShowStoreInfo: (state, action) => {
      state.showStoreInfo = action.payload.showStoreInfo
    },
    setPayPalButtonMounted: (state, action) => {
      state.payPalButtonMounted = action.payload
    },
    setShowAskNameDialog: (state, action) => {
      state.showAskNameDialog = action.payload.showAskNameDialog
    },
    setLanguage: (state, action) => {
      state.lang = action.payload
    },
    setBanUserDialogVisible: (state, action) => {
      state.banUserDialogVisible = action.payload
    },
    setMuteUserDialogVisible: (state, action) => {
      state.muteUserDialogVisible = action.payload
    },
    setPayPalDialogVisible: (state, action) => {
      state.payPalDialogVisible = action.payload
    },
    setCannotDeleteMessage: (state, action) => {
      state.cannotDeleteMessage.allowDelete = action.payload.allowDelete
    },
    hideAskNameDialog: (state) => {
      state.showAskNameDialog = false
    },
    setChatError: (state, action) => {
      const { showDialog, errorCode, errorMessage, errorTitle } = action.payload
      state.chatError.showDialog = showDialog
      state.chatError.errorCode = errorCode
      state.chatError.errorMessage = errorMessage
      state.chatError.errorTitle = errorTitle
    },
    setDisableStartEvent: (state, action) => {
      state.countdown.disableStartEvent = action.payload
    },
    setChangeMainVideo: (state, action) => {
      state.changeMainVideo = action.payload.changeMainVideo
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload
    },
    setMessageCount: (state, action) => {
      state.messageCount = action.payload
    },
    setStockError: (state, action) => {
      state.stockError = action.payload
    },
    setPostalCodeErrorMessage: (state, action) => {
      state.postalCodeErrorMessage = action.payload
    },
    setShowDraggable: (state, action) => {
      state.showDraggable = action.payload
    },
    setCloseCallDesktop: (state, action) => {
      state.showCloseCallDesktop = action.payload
    },
  },
  extraReducers: {
    [setEventStartDateTime.fulfilled]: (state, action) => {
      state.countdown.eventStartServerDateTime = action.payload
    },
    [setStartEventDateTime.fulfilled]: (state, action) => {
      state.countdown.eventStartServerDateTime = action.payload
    },
    [setFinishEventDateTime.fulfilled]: (state, action) => {
      state.countdown.finisEventServerDateTime = action.payload
    },
  },
})

//* ACTIONS
export const {
  setIsNotificationVisible,
  setNotificationMessage,
  setUiSize,
  setChatListIsShown,
  setIsLikeAnimationVisible,
  setIsOneToMany,
  setLanguage,
  setAutoJoinChat,
  setVideoDimensions,
  setCurrenRowOnCarousel,
  showCheckoutIframe,
  hideCheckoutIframe,
  setActiveCallCard,
  closeCallCard,
  setActiveCallAction,
  showOnCloseMessageCall,
  hideOnCloseMessageCall,
  setShowStoreInfo,
  setShowAskNameDialog,
  setBanUserDialogVisible,
  setMuteUserDialogVisible,
  setPayPalDialogVisible,
  setCannotDeleteMessage,
  hideAskNameDialog,
  setChangeMainVideo,
  setScrollPosition,
  setMessageCount,
  addMessageIntoChat,
  cleanChat,
  checkForSpam,
  spamControlEnable,
  disableChatInput,
  setStockError,
  setPostalCodeErrorMessage,
  setShowDraggable,
  setCloseCallDesktop,
  setQuotedMessage,
  clearQuotedMessage,
  setPinnedMessage,
  clearPinnedMessage,
  setPayPalButtonMounted,
  setMousePosition,
  setModeratorMenuMessage,
  setChatError,
  goToProducts,
  setDisableStartEvent,
} = uiSlice.actions

//* SELECTORS
export const selectNotificationMessage = (state) => state.ui.notificationMessage
export const selectIsNotificationVisible = (state) => state.ui.isNotificationVisible
export const selectUiSize = (state) => state.ui.uiSize
export const selectQuotedMessage = (state) => state.ui.chat.quotedMessage
export const selectPinnedMessage = (state) => state.ui.chat.pinnedMessage
export const selectModeratorMenuMessage = (state) => state.ui.chat.moderatorMenuMessage
export const selectIsLikeAnimationVisible = (state) => state.ui.isLikeAnimationVisible
export const selectIsLikeButtonVisible = (state) => state.ui.isLikeButtonVisible
export const selectActiveCallCard = (state) => state.ui.activeCallCard
export const selectActiveCallAction = (state) => state.ui.activeCallAction
export const selectVideoDimensions = (state) => state.ui.videoDimensions
export const selectCurrentRowOnCarousel = (state) => state.ui.carousel.currentRow
export const selectIsCheckoutIframeVisible = (state) => state.ui.cart.showCheckoutIframe
export const selectOnCloseMessageCall = (state) => state.ui.call.onCloseMessage
export const selectCartEnabled = (state) =>
  state.store.current.hasCheckout &&
  (state.store.current.isOneToManySale || state.call.role === CustomerRoles.BUYER)
export const selectShowStoreInfo = (state) => state.ui.showStoreInfo
export const selectPayPalButtonMounted = (state) => state.ui.payPalButtonMounted
export const selectShowAskNameDialog = (state) => state.ui.showAskNameDialog
export const selectBanUserDialogVisible = (state) => state.ui.banUserDialogVisible
export const selectMuteUserDialogVisible = (state) => state.ui.muteUserDialogVisible
export const selectPayPalDialogVisible = (state) => state.ui.payPalDialogVisible
export const selectCannotDeleteMessage = (state) => state.ui.cannotDeleteMessage
export const selectMainVideo = (state) => state.ui.changeMainVideo
export const selectEventStartServerDateTime = (state) => state.ui.countdown.eventStartServerDateTime
export const selectFinishEventServerDateTime = (state) =>
  state.ui.countdown.finisEventServerDateTime
export const selectScrollPosition = (state) => state.ui.scrollPosition
export const selectMessages = (state) => state.ui.messages
export const selectAutoJoinChat = (state) => state.ui.chat.autoJoin
export const selectChatDisabled = (state) => state.ui.spamControl.disabled
export const selectChatMuted = (state) => state.ui.chat.inputDisabled
export const selectIsStockError = (state) => state.ui.stockError
export const selectPostalCodeErrorMessage = (state) => state.ui.postalCodeErrorMessage
export const selectShowDraggable = (state) => state.ui.showDraggable
export const selectCloseCallDesktop = (state) => state.ui.showCloseCallDesktop
export const selectChatError = (state) => state.ui.chatError
export const selectDisableStartEvent = (state) => state.ui.countdown.disableStartEvent
export const selectStoreLang = (state) => state.ui.lang

//* REDUCER
export default uiSlice.reducer
