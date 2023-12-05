import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectChannelId, upsertUser } from '../reducers/callSlice'
import { selectStoreId } from '../reducers/storeSlice'
import { useElasticEventTracker, useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { useAuth } from '@gojiraf/auth'
import { useViews } from 'state'
import { sendUserData } from '../services/usersService'
import { hideAskNameDialog, setShowAskNameDialog } from '../reducers/uiSlice'
const minNicknameLength = 2
const maxNicknameLength = 25
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

export const useSendUser = ({ isDesktop }) => {
  const [loading, setLoading] = useState(false)
  const [nickname, setNickname] = useState('')
  const [showErrorMessageNickname, setShowErrorMessageNickname] = useState(false)
  const [email, setEmail] = useState('')
  const [showErrorMessageEmail, setShowErrorMessageEmail] = useState(false)
  const [disable, setDisable] = useState(true)
  const [checked, setChecked] = useState(false)
  const [showErrorMessageCheckbox, setShowErrorMessageCheckbox] = useState(false)
  const channelId = useSelector(selectChannelId)
  const storeId = useSelector(selectStoreId)
  const dispatch = useDispatch()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { sendEventPostToElastic } = useElasticEventTracker()
  const { setUsername, user } = useAuth()
  const { send: sendViews } = useViews()

  useEffect(() => {
    const validEmailFormat = email?.trim() === '' || emailPattern.test(email)
    setShowErrorMessageEmail(!validEmailFormat)
  }, [email])

  useEffect(() => {
    const enableConfirmButton = nickname?.trim().length >= minNicknameLength
    if (enableConfirmButton) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [nickname])

  const sendData = async ({ event_id, store_id, name, email }) => {
    try {
      const response = await sendUserData({ event_id, store_id, name, email })
      if (response?.data?.errors) {
        const errorMessage = response.data.errors[0]?.message ?? ''
        throw new Error(`Error saving user data ${errorMessage}`)
      }
      gaEventTracker('InCall', `save-user-and-email`)
      matomoTrackEvent('InCall', `save-user-and-email`)
    } catch (error) {
      console.error(error)
      gaEventTracker('InCall', `fail-error-saving-user`)
      matomoTrackEvent('InCall', `fail-error-saving-user`)
      sendEventPostToElastic('errors', 'fail-save-user-and-email')
    }
  }

  const handleConfirm = async () => {
    const validNickNameFormat = nickname?.trim().length <= maxNicknameLength
    const validEmailFormat = email?.trim() === '' || emailPattern.test(email)

    if (!validNickNameFormat || !validEmailFormat || !checked) {
      if (!validNickNameFormat) setShowErrorMessageNickname(true)
      if (!checked) setShowErrorMessageCheckbox(true)
      return
    }
    setLoading(true)
    gaEventTracker('InCall > Chat', 'confirm-name-chat')
    matomoTrackEvent('InCall > Chat', 'confirm-name-chat')
    setUsername(nickname)
    await dispatch(upsertUser({ ...user, name: nickname }))
    if (emailPattern.test(email))
      await sendData({ event_id: channelId, store_id: storeId, name: nickname, email })
    if (isDesktop) {
      dispatch(setShowAskNameDialog({ showAskNameDialog: false }))
    } else {
      sendViews({ type: 'GO_BACK' })
    }
  }

  const handleCancel = () => {
    dispatch(hideAskNameDialog())
  }

  return {
    handleConfirm,
    handleCancel,
    nickname,
    email,
    loading,
    showErrorMessageCheckbox,
    showErrorMessageEmail,
    showErrorMessageNickname,
    disable,
    checked,
    setChecked,
    setEmail,
    setNickname,
  }
}
