import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSellerNotAvailable } from '../hooks/useSellerNotAvailable'
import { selectCurrentStore, selectSellerIsAvailable } from '../reducers/storeSlice'
import { Splash } from '../components/Splash'
import { SellerNotAvailableCard } from '../components/SellerNotAvailable/SellerNotAvailableCard'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { OTFSellerNotAvailable } from '../components/SellerNotAvailable/OTFSellerNotAvailable'
import { OTMEventNotAvailable } from '../components/SellerNotAvailable/OTMEventNotAvailable'

export const SellerNotAvailable = () => {
  const store = useSelector(selectCurrentStore)
  const { gaSendPageView } = useGoogleAnalytics()
  const { trackPageView } = useMatomoAnalytics()
  const { meetingIsFull, eventOnGoing } = useSelector(selectSellerIsAvailable)
  const { isLoading } = useSellerNotAvailable(store)

  useEffect(() => {
    gaSendPageView()
    trackPageView()
  }, [])

  return (
    <>
      {isLoading || !store ? (
        <Splash />
      ) : (
        <SellerNotAvailableCard>
          {store.isOneToManySale ? (
            <OTMEventNotAvailable eventIsFull={meetingIsFull} eventOnGoing={eventOnGoing} />
          ) : (
            <OTFSellerNotAvailable
              meetingIsFull={meetingIsFull}
              phoneNumber={store.phoneNumber}
              customLink={store.customLink}
            />
          )}
        </SellerNotAvailableCard>
      )}
    </>
  )
}
