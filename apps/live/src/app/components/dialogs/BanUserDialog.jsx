import React from 'react'
import { Dialog, Typography, Button, DialogTitle, DialogContent } from '@material-ui/core'
import { Button as StyledButton } from '../Kit/Buttons'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../../styles/dialog.styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectBanUserDialogVisible, setBanUserDialogVisible } from '../../reducers/uiSlice'
import { useDispatch } from 'react-redux'
import CallService from '../../services/callService'
import { useAuth } from '@gojiraf/auth'
import { ButtonContainer } from './style'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const useStyles = makeStyles((theme) => styles(theme))
export const BanUserDialog = () => {
  const banUserDialogVisible = useSelector(selectBanUserDialogVisible)
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const {
    userForBan: { id, name },
  } = useAuth()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const classes = useStyles()

  const handleClick = async () => {
    try {
      await CallService.banUser(id)
      gaEventTracker('Moderator', 'confirm-kick-user')
      matomoTrackEvent('Moderator', 'confirm-kick-user')
    } catch (error) {
      console.error(error)
    }
    handleClosewihoutGA()
  }
  const handleClose = () => {
    gaEventTracker('Moderator', 'cancel-kick-user')
    matomoTrackEvent('Moderator', 'cancel-kick-user')
    dispatch(setBanUserDialogVisible(false))
  }
  const handleClosewihoutGA = () => {
    dispatch(setBanUserDialogVisible(false))
  }
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={banUserDialogVisible}>
      <DialogTitle>
        <Typography
          className={classes.message}
          component="p"
          variant="h5"
          color="primary"
          align="center"
        >
          {t('dialogs.blockUser')}
        </Typography>
        <Typography
          className={classes.message}
          component="p"
          variant="subtitle2"
          color="primary"
          align="center"
        >
          {name}
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialog__actions}>
        <ButtonContainer>
          <StyledButton variant="contained" onClick={handleClick}>
            {t('dialogs.acceptButton').toUpperCase()}
          </StyledButton>
          <Button onClick={handleClose}>{t('dialogs.closeButton').toUpperCase()}</Button>
        </ButtonContainer>
      </DialogContent>
    </Dialog>
  )
}
