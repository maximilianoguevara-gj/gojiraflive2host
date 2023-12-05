import React from 'react'
import { useAuth } from '@gojiraf/auth'
import ChatService from '../../services/chatService'
import { Dialog, Typography, Button, DialogTitle, DialogContent } from '@material-ui/core'
import { Button as StyledButton } from '../Kit/Buttons'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../../styles/dialog.styles'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { selectMuteUserDialogVisible, setMuteUserDialogVisible } from '../../reducers/uiSlice'
import { ButtonContainer } from './style'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const useStyles = makeStyles((theme) => styles(theme))
export const MuteUserDialog = () => {
  const muteUserDialogVisible = useSelector(selectMuteUserDialogVisible)
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const {
    user: { id: moderatorId },
    userForMute: { id: userId, name, channelId },
  } = useAuth()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const classes = useStyles()

  const handleClick = async () => {
    try {
      await ChatService.muteUser({
        userId,
        moderatorId,
        channelId,
      })
      gaEventTracker('Moderator', 'confirm-mute-chat-user')
      matomoTrackEvent('Moderator', 'confirm-mute-chat-user')
    } catch (error) {
      console.error(error)
    }
    dispatch(setMuteUserDialogVisible(false))
  }

  const handleClose = () => {
    gaEventTracker('Moderator', 'cancel-mute-chat-user')
    matomoTrackEvent('Moderator', 'cancel-mute-chat-user')
    dispatch(setMuteUserDialogVisible(false))
  }

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={muteUserDialogVisible}>
      <DialogTitle>
        <Typography
          className={classes.message}
          component="p"
          variant="h5"
          color="primary"
          align="center"
        >
          {t('dialogs.muteUser')}
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
          <Button onClick={() => handleClose()}>{t('dialogs.closeButton').toUpperCase()}</Button>
        </ButtonContainer>
      </DialogContent>
    </Dialog>
  )
}
