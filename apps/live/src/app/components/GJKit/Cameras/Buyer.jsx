import React, { useEffect, useState } from 'react'
import { StyledUserBox } from './style'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setVideoState } from '../../../reducers/callSlice'

const Buyer = ({ user = {}, setVideoHandler, setAudioHandler, ...props }) => {
  const dispatch = useDispatch()
  const { userName = '', rtcUID } = user
  const [videoTrack, setVideoTrack] = useState(null)
  const [audioTrack, setAudioTrack] = useState(null)

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
    dispatch(setVideoState({ rtcUID, videoTrack }))
  }, [videoTrack])

  return (
    <StyledUserBox userName={userName} audioTrack={audioTrack} videoTrack={videoTrack} {...props} />
  )
}

Buyer.propTypes = {
  user: PropTypes.object,
  setVideoHandler: PropTypes.func,
  setAudioHandler: PropTypes.func,
}

export { Buyer }
