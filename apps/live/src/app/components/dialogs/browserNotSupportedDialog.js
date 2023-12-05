import React from 'react'
import PropTypes from 'prop-types'
import CustomDialog from './customDialog'
import { useTranslation } from 'react-i18next'

const BrowserNotSupportedDialog = ({ onClose, isOpen }) => {
  const { t } = useTranslation()
  return (
    <CustomDialog
      tittle={t('dialogs.browserTitle')}
      description={t('dialogs.browserDescription')}
      onClose={onClose}
      isOpen={isOpen}
    />
  )
}
export default BrowserNotSupportedDialog
BrowserNotSupportedDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}
