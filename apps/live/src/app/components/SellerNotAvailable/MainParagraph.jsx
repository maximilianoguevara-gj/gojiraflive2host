import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectStoreId } from '../../reducers/storeSlice'
import PropTypes from 'prop-types'
import { StyledTextContainer } from './SellerNotAvailable.styles'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

export const MainParagraph = ({ children }) => {
  const storeId = useSelector(selectStoreId)
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()

  useEffect(() => {
    gaEventTracker('InCall', `no-answer [${storeId}]`)
    matomoTrackEvent('InCall', `no-answer [${storeId}]`)
  }, [])

  return <StyledTextContainer>{children}</StyledTextContainer>
}

MainParagraph.propTypes = {
  children: PropTypes.element,
}
