import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Popper } from '@material-ui/core'
import { ConfigIconSVG } from '../../../assets/svg/ConfigIconSVG'
import { ConfigMenu } from '../../GJKit/Moderator/ConfigMenu'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const ConfigButton = ({ dispatchFinishCountdown, dispatchStartCountdown, dispatchPopUp }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const [anchorEl, setAnchorEl] = useState(null)
  const [arrowRef, setArrowRef] = useState(null)
  const open = Boolean(anchorEl)

  const handlePopover = (event) => {
    gaEventTracker('Moderator', 'click-config-tools')
    matomoTrackEvent('Moderator', 'click-config-tools')
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <>
      <ConfigButtonIcon data-test="config-button" onClick={handlePopover}>
        <ConfigIconSVG />
      </ConfigButtonIcon>
      <StyledPopper
        placement="bottom-end"
        open={open}
        anchorEl={anchorEl}
        modifiers={{
          flip: {
            enabled: false,
          },
          arrow: {
            enabled: true,
            element: arrowRef,
          },
        }}
        transition
      >
        <Arrow className="arrow" ref={setArrowRef}></Arrow>
        <ConfigMenu
          dispatchFinishCountdown={dispatchFinishCountdown}
          dispatchStartCountdown={dispatchStartCountdown}
          dispatchPopUp={dispatchPopUp}
        />
      </StyledPopper>
    </>
  )
}

const ConfigButtonIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const StyledPopper = styled(Popper)`
  z-index: 1;
  margin-top: 0.875rem;
  min-width: 340px;
  border-radius: 8px;
  box-shadow: 1px 4px 3px 0px rgba(0, 0, 0, 0.5);
  .arrow {
    top: 0;
    left: 0;
    margin-top: -0.75rem;
    width: 2.5rem;
    height: 0;
    &:before {
      border-width: 0 0.625rem 0.75rem 0.625rem;
      border-color: transparent transparent rgba(242, 242, 242, 1) transparent;
    }
  }
`
const Arrow = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  &:before {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
`

ConfigButton.propTypes = {
  dispatchFinishCountdown: PropTypes.func.isRequired,
  dispatchStartCountdown: PropTypes.func.isRequired,
  dispatchPopUp: PropTypes.func.isRequired,
}

export { ConfigButton }
