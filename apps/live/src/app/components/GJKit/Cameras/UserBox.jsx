import React from 'react'
import { ContainerUserBox, UserNameContainer, UserName } from './style'
import PropTypes from 'prop-types'
import { Video } from './Video'
import { Audio } from './Audio'
import { useSelector } from 'react-redux'
import { selectUiSize, UI_IS_TABLET } from '../../../reducers/uiSlice'

const UserBox = ({ userName, audioTrack, videoTrack, dontPlay, usersCount, ...props }) => {
  const uiSize = useSelector(selectUiSize)
  const isMobile = uiSize === UI_IS_TABLET

  return (
    <ContainerUserBox {...props}>
      <Audio isMobile={isMobile} track={audioTrack} dontPlay={dontPlay} />
      <Video isMobile={isMobile} track={videoTrack} userName={userName} usersCount={usersCount} />
      <UserNameContainer isMobile={isMobile}>
        <UserName isMobile={isMobile}>{userName}</UserName>
      </UserNameContainer>
    </ContainerUserBox>
  )
}

UserBox.propTypes = {
  userName: PropTypes.string,
  audioTrack: PropTypes.func,
  videoTrack: PropTypes.func,
  dontPlay: PropTypes.bool,
  usersCount: PropTypes.number,
}

export { UserBox }
