import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Splash } from '../components/Splash'
import { AutoPlayUnlocker } from '../components/AutoPlayUnlocker'
import {
  selectCurrentStore,
  getStoreById,
  setSellerIsAvailable,
  setEventOnGoing,
} from '../reducers/storeSlice'
import {
  UI_IS_LAPTOP,
  UI_IS_TABLET,
  setUiSize,
  selectEventStartServerDateTime,
  setLanguage,
  selectActiveCallAction,
  CALL_ACTION_PRODUCTS,
  CALL_ACTION_CHAT,
  CALL_ACTION_CAMERAS,
} from '../reducers/uiSlice'
import OneToManyLayout from './oneToManyLayout'
import OneToOneLayout from './oneToOneLayout'
import { device } from '../constants/devices'
import { StoreKeys } from '../constants/storeKeys'
import StorageService from '../../storage'
import { useDevices } from '../hooks/useDevices'
import UtmUtils from '../utils/utmUtils'
import { getSecondsDiff } from '../utils/countdownTimerUtils'
import useQueryParams from '../hooks/useQueryParams'
import { CustomerRoles } from '../constants/customerRoles'
import dayjs from 'dayjs'
import { EventLogsEs } from '../constants/eventLogsEs'
import PermissionDeniedDialog from '../components/dialogs/permissionDeniedDialog'
import { useLocalMicrophone } from '../hooks/useLocalMicrophone'
import { useLocalCamera } from '../hooks/useLocalCamera'
import { useTranslation } from 'react-i18next'
import { useViews } from 'state'
import { useLogger } from '@gojiraf/logger'
import { useAuth } from '@gojiraf/auth'
import { selectTermsAndConditionsAccepted } from '../reducers/callSlice'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'
import { SECONDS_TO_ADD_EVENT_DATE } from '../constants/startEventDate'
import { useUtm } from '@gojiraf/useutm'
export default function Home() {
  const { gaSendPageView, gaEventTracker } = useGoogleAnalytics()
  const { trackPageView, matomoTrackEvent } = useMatomoAnalytics()
  const store = useSelector(selectCurrentStore)
  const { send } = useViews()
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const routerParams = useParams()
  const { params } = useQueryParams()
  const navigate = useNavigate()
  const [buyerEnteredStore, setBuyerEnteredStore] = useState(false)
  const activeCallAction = useSelector(selectActiveCallAction)
  const eventStartServerDateTime = useSelector(selectEventStartServerDateTime)
  const [loading, setLoading] = useState(true)
  const { toggleMicrophone, closeMicrophone } = useLocalMicrophone()
  const { toggleCamera, closeCamera } = useLocalCamera()
  const { addLog } = useLogger()
  const termsAndConditionsAccepted = useSelector(selectTermsAndConditionsAccepted)
  const { user, deleteBan, deleteMute } = useAuth()
  const { sendEventPostToElastic } = useElasticEventTracker()

  useEffect(() => {
    gaSendPageView()
    trackPageView()
    if (store) {
      changeLanguage(store.lang)
      if (
        !store.company ||
        !store.calendars ||
        !store.paymentGateways ||
        !store.storeConfigurations
      ) {
        navigate('/store/error')
      }
    }
  }, [store])

  useEffect(() => {
    if (buyerEnteredStore && termsAndConditionsAccepted) {
      gaEventTracker('InCall', `entered-live-event [${store?.id}]`)
      matomoTrackEvent('InCall', `entered-live-event [${store?.id}]`)
      sendEventPostToElastic(`entered-live-event`)
      gaEventTracker('InCall', `entered-live-event [${store?.name}]`)
      addLog({
        event: 'BUYER_ENTERED_STORE',
        data: {
          storeId: store.id,
          userId: user.id,
          ...UtmUtils.getUtmObject(queryParams),
        },
      })
    }
  }, [buyerEnteredStore, termsAndConditionsAccepted])

  const changeLanguage = (lang) => {
    if (lang) {
      i18n.changeLanguage(lang)
      dispatch(setLanguage(lang))
    }
  }

  useEffect(async () => {
    StorageService.setValue(StoreKeys.INITIAL_QUERY_PARAMS, window.location.search)
  }, [])

  useEffect(() => {
    if (activeCallAction === CALL_ACTION_PRODUCTS) send({ type: 'SHOW_PRODUCTS' })
    if (activeCallAction === CALL_ACTION_CHAT) send({ type: 'SHOW_CHAT' })
    if (activeCallAction === CALL_ACTION_CAMERAS) send({ type: 'SHOW_PARTICIPANTS' })
  }, [activeCallAction])

  useEffect(() => {
    const storeIdFinal = getStoreId()

    if (storeIdFinal != null) {
      const fn = async () => {
        await dispatch(getStoreById(storeIdFinal)).unwrap()
      }

      fn()
    }
  }, [params])

  const navigateToSellerNotAvailable = (eventOnGoing = false) => {
    dispatch(setEventOnGoing(eventOnGoing))
    dispatch(setSellerIsAvailable(false))
  }

  const getStoreId = () => {
    if (params === null) return

    const { id = null } = params
    const { storeId = null } = routerParams

    const storeIdFinal = storeId != null ? storeId : id != null ? id : null
    return storeIdFinal
  }

  const checkUserIsMuted = (storeId) => {
    const time = user.mutes[storeId]
    const isMuted = time && dayjs().isBefore(Number(time))
    if (!isMuted) deleteMute(storeId)
  }

  const isUserBanned = (storeId) => {
    const time = user.bans[storeId]
    const isBanned = time && dayjs().isBefore(Number(time))
    if (!isBanned) deleteBan(storeId)
    return isBanned
  }

  useEffect(() => {
    if (!store) {
      return
    }
    checkUserIsMuted(store.id)

    if (isUserBanned(store.id)) return

    if (eventStartServerDateTime) {
      checkEventStarted()
    } else if (!store.eventDate) {
      setLoading(false)
    }
  }, [store, eventStartServerDateTime])

  const checkEventStarted = async () => {
    const { utm_medium } = UtmUtils.getUtmObject(queryParams)
    const { isAllowedToJoinCall } = useUtm(utm_medium)
    const isModerator = user.role === CustomerRoles.MODERATOR
    const isCohost = user.role === CustomerRoles.COHOST
    const isAllowedToJoinEvent = isModerator || isCohost || isAllowedToJoinCall
    const timeRemaining = getSecondsDiff(new Date(eventStartServerDateTime), new Date())
    const eventStarted = timeRemaining <= 0
    const eventIsAboutToStart =
      store.company.companyConfigurations.redirectToCall === true &&
      timeRemaining <= SECONDS_TO_ADD_EVENT_DATE

    if (isAllowedToJoinEvent || !store.isOneToManySale || eventStarted || eventIsAboutToStart) {
      setLoading(false)
    } else {
      gaEventTracker('Login Page', 'go-to-event-from-countdown')
      matomoTrackEvent('Login Page', 'go-to-event-from-countdown')
      navigate(`/store/${store.id}/event${window.location.search}`)
    }
  }

  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })

  const { handlers, clean, current } = useDevices()
  useEffect(() => {
    const handle = (e) => {
      if (e.matches) {
        dispatch(setUiSize({ chatSize: UI_IS_LAPTOP }))
      } else {
        dispatch(setUiSize({ chatSize: UI_IS_TABLET }))
      }
    }
    handlers[2].setHandler(handle)
    if (!current || current === device.tablet || current === device.mobile) {
      dispatch(setUiSize({ chatSize: UI_IS_TABLET }))
    } else {
      dispatch(setUiSize({ chatSize: UI_IS_LAPTOP }))
    }
    return () => {
      clean()
    }
  }, [current])

  useEffect(() => {
    if ((store && user.id !== null) || store?.isOneToManySale === true) {
      addLog({
        event: 'BUYER_ARRIVED',
        data: {
          storeId: store.id,
          ...UtmUtils.getUtmObject(queryParams),
          userId: user.id ?? EventLogsEs.ANONIMO_WEB,
        },
      })
    }
  }, [store, user])

  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <>
          <AutoPlayUnlocker>
            {store.isOneToManySale ? (
              <OneToManyLayout
                store={store}
                setBuyerEnteredStore={setBuyerEnteredStore}
                buyerEnteredStore={buyerEnteredStore}
                navigateToSellerNotAvailable={navigateToSellerNotAvailable}
              />
            ) : (
              <OneToOneLayout
                store={store}
                setBuyerEnteredStore={setBuyerEnteredStore}
                buyerEnteredStore={buyerEnteredStore}
                navigateToSellerNotAvailable={navigateToSellerNotAvailable}
                closeMicrophone={closeMicrophone}
                toggleMicrophone={toggleMicrophone}
                closeCamera={closeCamera}
                toggleCamera={toggleCamera}
              />
            )}
            <PermissionDeniedDialog />
          </AutoPlayUnlocker>
        </>
      )}
    </>
  )
}

Home.propTypes = {
  storeId: PropTypes.string,
}
