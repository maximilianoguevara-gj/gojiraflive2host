import React from 'react'
import { useDispatch } from 'react-redux'

import { closeCallCard } from '../../../reducers/uiSlice'
import { MainHeading } from 'ui'
import { Cart } from '../../Cart/Cart'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentStore } from '../../../reducers/storeSlice'

export const DesktopCart = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    storeConfigurations: { storeCustomization },
  } = useSelector(selectCurrentStore)
  return (
    <>
      <MainHeading
        title={storeCustomization?.cartHeaderText ?? t('cart.mainHeader')}
        onBackClicked={() => {
          dispatch(closeCallCard())
        }}
      />
      <Cart />
    </>
  )
}
