import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeUser, setCohostVideoState } from '../reducers/callSlice'
import { selectCurrentStore } from '../reducers/storeSlice'

import callService, { CallServiceEvents } from '../services/callService'

const useOtherBuyers = () => {
  const [buyers, _setBuyers] = useState({})
  const buyersRef = useRef(buyers)
  const dispatch = useDispatch()
  const { isOneToManySale } = useSelector(selectCurrentStore)

  const setBuyers = (buyers) => {
    _setBuyers(buyers)
    buyersRef.current = buyers
  }

  const [videoHandlers, _setVideoHandlers] = useState({})
  const videoHandlersRef = useRef(videoHandlers)
  const setVideoHandlers = (videoHandlers) => {
    _setVideoHandlers(videoHandlers)
    videoHandlersRef.current = videoHandlers
  }

  const [audioHandlers, _setAudioHandlers] = useState({})
  const audioHandlersRef = useRef(audioHandlers)
  const setAudioHandlers = (audioHandlers) => {
    _setAudioHandlers(audioHandlers)
    audioHandlersRef.current = audioHandlers
  }

  const [usersList, setUsersList] = useState([])

  useEffect(() => {
    callService.on(CallServiceEvents.BUYER_PUBLISHED_MICROPHONE, buyerPublishedMicrophone)
    callService.on(CallServiceEvents.BUYER_UNPUBLISHED_MICROPHONE, buyerUnpublishedMicrophone)
    callService.on(CallServiceEvents.BUYER_PUBLISHED_CAMERA, buyerPublishedCamera)
    callService.on(CallServiceEvents.BUYER_UNPUBLISHED_CAMERA, buyerUnpublishedCamera)
    callService.on(CallServiceEvents.BUYER_JOINED, addBuyer)
    callService.on(CallServiceEvents.BUYER_LEFT, removeBuyer)
    return () => {
      callService.off(CallServiceEvents.BUYER_PUBLISHED_MICROPHONE, buyerPublishedMicrophone)
      callService.off(CallServiceEvents.BUYER_UNPUBLISHED_MICROPHONE, buyerUnpublishedMicrophone)
      callService.off(CallServiceEvents.BUYER_PUBLISHED_CAMERA, buyerPublishedCamera)
      callService.off(CallServiceEvents.BUYER_UNPUBLISHED_CAMERA, buyerUnpublishedCamera)
      callService.off(CallServiceEvents.BUYER_JOINED, addBuyer)
      callService.off(CallServiceEvents.BUYER_LEFT, removeBuyer)
    }
  }, [])

  useEffect(async () => {
    for (const [uid, buyer] of Object.entries(buyers)) {
      const videoHandler = videoHandlers[uid]
      const audioHandler = audioHandlers[uid]
      if (videoHandler) {
        if (buyer.videoTrack) {
          videoHandler(buyer.videoTrack)
        } else if (buyer?.hasVideo) {
          callService.subscribeToVideo(buyer).then(videoHandler)
        }
      }
      if (audioHandler) {
        if (buyer.audioTrack) {
          audioHandler(buyer.audioTrack)
        } else if (buyer?.hasAudio) {
          callService.subscribeToAudio(buyer).then(audioHandler)
        }
      }
    }
  }, [buyers, videoHandlers, audioHandlers])

  useEffect(() => {
    const getBuyers = async () => {
      setBuyers(await callService.getOtherBuyers())
    }
    getBuyers()
  }, [])

  const addBuyer = (buyer) => {
    setBuyers({ ...buyersRef.current, [buyer.uid]: buyer })
  }

  const removeBuyer = (uid) => {
    let buyers = { ...buyersRef.current }
    delete buyers[uid]
    setBuyers(buyers)
    dispatch(
      removeUser({
        userUid: uid,
      }),
    )
  }

  const buyerPublishedCamera = (uid, track) => {
    // this dispatch mounts the camera of the cohost user when he publshes his camera
    if (isOneToManySale) dispatch(setCohostVideoState({ rtcUID: uid, videoState: true }))
    const handler = videoHandlersRef.current[uid]
    if (handler) handler(track)
  }

  const buyerUnpublishedCamera = (uid) => {
    // this dispatch unmounts the camera of the cohost user when he unpublshes his camera
    if (isOneToManySale) dispatch(setCohostVideoState({ rtcUID: uid, videoState: false }))
    const handler = videoHandlersRef.current[uid]
    if (handler) handler(null)
  }

  const setVideoHandler = (uid, handler) => {
    setVideoHandlers({ ...videoHandlersRef.current, [uid]: handler })
  }

  const buyerPublishedMicrophone = (uid, track) => {
    const handler = audioHandlersRef.current[uid]
    if (handler) handler(track)
  }

  const buyerUnpublishedMicrophone = (uid) => {
    const handler = audioHandlersRef.current[uid]
    if (handler) handler(null)
  }

  const setAudioHandler = (uid, handler) => {
    setAudioHandlers({ ...audioHandlersRef.current, [uid]: handler })
  }

  const usersFilter = (users, lastVideo) => {
    const videoLast = users.filter((user) => user.videoState && user.rtcUID === lastVideo)
    const videoOn = users.filter((user) => user.videoState && user.rtcUID !== lastVideo)
    const videoOff = users.filter((user) => !user.videoState)
    setUsersList(videoLast.concat(videoOn, videoOff))
  }

  return { buyers, setVideoHandler, setAudioHandler, usersFilter, usersList }
}

export { useOtherBuyers }
