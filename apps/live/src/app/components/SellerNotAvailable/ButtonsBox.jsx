import React from 'react'
import PropTypes from 'prop-types'
import StoreUtils from '../../utils/storeUtils'
import { useTranslation } from 'react-i18next'
import { ButtonsContainer } from './SellerNotAvailable.styles'
import { CustomButton } from './CustomButton'

export const ButtonsBox = ({ isOneToManySale = false, phoneNumber = null, customLink = null }) => {
  const { t } = useTranslation()

  const handleClick = (link) => {
    window.open(link, '_blank')
  }

  const getCurrentTextCustomLink = () => {
    if (isOneToManySale) return t('homePage.sellerNotAvailable.customLinkOTM')
    return t('homePage.sellerNotAvailable.customLink')
  }

  return (
    <ButtonsContainer minHeight={isOneToManySale ? 'auto' : '15%'}>
      {isOneToManySale ? (
        <CustomButton onClick={StoreUtils.reloadWindow}>
          {t('homePage.sellerNotAvailable.goToEvent')}
        </CustomButton>
      ) : (
        <>
          {phoneNumber && (
            <CustomButton isWhatsApp onClick={() => handleClick(`https://wa.me/${phoneNumber}`)}>
              {t('homePage.sellerNotAvailable.whatsappButton')}
            </CustomButton>
          )}
          {customLink && (
            <CustomButton onClick={() => handleClick(customLink)}>
              {getCurrentTextCustomLink()}
            </CustomButton>
          )}
        </>
      )}
    </ButtonsContainer>
  )
}

ButtonsBox.propTypes = {
  isOneToManySale: PropTypes.bool,
  phoneNumber: PropTypes.string,
  customLink: PropTypes.string,
}
