import React, { createContext, useContext, useState, useEffect } from 'react'

const DevicesContext = createContext({})

// eslint-disable-next-line react/prop-types
const DevicesProvider = ({ mediaQueries = [], children }) => {
  if (!window) return 'window object is not available (maybe are you using SSR?)'
  const [currentMediaQuery, setCurrentMediaQuery] = useState(null)

  const eventListenersRemovers = []

  const handlers = mediaQueries.map((mediaQuery) => {
    const mmmq = window.matchMedia(mediaQuery)

    const setHandler = (cb) => {
      eventListenersRemovers.push(() => mmmq.removeEventListener('change', cb))

      return mmmq.addEventListener('change', cb)
    }

    return { setHandler, matches: mmmq.matches, mediaQuery }
  })

  useEffect(() => {
    if (handlers.length > 0) {
      const matchedMediaQueries = handlers.filter((handler) => handler.matches)
      const idx = getCurrrentMediaQuery(matchedMediaQueries.map((mq) => mq.mediaQuery))
      if (idx >= 0) setCurrentMediaQuery(matchedMediaQueries[idx].mediaQuery)
    }
  }, [mediaQueries])

  return (
    <DevicesContext.Provider
      value={{ handlers, eventListenersRemovers, current: currentMediaQuery }}
    >
      {children}
    </DevicesContext.Provider>
  )
}

const useDevices = () => {
  const { handlers, eventListenersRemovers, current } = useContext(DevicesContext)

  const clean = () => {
    eventListenersRemovers.forEach((remover) => {
      remover()
    })
  }

  return { handlers, clean, current }
}

const getCurrrentMediaQuery = (device) => {
  const [, idx] = Object.values(device).reduce(
    (acc, cur, idx) => {
      const mediaQueryMatchs = cur.match(/[0-9]+/g)

      if (mediaQueryMatchs.length > 1)
        throw new Error('media query should have a unique measurement')

      const mediaQuery = Number(mediaQueryMatchs.pop())

      const [accValue] = acc
      return accValue > mediaQuery ? acc : [mediaQuery, idx]
    },
    [0, -1],
  )

  return idx
}

export { useDevices, DevicesProvider }
