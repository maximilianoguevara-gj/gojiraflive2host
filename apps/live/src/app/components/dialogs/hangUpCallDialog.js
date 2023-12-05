import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import CustomDialog from './customDialog'
import { useTranslation } from 'react-i18next'
import { useLocalMicrophone } from '../../hooks/useLocalMicrophone'
import { useLocalCamera } from '../../hooks/useLocalCamera'

const HangUpCallDialog = ({ onClose, isOpen, isOneToMany }) => {
  const { closeMicrophone } = useLocalMicrophone()
  const { closeCamera } = useLocalCamera()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOneToMany) {
      closeMicrophone()
      closeCamera()
    }
  }, [])

  return (
    <CustomDialog
      tittle={t('dialogs.customDialog')}
      description={''}
      onClose={onClose}
      isOpen={isOpen}
    />
  )
}
export default HangUpCallDialog
HangUpCallDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOneToMany: PropTypes.bool.isRequired,
}
