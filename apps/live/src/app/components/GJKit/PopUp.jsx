import React from 'react'
import { usePopUp } from '../../hooks/usePopUp'
import { selectUiSize } from '../../reducers/uiSlice'
import { useSelector } from 'react-redux'
import { PopUpContainer, PopUpImage } from './PopUp.Style'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

export const PopUp = () => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { imageUrl, extUrl } = usePopUp()
  const uiSize = useSelector(selectUiSize)

  const isUrlActive = extUrl && extUrl.length > 0

  const openLink = () => {
    gaEventTracker('InCall > PopUp', 'click-external-URL-in-popUp')
    matomoTrackEvent('InCall > PopUp', 'click-external-URL-in-popUp')
    window.open(extUrl, '_blank')
  }

  return (
    <PopUpContainer uiSize={uiSize}>
      <PopUpImage
        src={imageUrl}
        onClick={isUrlActive ? openLink : null}
        isurlactive={isUrlActive}
        effect="opacity"
      />
    </PopUpContainer>
  )
}
