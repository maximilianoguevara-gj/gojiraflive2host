import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import StoreService from '../services/storeService'
import { setMobileChatConnected } from './callSlice'
import { setAutoJoinChat, setIsOneToMany, setEventStartDateTime } from './uiSlice'
import { setTermsAndConditions } from './callSlice'
import { useStore } from 'state'

//* ASYNC THUNK ACTIONS
export const getStoreById = createAsyncThunk(
  'store/getStoreById',
  async (storeId, { dispatch }) => {
    dispatch(setStoreId(storeId))
    try {
      const { store } = await StoreService.getStoreById(storeId)
      dispatch(setEventStartDateTime(store.remainingSeconds))
      dispatch(
        setTermsAndConditions({
          countryCode: store.countryCode,
          customTermsAndConditions: store.storeConfigurations.features.termsAndConditions.active,
        }),
      )
      dispatch(setAutoJoinChat(store.autoJoinChat))
      dispatch(setMobileChatConnected(store.autoJoinChat))
      dispatch(setIsOneToMany({ isOneToMany: store.isOneToManySale }))
      useStore.setState({ store })
      return store
    } catch (error) {
      console.error(error)
      return null
    }
  },
)

export const getStoreIsOpen = createAsyncThunk('store/getStoreIsOpen', async (storeId) => {
  const response = await StoreService.getStoreIsOpen(storeId)

  return response.data
})

export const callStore = createAsyncThunk('store/callStore', async (storeId) => {
  const response = await StoreService.callStore(storeId)
  return response
})

export const setFinishEventCountdown = createAsyncThunk(
  'store/setFinishEventCountdown',
  async (data) => {
    const response = await StoreService.setFinishEventCountdown(data)
    return response
  },
)

export const setStartEventCountdown = createAsyncThunk(
  'store/setStartEventCountdown',
  async (data) => {
    const response = await StoreService.setStartEventCountdown(data)
    return response
  },
)

export const setDisplayPopUp = createAsyncThunk('store/setDisplayPopUp', async (data) => {
  const response = await StoreService.setDisplayPopUp(data)
  return response
})

export const storeSlice = createSlice({
  name: 'store',
  initialState: {
    id: null,
    current: null,
    currentVideoTrack: null,
    error: '',
    status: '',
    sellerIsAvailable: { isAvailable: true, meetingIsFull: false, eventOnGoing: false },
  },
  reducers: {
    setSellerVideoTrack: (state, action) => {
      state.sellerVideoTrack = action.payload.sellerVideoTrack
    },
    setStoreId: (state, action) => {
      state.id = action.payload
    },
    setSellerIsAvailable: (state, action) => {
      state.sellerIsAvailable.isAvailable = action.payload
    },
    setEventOnGoing: (state, action) => {
      state.sellerIsAvailable.eventOnGoing = action.payload
    },
    setMeetingIsFull: (state, action) => {
      state.sellerIsAvailable.meetingIsFull = action.payload
    },
  },
  extraReducers: {
    [getStoreIsOpen.fulfilled]: (state, action) => {
      state.current = action.payload
    },
    [getStoreIsOpen.rejected]: (state, action) => {
      state.error = action.error.message
    },
    [getStoreById.fulfilled]: (state, action) => {
      state.current = action.payload
    },
    [getStoreById.rejected]: (state, action) => {
      state.error = action.error.message
    },
    [callStore.fulfilled]: (state, action) => {
      state.status = action.payload.state
    },
    [callStore.rejected]: (state, action) => {
      state.error = action.error.message
    },
  },
})

//* ACTIONS

export const {
  setSellerVideoTrack,
  setStoreId,
  setSellerIsAvailable,
  setMeetingIsFull,
  setEventOnGoing,
} = storeSlice.actions

//* SELECTORS
export const selectCurrentStore = (state) => state.store.current
export const selectStoreId = (state) => state.store.current.id
export const selectStoreError = (state) => state.store.error
export const selectCurrentStoreImage = (state) => state.store.current?.logoUrl
export const selectSellerVideoTrack = (state) => state.store.sellerVideoTrack
export const selectChatVersion = (state) =>
  state.store.current?.storeConfigurations?.features?.chat?.type
export const selectSellerIsAvailable = (state) => state.store.sellerIsAvailable

//* REDUCER
export default storeSlice.reducer
