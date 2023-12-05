import React from 'react'
import PropTypes from 'prop-types'
import CustomDialog from './customDialog'
import { useTranslation } from 'react-i18next'

const PermissionDeniedDialog = ({ onClose, isOpen }) => {
  const { t } = useTranslation()
  return (
    <CustomDialog
      tittle={t('dialogs.deniedPermitsTitle')}
      description={t('dialogs.permitsDescription')}
      onClose={onClose}
      isOpen={isOpen}
    />
  )
}

PermissionDeniedDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default PermissionDeniedDialog
