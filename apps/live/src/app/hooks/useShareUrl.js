import { useEffect, useState } from 'react'

let DEFAULT_URL = new URL(window.location.href)
DEFAULT_URL.searchParams.set('utm_source', 'gojiraf')
DEFAULT_URL.searchParams.set('utm_medium', 'in-call-sharing')

export const useShareUrl = (store) => {
  const [urlToShare, setUrlToShare] = useState(DEFAULT_URL)

  useEffect(() => {
    if (store.storeConfigurations.url) {
      setUrlToShare(new URL(store.storeConfigurations.url))
    } else if (process.env.REACT_APP_DEEP_LINK && store.slug) {
      setUrlToShare(new URL(store.slug, process.env.REACT_APP_DEEP_LINK))
    }
  }, [])

  return {
    urlToShare: urlToShare.toString(),
  }
}
