import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { GJLogo, LiveShopping } from './GJKit/newGJLogo'

export const Splash = () => {
  const { gaSendPageView } = useGoogleAnalytics()
  const { trackPageView } = useMatomoAnalytics()

  useEffect(() => {
    gaSendPageView()
    trackPageView()
  }, [])

  return (
    <Container>
      <LiveShopping />
      <GJLogo />
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  gap: 3rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
