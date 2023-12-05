import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export const Timer = ({ remainingTime }) => {
  const { t } = useTranslation()
  const { days, hours, minutes, seconds } = remainingTime
  const showDays = days !== '00'

  return (
    <Container data-test="timer-container">
      {showDays && (
        <TimerComponent data-test="timer-component-days">
          <TimerPointerNumber data-test="hours">{days}</TimerPointerNumber>
          <TimePointerText data-test="timers-days">
            {t('homePage.countdownTimerDays').toUpperCase()}
          </TimePointerText>
        </TimerComponent>
      )}
      <TimerComponent data-test="timer-component-hours">
        <TimerPointerNumber data-test="hours">{hours}</TimerPointerNumber>
        <TimePointerText data-test="timers-hours">
          {t('homePage.countdownTimerHours').toUpperCase()}
        </TimePointerText>
      </TimerComponent>
      <TimerComponent data-test="timer-component-minutes">
        <TimerPointerNumber data-test="minutes">{minutes}</TimerPointerNumber>
        <TimePointerText data-test="timers-minutes">
          {t('homePage.countdownTimerMinutes').toUpperCase()}
        </TimePointerText>
      </TimerComponent>
      <TimerComponent data-test="timer-components-seconds">
        <TimerPointerNumber data-test="seconds">{seconds}</TimerPointerNumber>
        <TimePointerText data-test="timers-seconds">
          {t('homePage.countdownTimerSeconds').toUpperCase()}
        </TimePointerText>
      </TimerComponent>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100px;
  font-size: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
`

const TimerComponent = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  min-width: 5rem;
  min-height: 5rem;
  line-height: initial;
`

const TimerPointerNumber = styled.span`
  font-family: 'Montserrat';
  font-weight: 600;
  font-size: 35px;
  color: #50555c;
`
const TimePointerText = styled.span`
  font-family: 'Montserrat';
  font-weight: 700;
  font-size: 10.5px;
  color: #50555c;
`
Timer.propTypes = {
  remainingTime: PropTypes.object.isRequired,
}
