import React from 'react'
import ReactGA from 'react-ga4'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { enableMapSet } from 'immer'
import { ProductsProvider } from 'ui'
import store from './app/core/store'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import { MatomoProvider, createInstance } from '@gojiraf/analytics'
import './i18n'

const { REACT_APP_GA_TRACKING, REACT_APP_MATOMO_URL, REACT_APP_ID_MATOMO = 4 } = process.env

ReactGA.initialize(REACT_APP_GA_TRACKING)
enableMapSet()

const instance = createInstance({
  urlBase: REACT_APP_MATOMO_URL,
  siteId: REACT_APP_ID_MATOMO,
  linkTracking: false,
})

ReactDOM.render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
      <ProductsProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ProductsProvider>
    </MatomoProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
