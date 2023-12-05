import React from 'react'
import PropTypes from 'prop-types'
import { CallHomeContainer } from '../../pages/oneToOneLayout'
import { useSelector } from 'react-redux'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { selectUiSize, UI_IS_TABLET } from '../../reducers/uiSlice'
import StoreUtils from '../../utils/storeUtils'
import { StyledPhoneContainer } from './SellerNotAvailable.styles'

export const SellerNotAvailableCard = ({ children }) => {
  const store = useSelector(selectCurrentStore)
  const { backgroundUrlMobile = null, backgroundUrl } = store
  const uiSize = useSelector(selectUiSize)
  const isMobile = uiSize === UI_IS_TABLET
  return (
    <CallHomeContainer
      isMobile={isMobile}
      style={{
        backgroundImage: `url(${StoreUtils.getBackgroundImage({
          isMobile,
          backgroundUrlMobile,
          backgroundUrl,
        })})`,
      }}
      data-test="background-image"
    >
      <StyledPhoneContainer>{children}</StyledPhoneContainer>
    </CallHomeContainer>
  )
}

SellerNotAvailableCard.propTypes = {
  children: PropTypes.element,
}
