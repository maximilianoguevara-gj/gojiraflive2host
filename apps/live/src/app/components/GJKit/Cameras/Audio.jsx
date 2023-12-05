import React, { useEffect, useState } from 'react'
import { AudioBorder, MuteIndicator } from './style'
import PropTypes from 'prop-types'
import { GraphicEq, MicOffOutlined } from '@material-ui/icons'

const AUDIO_CHECK_MS = 500
const AUDIO_SPEAKING_THRESHOLD = 0.5

const Audio = ({ isMobile, track, dontPlay = false }) => {
  const [intervalId, setIntervalId] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (!track) {
      intervalId && clearInterval(intervalId)
      setIsSpeaking(false)
    } else {
      dontPlay || track.play()
      setIntervalId(setInterval(checkVolume, AUDIO_CHECK_MS))

      return () => dontPlay || track.stop()
    }
  }, [track])

  const checkVolume = () => {
    if (track.getVolumeLevel() > AUDIO_SPEAKING_THRESHOLD) {
      setIsSpeaking(true)
    } else {
      setIsSpeaking(false)
    }
  }

  return (
    <AudioBorder isMobile={isMobile} isSpeaking={isSpeaking}>
      <MuteIndicator data-test="mute-liveChat">
        {track ? <GraphicEq fontSize="small" /> : <MicOffOutlined fontSize="small" />}
      </MuteIndicator>
    </AudioBorder>
  )
}

Audio.propTypes = {
  isMobile: PropTypes.bool,
  track: PropTypes.object,
  dontPlay: PropTypes.bool,
}

export { Audio }
