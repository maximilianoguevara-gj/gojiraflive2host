import React from 'react'
import qs from 'qs'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLogger } from '@gojiraf/logger'
import { selectCurrentStore } from '../../reducers/storeSlice'
import CustomDialog from './customDialog'
import UtmUtils from '../../utils/utmUtils'
import { selectAudioOrVideoPermission } from '../../reducers/callSlice'
import { setAudioOrVideoPermission } from '../../reducers/callSlice'
import { useAuth } from '@gojiraf/auth'

const PermissionDeniedDialog = () => {
  const { t } = useTranslation()
  const store = useSelector(selectCurrentStore)
  const dispatch = useDispatch()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const audioOrVideoPermission = useSelector(selectAudioOrVideoPermission)
  const { addLog } = useLogger()
  const { user } = useAuth()

  const hanlderOnClose = () => {
    dispatch(setAudioOrVideoPermission(false))

    addLog({
      event: 'USER_DOES_NOT_ALLOW_MIC_ACCESS',
      data: {
        data: { storeId: store.id, name },
        userId: user.id,
        ...UtmUtils.getUtmObject(queryParams),
      },
    })
  }
  return (
    <>
      {audioOrVideoPermission && (
        <CustomDialog
          tittle={t('dialogs.pendingPermitsTitle')}
          description={t('dialogs.permitsDescription')}
          onClose={hanlderOnClose}
          isOpen={audioOrVideoPermission}
        />
      )}
    </>
  )
}

export default PermissionDeniedDialog
