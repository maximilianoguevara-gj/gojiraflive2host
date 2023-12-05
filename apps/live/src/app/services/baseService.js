import axios from 'axios'
import ReduxStore from '../core/store'
import { useAuthStore, login, refresh } from '@gojiraf/auth'

const instance = axios.create({
  baseURL: process.env.REACT_APP_CORE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  async (config) => {
    const {
      user: { tokens },
    } = useAuthStore.getState()

    if (tokens === null || tokens === undefined) {
      const storeId = ReduxStore.getState().store.id
      const newTokens = await login({ storeId })
      config.headers.Authorization = `Bearer ${newTokens.accessToken}`
      return config
    }
    config.headers.Authorization = `Bearer ${tokens.accessToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalConfig = error.config
    if (error.response?.status === 401 && !originalConfig._retry) {
      const newConfig = { ...originalConfig, _retry: true }
      const storeId = ReduxStore.getState().store.id
      const tokens = await refresh({ storeId })
      newConfig.headers = {
        Authorization: `Bearer ${tokens.accessToken}`,
      }

      return instance(newConfig)
    }
    return Promise.reject(error)
  },
)

export const http = instance
