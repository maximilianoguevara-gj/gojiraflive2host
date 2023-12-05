import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { EventDate } from './EventDate'
import { SECONDS_TO_ADD_EVENT_DATE } from '../../constants/startEventDate'
import {
  setEventStartTime,
  secondsToTimeRemaining,
  getSecondsDiff,
} from '../../utils/countdownTimerUtils'
import _delay from 'lodash.delay'
import { useTranslation } from 'react-i18next'
import { useShareUrl } from '../../hooks/useShareUrl'
import { selectEventStartServerDateTime } from '../../reducers/uiSlice'
import { Timer } from './Timer'
import { atcb_action } from 'add-to-calendar-button'
import 'add-to-calendar-button/assets/css/atcb.css'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'

const CountdownTimer = ({ store }) => {
  const [remainingTime, setRemainingTime] = useState(null)
  const eventStartServerDateTime = useSelector(selectEventStartServerDateTime)
  const { redirectToCall } = store.company.companyConfigurations
  const navigate = useNavigate()

  useEffect(() => {
    const eventIsAboutToStart =
      redirectToCall === true &&
      remainingTime !== null &&
      remainingTime <= SECONDS_TO_ADD_EVENT_DATE

    if (eventIsAboutToStart) {
      navigate(`/store/${store.id}${window.location.search}`)
      return
    }
    if (remainingTime === null || remainingTime >= 0) {
      _delay(async () => {
        setRemainingTime(getSecondsDiff(new Date(eventStartServerDateTime), new Date()))
      }, 1000)
    } else {
      navigate(`/store/${store.id}${window.location.search}`)
    }
  }, [remainingTime])

  return (
    <>
      {!remainingTime ? null : (
        <CountdownDisplay store={store} remainingTime={secondsToTimeRemaining(remainingTime)} />
      )}
    </>
  )
}

CountdownTimer.propTypes = {
  store: PropTypes.object.isRequired,
}

const CountdownDisplay = ({ remainingTime, store }) => {
  const { t } = useTranslation()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { sendEventPostToElastic } = useElasticEventTracker()
  const { startDate, startTime, endTime } = setEventStartTime(remainingTime)
  const eventName = `${store.name} - ${t('countdown.eventName')}`
  const eventDescription = `${t('countdown.eventDescriptionTextOne')} ${store.name}. ${t(
    'countdown.eventDescriptionTextTwo',
  )}`
  const { urlToShare } = useShareUrl(store)

  const config = {
    name: eventName,
    description: eventDescription,
    startDate: startDate,
    startTime: startTime,
    endTime: endTime,
    options: ['Google', 'Outlook.com'],
    timeZone: 'currentBrowser',
    location: urlToShare,
    trigger: 'click',
  }

  const handleClick = (e) => {
    gaEventTracker('Countdown Page', 'add-to-calendar-button')
    matomoTrackEvent('Countdown Page', 'add-to-calendar-button')
    sendEventPostToElastic('add-to-calendar-button')
    e.preventDefault()
    atcb_action(config)
  }

  return (
    <CountdownContainer data-test="countdown-container">
      <Timer remainingTime={remainingTime}></Timer>
      <EventDate className="atcb" onClick={handleClick} data-test="add-to-calendar-button">
        {t('countdown.addToCalendarButton').toUpperCase()}
      </EventDate>
    </CountdownContainer>
  )
}
CountdownDisplay.propTypes = {
  remainingTime: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

const CountdownContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export { CountdownTimer }
