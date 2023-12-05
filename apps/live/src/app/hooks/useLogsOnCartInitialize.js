import qs from 'qs'
import { useSelector } from 'react-redux'
import UtmUtils from '../utils/utmUtils'
import { EventLogs } from '../constants/eventLogs'
import { EventLogsEs } from '../constants/eventLogsEs'
import { selectIsCartInitialized } from '../reducers/cartSlice'
import { selectCurrentStore } from '../reducers/storeSlice'
import { useAuth } from '@gojiraf/auth'
import { useLogger } from '@gojiraf/logger'

const useLogsOnCartInitialize = () => {
  const { user } = useAuth()
  const store = useSelector(selectCurrentStore)
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const isCartInitialized = useSelector(selectIsCartInitialized)
  const { addLog } = useLogger()

  const sendLogs = (product) => {
    if (isCartInitialized === false) {
      addLog({
        event: 'CART_INITIALIZED',
        data: {
          storeId: store.id,
          producId: product.id,
          userId: user.id ?? EventLogs.ANONIMO_WEB,
          ...UtmUtils.getUtmObject(queryParams),
          storeName: store.name,
          createdAt: Date.now(),
          companyName: store.company.name,
          products: product.name,
          eventType: EventLogsEs.CART_INITIALIZED,
        },
      })
    }

    addLog({
      event: 'PRODUCT_ADDED_TO_CART',
      data: {
        storeId: store.id,
        producId: product.id,
        userId: user.id,
      },
    })
  }
  return { sendLogs }
}

export default useLogsOnCartInitialize
