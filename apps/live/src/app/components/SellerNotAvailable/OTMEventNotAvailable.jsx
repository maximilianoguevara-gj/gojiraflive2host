import React from 'react'
import PropTypes from 'prop-types'
import { ButtonsBox } from './ButtonsBox'
import { MainParagraph } from './MainParagraph'
import { selectCurrentStoreImage } from '../../reducers/storeSlice'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CustomLogo, ItemsContainer, Paragraph } from './SellerNotAvailable.styles'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'

export const OTMEventNotAvailable = ({ eventOnGoing, eventIsFull }) => {
  const { t } = useTranslation()
  const { sendEventPostToElastic } = useElasticEventTracker()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const logoImage = useSelector(selectCurrentStoreImage)

  const getCurrentTitle = () => {
    if (eventIsFull) {
      sendEventPostToElastic('errors', 'otm-event-full')
      gaEventTracker('Seller Not Available', 'otm-event-full')
      matomoTrackEvent('Seller Not Available', 'otm-event-full')
      return <h1>{t('homePage.sellerNotAvailable.eventIsFullTitle')}</h1>
    }
    if (eventOnGoing) {
      sendEventPostToElastic('errors', 'otm-event-started')
      gaEventTracker('Seller Not Available', 'otm-event-started')
      matomoTrackEvent('Seller Not Available', 'otm-event-started')
      return <h1>{t('homePage.sellerNotAvailable.eventStartedTitle')}</h1>
    }
    sendEventPostToElastic('errors', 'otm-event-not-started')
    gaEventTracker('Seller Not Available', 'otm-event-not-started')
    matomoTrackEvent('Seller Not Available', 'otm-event-not-started')
    return <h1>{t('homePage.sellerNotAvailable.eventNotStartedTitle')}</h1>
  }

  const getCurrentParagraph = () => {
    if (eventOnGoing) return t('homePage.sellerNotAvailable.eventStartedParagraph')
    return t('homePage.sellerNotAvailable.eventNotStartedParagraph')
  }

  const getParagraphText = (baseText) => {
    const splitText = baseText.split('Live Shopping')
    return (
      <>
        {splitText.map((textFragment, index) => (
          <React.Fragment key={index}>
            {textFragment}
            {index !== splitText.length - 1 && <strong>Live Shopping</strong>}
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <>
      <CustomLogo src={logoImage} alt={'Store logo'} />
      <ItemsContainer isOneToManySale>
        <MainParagraph>{getCurrentTitle()}</MainParagraph>
        <Paragraph>{getParagraphText(getCurrentParagraph())}</Paragraph>
        {eventOnGoing && <ButtonsBox isOneToManySale />}
      </ItemsContainer>
    </>
  )
}

OTMEventNotAvailable.propTypes = {
  eventIsFull: PropTypes.bool,
  eventOnGoing: PropTypes.bool,
}
