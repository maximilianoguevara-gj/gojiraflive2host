import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'
import { CallStates } from '../constants/callStates'
import to from 'await-to-js'

import {
  selectLocalCameraTrack,
  setLocalCameraTrack,
  enableLocalCameraTrack,
  selectLocalCameraEnabled,
  selectCallState,
  setAudioOrVideoPermission,
  selectAudioOrVideoPermission,
  setVideoPermission,
  selectVideoPermission,
  selectUsers,
} from '../reducers/callSlice'
import callService from '../services/callService'
import { validateDevice } from '../utils/mediaDevicesUtils'
import { useLocation } from 'react-router-dom'
import { useLocalMicrophone } from './useLocalMicrophone'
import { CustomerRoles } from '../constants/customerRoles'

const useLocalCamera = () => {
  const dispatch = useDispatch()
  const { closeMicrophone } = useLocalMicrophone()
  const track = useSelector(selectLocalCameraTrack)
  const enabled = useSelector(selectLocalCameraEnabled)
  const callState = useSelector(selectCallState)
  const videoPermission = useSelector(selectVideoPermission)
  const audioOrVideoPermission = useSelector(selectAudioOrVideoPermission)
  const users = useSelector(selectUsers)
  const cohostUser = users.find(
    (user) => user.role === CustomerRoles.COHOST && user.hasVideo === true,
  )
  const location = useLocation()
  const isCohostUser = location.state?.isCohostUser

  useEffect(() => {
    if (callState === CallStates.CALL_STARTED && track !== null) {
      callService.publishTrack(track)
    }
  }, [track])

  const startLocalCamera = async () => {
    const track = await callService.startLocalVideo(isMobile, isCohostUser)
    dispatch(setLocalCameraTrack(track))
    dispatch(enableLocalCameraTrack(true))
  }

  const getFrontCamera = (camera) =>
    camera.label.toLowerCase().includes('front') || camera.label.toLowerCase().includes('frontal')

  const getBackCamera = (camera) =>
    camera.label.toLowerCase().includes('back') || camera.label.toLowerCase().includes('trasera')

  const getNextCamera = async (cameras, currentCamera) => {
    return cameras.find((camera) => {
      const frontCamera = getFrontCamera(camera)
      const backCamera = getBackCamera(camera)
      const frontCurrentCamera = getFrontCamera(currentCamera)
      return frontCurrentCamera ? backCamera : frontCamera
    })
  }

  const closeCamera = async () => {
    await track?.stop()
    dispatch(enableLocalCameraTrack(false))
    dispatch(setLocalCameraTrack(null))
  }

  const switchCamera = async () => {
    const cameras = await callService.getCamerasDevices()
    const currentCamera = await track.getMediaStreamTrack()
    const nextCamera = await getNextCamera(cameras, currentCamera)
    try {
      await track.setDevice(nextCamera.deviceId)
    } catch (error) {
      console.log(error)
    }
  }

  const validateVideo = async () => {
    const [error, mediaDeviceAudio] = await to(
      validateDevice({
        video: true,
      }),
    )
    if (error || !mediaDeviceAudio.active) {
      dispatch(enableLocalCameraTrack(false))
      dispatch(setAudioOrVideoPermission(true))
    } else {
      dispatch(setVideoPermission(true))
      await startLocalCamera()
    }
  }

  const toggleCamera = async () => {
    if (isCohostUser && cohostUser) return
    if (!videoPermission && !audioOrVideoPermission) {
      await validateVideo()
    } else if (track) {
      const enabled = !track.enabled
      await track.setEnabled(enabled)
      dispatch(enableLocalCameraTrack(enabled))
      if (isCohostUser) closeMicrophone()
    } else {
      await startLocalCamera()
    }
  }

  return {
    toggleCamera,
    closeCamera,
    switchCamera,
    track,
    enabled,
  }
}

export { useLocalCamera }
