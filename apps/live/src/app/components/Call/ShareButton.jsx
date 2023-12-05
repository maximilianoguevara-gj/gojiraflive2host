import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShareOutlined } from '@material-ui/icons'
import * as copy from 'copy-to-clipboard'
import qs from 'qs'
import { useAuth } from '@gojiraf/auth'
import { useLogger } from '@gojiraf/logger'
import { selectCurrentStore } from '../../reducers/storeSlice'
import {
  setNotificationMessage,
  setIsNotificationVisible,
  selectUiSize,
  UI_IS_TABLET,
} from '../../reducers/uiSlice'
import UtmUtils from '../../utils/utmUtils'
import { EventLogs } from '../../constants/eventLogs'
import { RoundedButton } from '../Kit/Buttons'
import { useTranslation } from 'react-i18next'
import { askIsWebview } from '../../utils/browserDetectUtils'
import { useShareUrl } from '../../hooks/useShareUrl'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'

const ShareButton = () => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isWebview = askIsWebview()
  const store = useSelector(selectCurrentStore)
  const { urlToShare } = useShareUrl(store)
  const { user } = useAuth()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const { addLog } = useLogger()
  const uiSize = useSelector(selectUiSize)
  const isMobile = uiSize === UI_IS_TABLET
  const { sendEventPostToElastic } = useElasticEventTracker()

  const showMessage = (message) => {
    dispatch(setNotificationMessage({ notificationMessage: message }))
    dispatch(setIsNotificationVisible({ isNotificationVisible: true }))
  }

  const shareMobile = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '',
          text: '',
          url: urlToShare,
        })
        .then(() => {
          showMessage(t('uiElements.shareMobile').toUpperCase())
          addLog({
            event: 'BUYER_SHARED_LINK',
            data: {
              data: {
                storeId: store.id,
                ...UtmUtils.getUtmObject(queryParams),
              },
              type: EventLogs.BUYER_SHARED_LINK,
              userId: user.id,
            },
          })
        })
        .catch((error) => console.error('Error sharing', error))
    }
  }

  const copyToClipboard = () => {
    copy(urlToShare)
    showMessage(t('uiElements.copyToClipboard').toUpperCase())
    addLog({
      event: 'BUYER_COPIED_LINK',
      data: {
        data: {
          storeId: store.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
        type: EventLogs.BUYER_COPIED_LINK,
        userId: user.id,
      },
    })
  }

  const shareCallLink = () => {
    gaEventTracker('InCall', 'call-share-button')
    sendEventPostToElastic('call-share-button')
    matomoTrackEvent('InCall', 'call-share-button')
    if (isMobile && !isWebview) {
      shareMobile()
    } else {
      copyToClipboard()
    }
  }

  return (
    <RoundedButton
      id="call-share-button"
      data-test="share-button"
      aria-label="share"
      color="secondary"
      onClick={shareCallLink}
      ismobilemenu={isMobile}
    >
      <ShareOutlined />
    </RoundedButton>
  )
}

export default ShareButton
