import React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { CheckoutIframe } from '../Payments/CheckoutIframe'
import { useDispatch, useSelector } from 'react-redux'
import { hideCheckoutIframe, selectIsCheckoutIframeVisible } from '../../reducers/uiSlice'
import { useTranslation } from 'react-i18next'

const CheckoutIframeDialog = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const checkoutIframeIsVisible = useSelector(selectIsCheckoutIframeVisible)

  const handleOnClose = () => {
    dispatch(hideCheckoutIframe())
  }

  return (
    <Dialog open={checkoutIframeIsVisible} fullScreen onClose={handleOnClose}>
      <DialogTitle>{t('dialogs.dialogTitle')}</DialogTitle>
      <DialogContent>
        <CheckoutIframe />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>{t('dialogs.closeButton')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export { CheckoutIframeDialog }
