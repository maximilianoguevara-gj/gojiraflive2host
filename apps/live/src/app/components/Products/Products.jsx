import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductsView } from 'ui'
import 'ui/styles.css'
import { ShippingTypes } from '../../constants/shippingTypes'
import { useCheckout } from '../../hooks/useCheckout'
import { selectShippingType, setShippingType, setTotal } from '../../reducers/orderSlice'
import { selectCurrentStore } from '../../reducers/storeSlice'

export function Products() {
  const store = useSelector(selectCurrentStore)
  const shippingType = useSelector(selectShippingType)
  const dispatch = useDispatch()
  const { handleOwnCheckout, hasOwnCheckout, isToAgreeShippingType, isLightIntegration } =
    useCheckout(store)

  const handleOnBuyClicked = async ({ total, selectedDeliveryMethod }) => {
    dispatch(setShippingType(selectedDeliveryMethod))
    dispatch(setTotal({ total: total }))
    if (hasOwnCheckout) await handleOwnCheckout()
  }

  const getDefaultDeliveryMethod = () => {
    if (hasOwnCheckout) return ShippingTypes.UNAVAILABLE
    if (isToAgreeShippingType) return ShippingTypes.TO_AGREE
    return shippingType
  }

  return (
    <ProductsView
      isLightIntegration={isLightIntegration}
      onBuyClicked={handleOnBuyClicked}
      defaultDeliveryMethod={getDefaultDeliveryMethod()}
    />
  )
}
