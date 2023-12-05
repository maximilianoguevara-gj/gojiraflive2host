import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { useProducts, FeatureProduct, usePDP, getBadgeDiscount } from 'ui'
import { useViews } from 'state'
import { StoreInfoFloating } from '../storeInfoFloating'
import { CallBottomContainer } from './BottomContainer'
import { LocalMediaControls } from '../GJKit/LocalMedia/LocalMediaControls'
import { selectCurrentStore } from '../../reducers/storeSlice'
import {
  selectEventStartServerDateTime,
  selectFinishEventServerDateTime,
  selectShowStoreInfo,
  selectUiSize,
  UI_IS_LAPTOP,
  UI_IS_TABLET,
} from '../../reducers/uiSlice'
import { EventTimer } from '../Countdown/EventTimer'
import { CustomerRoles } from '../../constants/customerRoles'
import { useFinishEventCountdown } from '../../hooks/useFinishEventCountdown'
import { useStartEventCountdown } from '../../hooks/useStartEventCountdown'
import { BaseCallLayout, MainContent, Row } from './Layout.styles'
import { TopNavBar } from './TopNavBar'
import { PopUp } from '../GJKit/PopUp'
import { usePopUp } from '../../hooks/usePopUp'
import { useAuth } from '@gojiraf/auth'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'
import { leaveCall, setDisplayStartEventCountdown } from '../../reducers/callSlice'
import { EventLogs } from '../../constants/eventLogs'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const CallLayout = ({
  onCallFinished,
  children,
  className,
  loading,
  toggleMicrophone,
  toggleCamera,
}) => {
  const { t } = useTranslation()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { displayFinishEventCountdown, dispatchFinishCountdown } = useFinishEventCountdown()
  const { displayStartEventCountdown, dispatchStartCountdown } = useStartEventCountdown()
  const { displayPopUp, dispatchPopUp } = usePopUp()
  const dispatch = useDispatch()
  const showStoreInfo = useSelector(selectShowStoreInfo)
  const finishEventServerDateTime = useSelector(selectFinishEventServerDateTime)
  const startEventServerDateTime = useSelector(selectEventStartServerDateTime)
  const { featuredProduct, animateFeaturedProduct } = useProducts()
  const uiSize = useSelector(selectUiSize)
  const { isOneToManySale } = useSelector(selectCurrentStore)
  const { user } = useAuth()
  const isModerator = user.role === CustomerRoles.MODERATOR
  const isMobile = uiSize === UI_IS_TABLET
  const location = useLocation()
  const isCohostUser = location.state?.isCohostUser
  const { send } = useViews()
  const { send: sendPDP } = usePDP()
  const { sendEventPostToElastic } = useElasticEventTracker()

  const handleFeaturedProductClicked = () => {
    gaEventTracker('InCall > Products', `featured-product [${featuredProduct.name}]`)
    matomoTrackEvent('InCall > Products', `featured-product [${featuredProduct.name}]`)
    sendEventPostToElastic('products', `featured-product`, `${featuredProduct.name}`)
    sendPDP({
      type: 'SET_PRODUCT',
      productId: featuredProduct.id,
    })

    send({
      type: 'SHOW_PDP',
    })
  }

  const getBadgeProps = () => {
    const { originalPrice, price } = featuredProduct
    const { discountText, discountValue } = getBadgeDiscount(originalPrice, price)
    const badgeProps = { badgeContent: discountText, badgeVisible: discountValue > 0 }
    return badgeProps
  }

  return (
    <BaseCallLayout data-test="landing-OTM" className={className}>
      {showStoreInfo && (
        <Row>
          <StoreInfoFloating />
          {isMobile ? (
            <TopNavBar
              isModerator={isModerator}
              dispatchFinishCountdown={dispatchFinishCountdown}
              dispatchStartCountdown={dispatchStartCountdown}
              dispatchPopUp={dispatchPopUp}
              onCallFinished={onCallFinished}
            />
          ) : null}
        </Row>
      )}
      <Row>
        {!loading && featuredProduct && (
          <ProductChangedAnimation featuredProductChanged={animateFeaturedProduct}>
            <FeatureProduct
              data-test="featured-product"
              id="featured-product"
              onClick={handleFeaturedProductClicked}
              title={featuredProduct.images[0].alt}
              url={featuredProduct.images[0].imageUrl}
              badgeProps={getBadgeProps()}
            />
          </ProductChangedAnimation>
        )}
        {(!loading && !isOneToManySale && isMobile) ||
          (isCohostUser && (
            <LocalMediaControls
              data-test="local-media-container"
              isCohostUser={isCohostUser}
              isMobile={isMobile}
              toggleMicrophone={toggleMicrophone}
              toggleCamera={toggleCamera}
            />
          ))}
      </Row>
      {displayPopUp && <PopUp />}
      {displayFinishEventCountdown && (
        <EventTimer
          title={t('countdown.finishEventTimerHeader')}
          subtitle={t('countdown.finishEventTimerSecondaryHeader')}
          dateTime={finishEventServerDateTime}
          onTimeUp={() => {
            dispatch(leaveCall())
            onCallFinished(EventLogs.SELLER_HANG_UP_ALL)
          }}
        />
      )}
      {displayStartEventCountdown && (
        <EventTimer
          title={t('countdown.startEventTimerHeader')}
          dateTime={startEventServerDateTime}
          onTimeUp={() => {
            gaEventTracker('InCall', `post-counter-event-entry`)
            matomoTrackEvent('InCall', `post-counter-event-entry`)
            dispatch(setDisplayStartEventCountdown(false))
          }}
        />
      )}
      <MainContent>{children}</MainContent>
      {!loading && (
        <CallBottomContainer
          isDesktop={uiSize === UI_IS_LAPTOP}
          onCallFinished={onCallFinished}
          loading={loading}
          data-test="mobile-action-bar-container"
        />
      )}
    </BaseCallLayout>
  )
}

CallLayout.propTypes = {
  children: PropTypes.element,
  onCallFinished: PropTypes.func.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
}

const scaleInCenter = keyframes`
    0% {
    -webkit-transform: scale(0);
            transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 1;
  }
`

const ProductChangedAnimation = styled.div`
  animation: ${({ featuredProductChanged }) =>
    featuredProductChanged
      ? css`
          ${scaleInCenter} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both
        `
      : 'none'};
`

export { CallLayout }
