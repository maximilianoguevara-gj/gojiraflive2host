import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'

const CallContext = createContext()

function useCall() {
  const context = React.useContext(CallContext)
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider')
  }

  return context
}

function CallProvider({ children }) {
  const [startCall, setStartCall] = useState(null)
  const [endCall, setEndCall] = useState(null)

  const onCallStarted = () => {
    setStartCall(Date.now())
  }

  const onCallFinishedDuration = () => {
    const endCall = Date.now()
    setEndCall(endCall)
    const duration = endCall - startCall

    return msToTime(duration)
  }

  const onCallFinished = () => {
    const endCall = Date.now()
    setEndCall(endCall)
    const duration = endCall - startCall

    return duration
  }

  const msToTime = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60)
    let minutes = Math.floor((duration / (1000 * 60)) % 60)
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = hours < 10 ? `0${hours}` : hours
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = seconds < 10 ? `0${seconds}` : seconds

    return `${hours}:${minutes}:${seconds}`
  }
  const value = {
    state: {
      startCall,
      endCall,
    },
    onCallStarted,
    onCallFinished,
    onCallFinishedDuration,
  }

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

CallProvider.propTypes = {
  children: PropTypes.element,
}

export { CallProvider, useCall }
