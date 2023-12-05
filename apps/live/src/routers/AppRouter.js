import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorPage from '../app/pages/error'
import { SellerNotAvailable } from '../app/pages/SellerNotAvailable'
import { Splash } from '../app/components/Splash'
import Home from '../app/pages/home'
import OneToManyCountdown from '../app/pages/oneToManyCountdown'
import LinxRedirector from '../app/pages/LinxRedirector'
import { ModeratorLogin } from '../app/pages/ModeratorLogin'
import { DefaultError } from '../app/pages/DefaultError'
import { SellerAvailability } from './SellerAvailability'
import { FormSplash } from '../app/pages/FormSplash'
import { DeepLink } from '../app/pages/deepLink'
import { useDocumentTitle } from '../app/hooks/useDocumentTitle'
import { CoHostLogin } from '../app/pages/CoHostLogin'

export const AppRouter = () => {
  useDocumentTitle()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/:storeId" element={<HomeComponent />} />
        <Route path="/store" element={<HomeComponent />} />
        <Route path="/store/:storeId" element={<HomeComponent />} />
        <Route path="/store/:storeId/form" element={<FormSplash />} />
        <Route path="/seller-not-available/:storeId" element={<SellerNotAvailable />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="/store/:storeId/event" element={<OneToManyCountdown />} />
        <Route path="/store/:storeId/login" element={<ModeratorLogin />} />
        <Route path="/store/:storeId/cohost" element={<CoHostLogin />} />
        <Route path="/store/error" element={<DefaultError />} />
        {/* <Route path="/*" element={<Navigate to="/store/:storeId" />} /> */}
        <Route path="/linx/redirect" element={<LinxRedirector />} />
        <Route path="/deeplink.*" element={<DeepLink />} />
      </Routes>
    </Router>
  )
}

const HomeComponent = () => {
  return (
    <SellerAvailability>
      <Home />
    </SellerAvailability>
  )
}
