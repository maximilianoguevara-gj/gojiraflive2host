import React from 'react'
import CustomDialog from './customDialog'
import StoreUtils from '../../utils/storeUtils'
import { useAuth } from '@gojiraf/auth'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectChatError } from '../../reducers/uiSlice'
import { CustomerRoles } from '../../constants/customerRoles'

export const ChatErrorDialog = () => {
  const { t } = useTranslation()
  const { showDialog, errorCode, errorMessage, errorTitle } = useSelector(selectChatError)
  const handleOnClose = () => {
    StoreUtils.reloadWindow()
  }
  const {
    user: { role },
  } = useAuth()
  const isModerator = role === CustomerRoles.MODERATOR

  const getDescription = () => {
    if (isModerator) return `${t(errorMessage)} (${errorCode})`
    return t(errorMessage)
  }

  return (
    <CustomDialog
      tittle={t(errorTitle)}
      description={getDescription()}
      onClose={handleOnClose}
      isOpen={showDialog}
    />
  )
}
