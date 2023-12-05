import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import to from 'await-to-js'

import { CallStates } from '../constants/callStates'
import {
  selectLocalMicrophoneTrack,
  setLocalMicrophoneTrack,
  enableLocalMicrophoneTrack,
  selectLocalMicrophoneEnabled,
  selectCallState,
  setMutedByPeer,
  selectMutedByPeer,
  setAudioOrVideoPermission,
  selectAudioOrVideoPermission,
  setAudioPermission,
  selectAudioPermission,
  selectLocalCameraEnabled,
} from '../reducers/callSlice'
import callService from '../services/callService'
import { validateDevice } from '../utils/mediaDevicesUtils'
import { useLocation } from 'react-router-dom'

const useLocalMicrophone = () => {
  const dispatch = useDispatch()
  const videoEnabled = useSelector(selectLocalCameraEnabled)
  const track = useSelector(selectLocalMicrophoneTrack)
  const enabled = useSelector(selectLocalMicrophoneEnabled)
  const callState = useSelector(selectCallState)
  const microphonePermission = useSelector(selectAudioPermission)
  const audioOrVideoPermission = useSelector(selectAudioOrVideoPermission)
  const mutedBySeller = useSelector(selectMutedByPeer)
  const location = useLocation()
  const isCohostUser = location.state?.isCohostUser

  useEffect(async () => {
    if (mutedBySeller && track && enabled) {
      await toggleMicrophone()
    }
    dispatch(setMutedByPeer(false))
  }, [mutedBySeller])

  useEffect(() => {
    if (callState === CallStates.CALL_STARTED && track !== null) {
      callService.publishTrack(track)
    }
  }, [track])

  const startMicrophone = async () => {
    if (isCohostUser && !videoEnabled) return
    const track = await callService.startLocalAudio()
    dispatch(setLocalMicrophoneTrack(track))
    dispatch(enableLocalMicrophoneTrack(true))
  }

  const validateMicrophone = async () => {
    const [error, mediaDeviceAudio] = await to(
      validateDevice({
        audio: true,
      }),
    )
    if (error || !mediaDeviceAudio.active) {
      dispatch(enableLocalMicrophoneTrack(false))
      dispatch(setAudioOrVideoPermission(true))
    } else {
      dispatch(setAudioPermission(true))
      await startMicrophone()
    }
  }

  const toggleMicrophone = async () => {
    if (!microphonePermission && !audioOrVideoPermission) {
      validateMicrophone()
    } else if (track) {
      const enabled = !track.enabled
      await track.setEnabled(enabled)
      dispatch(enableLocalMicrophoneTrack(enabled))
    } else {
      await startMicrophone()
    }
  }

  return {
    toggleMicrophone,
    closeMicrophone: async () => {
      track?.close()
      dispatch(setLocalMicrophoneTrack(null))
      dispatch(enableLocalMicrophoneTrack(false))
    },
  }
}

export { useLocalMicrophone }
