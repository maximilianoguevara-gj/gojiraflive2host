import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Splash } from '../components/Splash'
import { CountdownTimer } from '../components/Countdown/CountdownTimer'
import { StyledImage } from '../styles/LoadingLayout.styles'
import { getStoreById, selectCurrentStoreImage } from '../reducers/storeSlice'
import { GJLogo } from '../components/GJKit/newGJLogo'
import {
  UI_IS_LAPTOP,
  UI_IS_TABLET,
  selectEventStartServerDateTime,
  selectUiSize,
  setUiSize,
} from '../reducers/uiSlice'
import { selectCurrentStore } from '../reducers/storeSlice'
import { useParams, useNavigate } from 'react-router-dom'
import { getSecondsDiff, scheduleEventDate } from '../utils/countdownTimerUtils'
import StoreUtils from '../utils/storeUtils'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { device } from '../constants/devices'
import { useDevices } from '../hooks/useDevices'

export default function OneToManyCountdown() {
  const { gaSendPageView } = useGoogleAnalytics()
  const { trackPageView } = useMatomoAnalytics()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector(selectCurrentStore)
  const logoImage = useSelector(selectCurrentStoreImage)
  const params = useParams()
  const schedule = scheduleEventDate(store?.eventDate)
  const [isLoading, setIsLoading] = useState(true)
  const eventStartServerDateTime = useSelector(selectEventStartServerDateTime)
  const uiSize = useSelector(selectUiSize)
  const { handlers, clean, current } = useDevices()
  const isMobile = uiSize === UI_IS_TABLET

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
    gaSendPageView()
    trackPageView()
  }, [])

  useEffect(() => {
    if (!store && params?.storeId) {
      dispatch(getStoreById(params.storeId))
    }
  }, [params])

  useEffect(() => {
    if (store && eventStartServerDateTime) {
      checkEventStarted()
    } else if (store && !store.eventDate) {
      navigate(`/store/${store.id}${window.location.search}`)
    }
  }, [store, eventStartServerDateTime])

  const checkEventStarted = async () => {
    if (
      !store.isOneToManySale ||
      getSecondsDiff(new Date(eventStartServerDateTime), new Date()) <= 0
    ) {
      navigate(`/store/${store.id}${window.location.search}`)
    } else {
      setIsLoading(false)
    }
  }

  const getFormatedEventDate = () => {
    const formatedEventDate = `${schedule.date} ${schedule.month.toUpperCase()} | ${
      schedule.hours
    }${schedule.minutes != '00' ? `:${schedule.minutes}` : ''} HS - ${
      store.countryCode == 'AR' ? 'ARG' : store.countryCode
    }`

    return formatedEventDate
  }

  return (
    <>
      {isLoading || store == null ? (
        <Splash />
      ) : (
        <CountDownLayout>
          <Container
            backgroundImage={StoreUtils.getBackgroundImage({
              isMobile,
              isCountdownPage: true,
              backgroundUrlCountdown: store.backgroundUrlCountdown,
              backgroundUrlMobile: store.backgroundUrlMobile,
              backgroundUrl: store.backgroundUrl,
            })}
          >
            <CountDownContainer>
              <StyledImage src={logoImage} alt={'Store logo'} />
              <CustomText>Live Shopping</CustomText>
              <CustomText fontSize="1.613rem">{getFormatedEventDate()}</CustomText>
              <CountdownTimer store={store} />
              <StyledGJLogo color="white" />
            </CountDownContainer>
          </Container>
        </CountDownLayout>
      )}
    </>
  )
}

const StyledGJLogo = styled(GJLogo)`
  filter: drop-shadow(black 0rem 0.3rem 0.3rem);
`

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: -1;
  }
`

const CountDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CustomText = styled.span`
  text-shadow: black 0.1rem 0.1rem 0.2rem;
  font-size: ${({ fontSize }) => fontSize ?? '3.625rem'};
  font-weight: 700;
  color: #ffffff;
  margin: 4px 4px;
  text-align: center;
`
const CountDownLayout = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
