import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDisplayPopUpState, setDisplayPopUpState } from '../reducers/callSlice'
import { selectCurrentStore, setDisplayPopUp } from '../reducers/storeSlice'
import { notifyPopUpMessage } from '../reducers/uiSlice'
import { debounce } from 'lodash'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

export const usePopUp = () => {
  const {
    id,
    storeConfigurations: {
      features: {
        popUp: { active, imageUrl, extUrl },
      },
    },
  } = useSelector(selectCurrentStore)

  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const dispatch = useDispatch()
  const displayPopUp = useSelector(selectDisplayPopUpState)

  useEffect(() => {
    if (active) {
      dispatch(setDisplayPopUpState(true))
    }
  }, [])

  const dispatchPopUp = debounce(() => {
    gaEventTracker('Moderator', 'click-switch-popup')
    matomoTrackEvent('Moderator', 'click-switch-popup')
    dispatch(setDisplayPopUp({ storeId: id, state: !displayPopUp }))
    dispatch(notifyPopUpMessage(!displayPopUp))
  }, 1000)

  return { imageUrl, extUrl, displayPopUp, dispatchPopUp }
}
