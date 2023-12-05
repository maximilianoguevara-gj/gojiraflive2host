import React from 'react'
import Draggable from 'react-draggable'
import { CoHostContainer, PopUpCohostVideoDrag } from '../style'
import PropTypes from 'prop-types'
import { CoHostVideo } from './CoHostVideo'
import { CoHostAudio } from './CoHostAudio'
import { UI_IS_TABLET, selectUiSize } from '../../../../reducers/uiSlice'
import { useSelector } from 'react-redux'
import { MoveDrag } from '../../../../assets/svg/MoveDrag'

const CoHostUserBox = ({ activePIP, audioTrack, popUpCohostVideo, isCohostUser, videoTrack }) => {
  const isMobile = useSelector(selectUiSize) === UI_IS_TABLET
  return (
    <>
      {popUpCohostVideo ? (
        <Draggable>
          <PopUpCohostVideoDrag activePIP={activePIP} isMobile={isMobile}>
            <MoveDrag />
            <CoHostAudio dontPlay={isCohostUser} track={audioTrack} />
            <CoHostVideo track={videoTrack} />
          </PopUpCohostVideoDrag>
        </Draggable>
      ) : (
        <CoHostContainer activePIP={activePIP}>
          <CoHostAudio dontPlay={isCohostUser} track={audioTrack} />
          <CoHostVideo track={videoTrack} />
        </CoHostContainer>
      )}
    </>
  )
}

CoHostUserBox.propTypes = {
  activePIP: PropTypes.bool,
  audioTrack: PropTypes.func,
  videoTrack: PropTypes.func,
  isCohostUser: PropTypes.bool,
  popUpCohostVideo: PropTypes.bool,
}

export { CoHostUserBox }
