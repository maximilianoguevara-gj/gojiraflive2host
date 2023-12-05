import React from 'react'
import PropTypes from 'prop-types'
import { CloseCall } from './CloseCall'
import { PIPButton } from '../GJKit/PIPButton'
import { ConfigButton } from './DesktopCards/ConfigButton'
import { TopNavBarContainer } from './Layout.styles'
import { usePIP } from '../../hooks/usePIP'

export const TopNavBar = ({
  isDesktop = false,
  isModerator,
  dispatchFinishCountdown,
  dispatchStartCountdown,
  dispatchPopUp,
  onCallFinished,
}) => {
  const { canPIP, disablePIP } = usePIP()
  return (
    <TopNavBarContainer isDesktop={isDesktop}>
      {isModerator && (
        <ConfigButton
          dispatchFinishCountdown={dispatchFinishCountdown}
          dispatchStartCountdown={dispatchStartCountdown}
          dispatchPopUp={dispatchPopUp}
        />
      )}
      {!isDesktop && canPIP() && !disablePIP ? <PIPButton isMobile={!isDesktop} /> : null}
      <CloseCall onCallFinished={onCallFinished} />
    </TopNavBarContainer>
  )
}

TopNavBar.propTypes = {
  isModerator: PropTypes.bool.isRequired,
  onCallFinished: PropTypes.func.isRequired,
  isDesktop: PropTypes.bool,
  dispatchFinishCountdown: PropTypes.func,
  dispatchStartCountdown: PropTypes.func,
  dispatchPopUp: PropTypes.func,
}
