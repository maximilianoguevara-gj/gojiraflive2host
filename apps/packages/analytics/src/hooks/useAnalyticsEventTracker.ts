import ReactGA from 'react-ga4'

export const useGoogleAnalytics = () => {
  const path = window.location.pathname + window.location.search
  const gaEventTracker = (category: string, event: string) => {
    ReactGA.event({ category, action: event, label: event })
  }
  const gaSendPageView = () => {
    gaEventTracker('Page View', `page-view-${path}`)
    ReactGA.send({ hitType: 'pageview', page: path })
  }
  return {
    gaEventTracker,
    gaSendPageView,
  }
}
