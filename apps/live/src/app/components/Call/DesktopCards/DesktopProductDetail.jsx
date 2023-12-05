import React from 'react'
import { useDispatch } from 'react-redux'

import { closeCallCard } from '../../../reducers/uiSlice'

import { MainHeading } from 'ui'
import { useTranslation } from 'react-i18next'

export const DesktopProductDetail = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <>
      <MainHeading
        title={t('cart.productHeader')}
        onBackClicked={() => dispatch(closeCallCard())}
      />
    </>
  )
}
