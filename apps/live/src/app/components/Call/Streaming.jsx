import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CoHostStreaming } from './CoHostStreaming'
import { useOtherBuyers } from '../../hooks/useOtherBuyers'
import { usePIP } from '../../hooks/usePIP'
import { useSelector } from 'react-redux'
import { selectLocalCameraEnabled, selectUsers } from '../../reducers/callSlice'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { CustomerRoles } from '../../constants/customerRoles'

const StreamingContainer = styled.div`
  height: ${({ isCohostOnline, popUpCohostVideo }) =>
    isCohostOnline && !popUpCohostVideo ? '50%' : '100%'};
  width: 100%;
  filter: ${({ blurStreaming, popUpCohostVideo }) =>
    blurStreaming && popUpCohostVideo ? 'blur(4px)' : 'none'};
  div {
    background-color: transparent !important;
  }
`
const VideosContainer = styled.div`
  height: 100%;
  filter: ${({ blurStreaming, popUpCohostVideo }) =>
    blurStreaming && !popUpCohostVideo ? 'blur(4px)' : 'none'};
`

const Streaming = ({ blurStreaming, isCohostUser = false, popUpCohostVideo }) => {
  const { setVideoHandler, setAudioHandler } = useOtherBuyers()
  const { activePIP } = usePIP()
  const users = useSelector(selectUsers)
  const { isOneToManySale } = useSelector(selectCurrentStore)
  const videoEnabled = useSelector(selectLocalCameraEnabled)
  const cohostUser = users.find(
    (user) => user.role === CustomerRoles.COHOST && user.hasVideo === true,
  )
  const cohostStreaming = (isCohostUser && videoEnabled) || (cohostUser && isOneToManySale)

  return (
    <VideosContainer blurStreaming={blurStreaming} popUpCohostVideo={popUpCohostVideo}>
      {cohostStreaming && (
        <CoHostStreaming
          data-test="video-cohost-container"
          activePIP={activePIP}
          setVideoHandler={setVideoHandler}
          setAudioHandler={setAudioHandler}
          isCohostUser={isCohostUser}
          popUpCohostVideo={popUpCohostVideo}
          rtcUID={cohostUser?.rtcUID}
        />
      )}
      <StreamingContainer
        blurStreaming={blurStreaming}
        isCohostOnline={cohostStreaming}
        popUpCohostVideo={popUpCohostVideo}
        id="video__streaming"
        data-test="video-streaming-container"
      />
    </VideosContainer>
  )
}

Streaming.propTypes = {
  children: PropTypes.element,
  blurStreaming: PropTypes.bool,
  isCohostUser: PropTypes.bool,
  popUpCohostVideo: PropTypes.bool,
}

export { Streaming }
