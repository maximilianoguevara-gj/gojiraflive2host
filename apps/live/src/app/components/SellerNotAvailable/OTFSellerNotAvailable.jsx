import React from 'react'
import PropTypes from 'prop-types'
import { MeetingIsFullSVG } from '../../assets/svg/MeetingIsFullSVG'
import { SellerNotAvailableSVG } from '../../assets/svg/SellerNotAvailableSVG'
import { ButtonsBox } from './ButtonsBox'
import { MainParagraph } from './MainParagraph'
import { useTranslation } from 'react-i18next'
import { ItemsContainer, Paragraph } from './SellerNotAvailable.styles'

export const OTFSellerNotAvailable = ({ phoneNumber, customLink, meetingIsFull }) => {
  const { t } = useTranslation()
  const getMainParagraphText = () => {
    if (!meetingIsFull) return <h1>{t('homePage.sellerNotAvailable.sellerNotAvailableHeading')}</h1>
    return <h1>{t('homePage.sellerNotAvailable.meetingFullHeading')}</h1>
  }

  const getParagraphText = () => {
    if (phoneNumber && customLink) return t('homePage.sellerNotAvailable.phoneNumberAndLink')
    if (phoneNumber) return t('homePage.sellerNotAvailable.phoneNumber')
    if (customLink) return t('homePage.sellerNotAvailable.link')
  }

  return (
    <>
      {meetingIsFull === true ? <MeetingIsFullSVG /> : <SellerNotAvailableSVG />}
      <ItemsContainer>
        <MainParagraph>{getMainParagraphText()}</MainParagraph>
        <Paragraph>{getParagraphText()}</Paragraph>
        <ButtonsBox phoneNumber={phoneNumber} customLink={customLink} />
      </ItemsContainer>
    </>
  )
}

OTFSellerNotAvailable.propTypes = {
  meetingIsFull: PropTypes.bool,
  phoneNumber: PropTypes.string,
  customLink: PropTypes.string,
}
