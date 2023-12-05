import React, { useRef, useEffect } from 'react'
import { Container, StyledVideocamOff, UsersNames } from './style'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const Video = ({ isMobile, track, userName, usersCount }) => {
  const container = useRef(null)
  const { t } = useTranslation()
  const firstLetter = userName.charAt(0).toUpperCase()
  const usersNames = userName == t('chat.localBuyer') ? userName : firstLetter

  useEffect(() => {
    if (!track) return

    track.play(container.current)
    return () => track.stop()
  }, [track])

  if (track) {
    return <Container ref={container} videoIsOn isMobile={isMobile} />
  } else {
    return (
      <Container isMobile={isMobile}>
        <StyledVideocamOff isMobile={isMobile} usersCount={usersCount} data-test="cam-title">
          <UsersNames isMobile={isMobile}>{usersNames}</UsersNames>
        </StyledVideocamOff>
      </Container>
    )
  }
}

Video.propTypes = {
  isMobile: PropTypes.bool,
  track: PropTypes.object,
  userName: PropTypes.string,
  usersCount: PropTypes.number,
}

export { Video }
