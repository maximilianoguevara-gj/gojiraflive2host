import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useViews } from 'state'
import { CartCount } from 'ui'
import { Like } from './Like'
import {
  FavoriteBorder,
  PeopleAltOutlined,
  PeopleAlt,
  LocalMall,
  LocalMallOutlined,
} from '@material-ui/icons'
import Badge from '@mui/material/Badge'

import { selectCurrentStore } from '../../reducers/storeSlice'
import {
  notifyLikeMeesage,
  selectIsLikeButtonVisible,
  selectUiSize,
  UI_IS_TABLET,
} from '../../reducers/uiSlice'
import ShareButton from './ShareButton'
import { RoundedButton } from '../Kit/Buttons'
import { device } from '../../constants/devices'
import { ChatButton } from './ChatButton'
import { selectUserCount } from '../../reducers/callSlice'
import { PIPButton } from '../GJKit/PIPButton'
import { usePIP } from '../../hooks/usePIP'
import { MobileIconsMenu } from './MobileIconsMenu'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'
import { useCheckout } from '../../hooks/useCheckout'
import { useChat } from '../../hooks/useChat'
import { useAuth } from '@gojiraf/auth'

export const ActionBar = ({ initChat }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const dispatch = useDispatch()
  const store = useSelector(selectCurrentStore)
  const { isOneToManySale } = store
  const { isLightIntegration } = useCheckout(store)
  const isLikeButtonVisible = useSelector(selectIsLikeButtonVisible)
  const uiSize = useSelector(selectUiSize)
  const usersCount = useSelector(selectUserCount)
  const { state, send } = useViews()
  const { canPIP, disablePIP } = usePIP()
  const isMobile = uiSize === UI_IS_TABLET
  const { sendEventPostToElastic } = useElasticEventTracker()
  const { user } = useAuth()

  const showLike = () => {
    gaEventTracker('InCall', 'like-button')
    sendEventPostToElastic('like-button')
    matomoTrackEvent('InCall', 'like-button')
    dispatch(notifyLikeMeesage())
  }

  const showParticipants = () => {
    gaEventTracker('InCall', 'show-participants-cameras-button')
    matomoTrackEvent('InCall', 'show-participants-cameras-button')
    send({ type: 'SHOW_PARTICIPANTS' })
  }

  const showProducts = () => {
    gaEventTracker('InCall > Products', 'toggle-products-button')
    matomoTrackEvent('InCall > Products', 'toggle-products-button')
    send({ type: 'SHOW_PRODUCTS' })
  }

  const { channelDeleted } = useChat({ user, isDesktop: true }) //TODO: probar OTO / OTF

  return (
    <ActionBarContainer>
      {(!isOneToManySale || isMobile) && !channelDeleted && <ChatButton initChat={initChat} />}

      {!isOneToManySale && (
        <RoundedButton
          color="secondary"
          onClick={() => showParticipants()}
          id="show-participants-cameras-button"
          data-test="show-participants-cameras-button"
        >
          <StyledBadge badgeContent={usersCount} max="99">
            {state.matches('secondary.showingParticipants') === true ? (
              <PeopleAlt />
            ) : (
              <PeopleAltOutlined />
            )}
          </StyledBadge>
        </RoundedButton>
      )}

      {!isMobile && <Spacer />}

      {isMobile && (
        <RoundedButton
          color="secondary"
          onClick={() => showProducts()}
          id="toggle-products-button"
          data-test="toggle-products-button"
        >
          {state.matches('secondary.showingProducts') === true ? (
            <LocalMall />
          ) : (
            <LocalMallOutlined />
          )}
        </RoundedButton>
      )}

      {isMobile &&
        !isLightIntegration &&
        (state.matches('secondary.showingCart') === true ? (
          <CartCount className="text-white bg-white fill-white" />
        ) : (
          <CartCount className="text-white" />
        ))}

      {!isMobile && canPIP() && !disablePIP && <PIPButton isMobile={false} />}

      {!isMobile && <ShareButton />}

      {isLikeButtonVisible && (
        <>
          <RoundedButton
            id="like-button"
            color="secondary"
            aria-label="Favorite"
            onClick={showLike}
          >
            <Like data-test="like-button" />
            <FavoriteBorder />
          </RoundedButton>
        </>
      )}

      {isMobile && <MobileIconsMenu />}
    </ActionBarContainer>
  )
}

const ActionBarContainer = styled.div`
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  @media ${device.laptop} {
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 0, 0, 0.5) 5rem,
      rgba(0, 0, 0, 0.5) 100%
    );
    padding-top: 5rem !important;
  }
`

const Spacer = styled.div`
  flex-grow: 1;
`

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    fontFamily: 'Montserrat',
    backgroundColor: '#000',
  },
}))

ActionBar.propTypes = {
  initChat: PropTypes.func,
}
