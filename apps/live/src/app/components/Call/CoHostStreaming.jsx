import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CoHostUserBox } from '../GJKit/Cameras/Cohost/CoHostUserBox'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectLocalCameraEnabled,
  selectLocalCameraTrack,
  selectLocalMicrophoneEnabled,
  selectLocalMicrophoneTrack,
  setVideoState,
} from '../../reducers/callSlice'

export const CoHostStreaming = ({
  rtcUID = null,
  activePIP,
  setVideoHandler,
  setAudioHandler,
  popUpCohostVideo,
  isCohostUser,
}) => {
  const [videoTrack, setVideoTrack] = useState(null)
  const [audioTrack, setAudioTrack] = useState(null)
  const dispatch = useDispatch()
  const audioEnabled = useSelector(selectLocalMicrophoneEnabled)
  const videoEnabled = useSelector(selectLocalCameraEnabled)
  const localAudioTrack = useSelector(selectLocalMicrophoneTrack)
  const localVideoTrack = useSelector(selectLocalCameraTrack)
  const getLocalVideoTrack = videoEnabled ? localVideoTrack : null
  const getLocalAudioTrack = audioEnabled ? localAudioTrack : null

  const getCurrentVideoTrack = () => {
    if (rtcUID) return videoTrack
    if (isCohostUser) return getLocalVideoTrack
  }

  const getCurrentAudioTrack = () => {
    if (rtcUID) return audioTrack
    if (isCohostUser) return getLocalAudioTrack
  }

  useEffect(() => {
    if (rtcUID) {
      setVideoHandler(rtcUID, setVideoTrack)
      return () => setVideoHandler(rtcUID, undefined)
    }
  }, [rtcUID])

  useEffect(() => {
    if (rtcUID) {
      setAudioHandler(rtcUID, setAudioTrack)
      return () => setAudioHandler(rtcUID, undefined)
    }
  }, [rtcUID])

  useEffect(() => {
    if (rtcUID) dispatch(setVideoState({ rtcUID, videoTrack }))
  }, [videoTrack])

  return (
    <CoHostUserBox
      activePIP={activePIP}
      isCohostUser={isCohostUser}
      popUpCohostVideo={popUpCohostVideo}
      audioTrack={getCurrentAudioTrack()}
      videoTrack={getCurrentVideoTrack()}
    />
  )
}

CoHostStreaming.propTypes = {
  activePIP: PropTypes.bool,
  rtcUID: PropTypes.number,
  isCohostUser: PropTypes.bool,
  popUpCohostVideo: PropTypes.bool,
  setVideoHandler: PropTypes.func,
  setAudioHandler: PropTypes.func,
}
