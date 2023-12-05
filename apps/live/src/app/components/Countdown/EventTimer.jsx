import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import _delay from 'lodash.delay'
import { getSecondsDiff, secondsToTimeRemaining } from '../../utils/countdownTimerUtils'
import { Timer } from './Timer'
import { SECONDS_TO_ADD_EVENT_DATE } from '../../constants/startEventDate'
import { useDispatch, useSelector } from 'react-redux'
import { selectDisableStartEvent, setDisableStartEvent } from '../../reducers/uiSlice'

export const EventTimer = ({ title, subtitle, dateTime, onTimeUp }) => {
  const disableStartEvent = useSelector(selectDisableStartEvent)
  const dispatch = useDispatch()
  const [secondsRemaining, setSecondsRemaining] = useState(null)

  useEffect(() => {
    if (secondsRemaining === null || secondsRemaining >= 0) {
      _delay(async () => {
        setSecondsRemaining(getSecondsDiff(new Date(dateTime), new Date()))
      }, 1000)
    } else {
      onTimeUp(secondsRemaining)
    }

    if (
      secondsRemaining !== null &&
      secondsRemaining <= SECONDS_TO_ADD_EVENT_DATE &&
      disableStartEvent
    ) {
      dispatch(setDisableStartEvent(false))
    }
  }, [secondsRemaining])

  return (
    <Container>
      <Header>{title}</Header>
      {subtitle && <SecondaryHeader>{subtitle.toUpperCase()}</SecondaryHeader>}
      <Timer remainingTime={secondsToTimeRemaining(secondsRemaining)} />
    </Container>
  )
}

const Container = styled.div`
  margin: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const Header = styled.h1`
  color: white;
  text-align: center;
  font-weight: 700;
  font-size: 1.938rem;
`
const SecondaryHeader = styled.span`
  color: white;
  text-align: center;
  font-weight: 700;
  font-size: 1.5rem;
`
EventTimer.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  dateTime: PropTypes.object.isRequired,
  onTimeUp: PropTypes.func.isRequired,
}
