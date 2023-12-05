import { MatomoProvider, createInstance, useMatomo } from '@datapunt/matomo-tracker-react'

export const useMatomoAnalytics = () => {
  const { trackEvent, trackPageView, enableLinkTracking } = useMatomo()
  
  const matomoTrackEvent = (category: string, event: string) => {
    trackEvent({ category, action: event })
  }

  return {
    MatomoProvider,
    createInstance,
    matomoTrackEvent,
    enableLinkTracking,
    trackPageView,
  }
}
