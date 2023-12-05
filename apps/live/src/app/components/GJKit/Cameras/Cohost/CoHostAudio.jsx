import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const CoHostAudio = ({ track, dontPlay }) => {
  useEffect(() => {
    if (track && !dontPlay) {
      track.play()
    }
    return () => track?.stop()
  }, [track])

  return <></>
}

CoHostAudio.propTypes = {
  track: PropTypes.object,
  dontPlay: PropTypes.bool,
}

export { CoHostAudio }
