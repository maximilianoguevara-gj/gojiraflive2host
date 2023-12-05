import React, { useRef, useEffect } from 'react'
import { Container } from '../style'
import PropTypes from 'prop-types'

const CoHostVideo = ({ track }) => {
  const container = useRef(null)

  useEffect(() => {
    if (!track) return
    track.play(container.current, { mirror: false })
    return () => track.stop()
  }, [track])

  if (track) {
    return <Container ref={container} videoIsOn />
  } else {
    return <Container />
  }
}

CoHostVideo.propTypes = {
  track: PropTypes.object,
  userName: PropTypes.string,
  usersCount: PropTypes.number,
}

export { CoHostVideo }
