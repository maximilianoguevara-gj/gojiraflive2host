import React from 'react'
import _delay from 'lodash.delay'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  selectPayPalButtonMounted,
  selectPayPalDialogVisible,
  setPayPalButtonMounted,
  setPayPalDialogVisible,
} from '../../reducers/uiSlice'
import { useDispatch } from 'react-redux'
import { ButtonContainer, Cancel, PayPalButton } from './style'
import { StyledDialog, StyledTypography } from './TermsAndConditions'
import { CircularProgress } from '@material-ui/core'

export const PayPalCheckoutDialog = () => {
  const payPalDialogVisible = useSelector(selectPayPalDialogVisible)
  const payPalButtonMounted = useSelector(selectPayPalButtonMounted)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleClose = () => {
    dispatch(setPayPalDialogVisible(false))
    _delay(() => {
      dispatch(setPayPalButtonMounted(false))
    }, 1000)
  }
  return (
    <StyledDialog
      BackdropProps={{ style: { backgroundColor: 'transparent', backdropFilter: 'blur(4px)' } }}
      padding="2rem 1rem"
      aria-labelledby="simple-dialog-title"
      open={payPalDialogVisible}
      id="terms-and-conditions-br"
      data-test="terms-and-conditions-br"
    >
      <StyledTypography variant="h6" color="primary" fontSize="14px" align="center">
        {t('dialogs.payPalDialog')}
      </StyledTypography>

      <ButtonContainer padding="1rem 0">
        <PayPalButton id="#paypal-button">
          {!payPalButtonMounted && <CircularProgress size={20} />}
        </PayPalButton>
        <Cancel data-test="askName-cancel" onClick={handleClose}>
          {t('chat.buttonCancel').toUpperCase()}
        </Cancel>
      </ButtonContainer>
    </StyledDialog>
  )
}
