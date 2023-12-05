import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt'
import { usePIP } from '../../hooks/usePIP'
import { TopNavBarButton } from './Buttons/TopNavBarButton'
import { IconButton } from '@material-ui/core'

const PIPButton = ({ isMobile }) => {
  const { handlerPIP } = usePIP()

  return (
    <>
      {isMobile ? (
        <TopNavBarButton
          id="PIP-video-toogle-button"
          data-test="PIP-video-toogle-button"
          onClick={handlerPIP}
        >
          <PIPIcon />
        </TopNavBarButton>
      ) : (
        <PIPDesktopButton
          id="PIP-video-toogle-button"
          data-test="PIP-video-toogle-button"
          onClick={handlerPIP}
          size="small"
        >
          <PIPIcon />
        </PIPDesktopButton>
      )}
    </>
  )
}

const PIPDesktopButton = styled(IconButton)``

const PIPIcon = styled(PictureInPictureAltIcon)`
  color: #fff;
`

PIPButton.propTypes = {
  isMobile: PropTypes.bool.isRequired,
}

export { PIPButton }
