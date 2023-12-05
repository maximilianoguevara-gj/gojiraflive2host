import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectDisplayStartEventCountdownstate,
  setDisplayStartEventCountdown,
} from '../reducers/callSlice'
import { selectCurrentStore, setStartEventCountdown } from '../reducers/storeSlice'
import {
  notifyStartEventCountdownMessage,
  setDisableStartEvent,
  setStartEventDateTime,
} from '../reducers/uiSlice'
import { debounce } from 'lodash'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { SECONDS_TO_ADD_EVENT_DATE } from '../constants/startEventDate'
import { CustomerRoles } from '../constants/customerRoles'
import { useAuth } from '@gojiraf/auth'

export const useStartEventCountdown = () => {
  const {
    id: storeId,
    remainingSeconds,
    company: {
      companyConfigurations: { redirectToCall },
    },
  } = useSelector(selectCurrentStore)
  const {
    user: { role },
  } = useAuth()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const dispatch = useDispatch()
  const displayStartEventCountdown = useSelector(selectDisplayStartEventCountdownstate)

  const dispatchStartCountdown = debounce(async () => {
    gaEventTracker('Moderator', 'click-switch-start-event-countdown')
    matomoTrackEvent('Moderator', 'click-switch-start-event-countdown')
    dispatch(notifyStartEventCountdownMessage(!displayStartEventCountdown))
    dispatch(setStartEventDateTime(SECONDS_TO_ADD_EVENT_DATE))
    dispatch(
      setStartEventCountdown({ storeId, activateStartEventCountdown: displayStartEventCountdown }),
    )
  }, 1000)

  useEffect(() => {
    const isModerator = role === CustomerRoles.MODERATOR
    if (redirectToCall && remainingSeconds > 0) {
      if (isModerator || remainingSeconds <= SECONDS_TO_ADD_EVENT_DATE) {
        dispatch(setDisplayStartEventCountdown(true))
        dispatch(setDisableStartEvent(true))
      }
    }
  }, [])

  return { displayStartEventCountdown, dispatchStartCountdown }
}
