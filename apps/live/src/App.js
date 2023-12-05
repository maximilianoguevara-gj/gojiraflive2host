import React, { useEffect } from 'react'
import { AppRouter } from './routers/AppRouter'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { DevicesProvider } from './app/hooks/useDevices'
import { device } from './app/constants/devices'
import { GlobalStyle } from './app/styles/globalStyles'
import theme from './theme'
import './app/styles/globals.css'
import { useMatomoAnalytics } from '@gojiraf/analytics'

const App = () => {
  const { enableLinkTracking } = useMatomoAnalytics()
  enableLinkTracking()

  useEffect(() => {
    if (window.self !== window.top) {
      sessionStorage.setItem('inIframe', 'true')
    }
  }, [])

  return (
    <DevicesProvider mediaQueries={Object.values(device)}>
      <GlobalStyle />
      <ThemeProvider theme={theme()}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </DevicesProvider>
  )
}

export { App }
