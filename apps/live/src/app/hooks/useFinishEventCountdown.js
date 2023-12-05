import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectDisplayFinishEventCountdownstate,
  setDisplayFinishEventCountdown,
} from '../reducers/callSlice'
import { selectCurrentStore, setFinishEventCountdown } from '../reducers/storeSlice'
import { notifyFinishEventCountdownMessage, setFinishEventDateTime } from '../reducers/uiSlice'
import { debounce } from 'lodash'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

export const useFinishEventCountdown = () => {
  const {
    id: storeId,
    storeConfigurations: {
      features: {
        finishEvent: {
          activateFinishEventCountdown,
          secondsToFinishEvent,
          remainingSecondsToFinishEvent,
        },
      },
    },
  } = useSelector(selectCurrentStore)
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const dispatch = useDispatch()
  const displayFinishEventCountdown = useSelector(selectDisplayFinishEventCountdownstate)

  const dispatchFinishCountdown = debounce(async () => {
    gaEventTracker('Moderator', 'click-switch-finish-event-countdown')
    matomoTrackEvent('Moderator', 'click-switch-finish-event-countdown')
    dispatch(setFinishEventDateTime(secondsToFinishEvent))
    dispatch(notifyFinishEventCountdownMessage(!displayFinishEventCountdown))
    dispatch(
      setFinishEventCountdown({
        storeId,
        activateFinishEventCountdown: !displayFinishEventCountdown,
      }),
    )
  }, 1000)

  useEffect(async () => {
    if (activateFinishEventCountdown && remainingSecondsToFinishEvent > 0) {
      await dispatch(setFinishEventDateTime(remainingSecondsToFinishEvent))
      dispatch(setDisplayFinishEventCountdown(true))
    }
  }, [])

  return { displayFinishEventCountdown, dispatchFinishCountdown }
}
