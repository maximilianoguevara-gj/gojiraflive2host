import i18n from 'i18next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'

export const secondsToTimeRemaining = (remainingSeconds) => {
  const formatNumber = (n) => Math.max(0, Math.floor(n)).toString().padStart(2, '0')

  return {
    days: formatNumber(remainingSeconds / 86400),
    hours: formatNumber((remainingSeconds % 86400) / 3600),
    minutes: formatNumber((remainingSeconds % 3600) / 60),
    seconds: formatNumber((remainingSeconds % 3600) % 60),
  }
}

export const scheduleEventDate = (eventDate) => {
  const { t } = i18n
  const monthNames = [
    t('countdown.monthNames.january'),
    t('countdown.monthNames.february'),
    t('countdown.monthNames.march'),
    t('countdown.monthNames.april'),
    t('countdown.monthNames.may'),
    t('countdown.monthNames.june'),
    t('countdown.monthNames.july'),
    t('countdown.monthNames.august'),
    t('countdown.monthNames.september'),
    t('countdown.monthNames.october'),
    t('countdown.monthNames.november'),
    t('countdown.monthNames.december'),
  ]
  const event = new Date(eventDate)
  const eventDateHour = event.getHours()
  const eventDateMinutes =
    event.getMinutes() < 10 && event.getMinutes() > 0
      ? `0${event.getMinutes()}`
      : event.getMinutes()
  const eventDateDate = event.getDate()
  const eventDateMonth = monthNames[event.getMonth()]
  return {
    hours: eventDateHour,
    minutes: eventDateMinutes,
    date: eventDateDate,
    month: eventDateMonth,
  }
}

export const parseEventStartTime = (eventDate) => {
  const eventDateMinutes = eventDate.getMinutes()
  const parsedDateMinutes =
    eventDateMinutes < 10 && eventDateMinutes >= 0 ? `0${eventDateMinutes}` : eventDateMinutes
  const eventDateHour = eventDate.getHours()
  const parsedDateHour =
    eventDateHour < 10 && eventDateHour >= 0 ? `0${eventDateHour}` : eventDateHour
  const eventDateEndHour = eventDate.getHours() + 1
  const parsedDateEndHour =
    eventDateEndHour < 10 && eventDateEndHour >= 0 ? `0${eventDateEndHour}` : eventDateEndHour
  const eventDateDate = eventDate.getDate()
  const parsedDateDate =
    eventDateDate < 10 && eventDateDate > 0 ? `0${eventDateDate}` : eventDateDate
  const eventDateMonth = eventDate.getMonth() + 1
  const parsedDatemonth =
    eventDateMonth < 10 && eventDateMonth > 0 ? `0${eventDateMonth}` : eventDateMonth

  const startDate = `${eventDate.getFullYear()}-${parsedDatemonth}-${parsedDateDate}`
  const startTime = `${parsedDateHour}:${parsedDateMinutes}`
  const endTime = `${parsedDateEndHour}:${parsedDateMinutes}`

  return {
    startDate,
    startTime,
    endTime: endTime !== '24:00' ? endTime : '23:59',
  }
}

export const setEventStartTime = (remainingTime) => {
  const currentTime = new Date()

  const daysToHours = parseInt(remainingTime.days) * 24
  const parsedHours = parseInt(remainingTime.hours) + daysToHours

  currentTime.setHours(currentTime.getHours() + parsedHours)
  currentTime.setMinutes(currentTime.getMinutes() + parseInt(remainingTime.minutes) + 1)
  currentTime.setSeconds(currentTime.getSeconds() + parseInt(remainingTime.seconds))

  const eventStartTime = parseEventStartTime(currentTime)

  return eventStartTime
}

export const isBeforeNow = (remainingSeconds = 0) => {
  if (remainingSeconds > 1) {
    return false
  } else {
    return true
  }
}

export const getSecondsDiff = (date1, date2) => (date1 - date2) / 1000

export const getDateTime = async (seconds) => {
  let now = new Date()
  now.setSeconds(now.getSeconds() + seconds)
  return now.toString()
}

export const getEventOnGoing = (activeCallTime) => {
  if (activeCallTime === null) return false
  const callMaxReconnectionTimeInHours = 1
  dayjs.extend(utc)
  dayjs.extend(duration)
  const dateNow = dayjs.utc().format()
  const diffInHours = dayjs.duration(dayjs(dateNow).diff(dayjs(activeCallTime))).asHours()
  return diffInHours <= callMaxReconnectionTimeInHours
}
