import React from 'react'
import { Dialog, Typography, DialogTitle, DialogContent } from '@material-ui/core'
import { Button } from '../Kit/Buttons'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../../styles/dialog.styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCannotDeleteMessage, setCannotDeleteMessage } from '../../reducers/uiSlice'
import { useDispatch } from 'react-redux'
import { ButtonContainer } from './style'

const useStyles = makeStyles((theme) => styles(theme))
export const CannotDeleteMessageDialog = () => {
  const { allowDelete } = useSelector(selectCannotDeleteMessage)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const classes = useStyles()

  const handleClick = () => {
    dispatch(setCannotDeleteMessage({ allowDelete: true }))
  }
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={!allowDelete}>
      <DialogTitle>
        <Typography
          className={classes.message}
          component="p"
          variant="h5"
          color="primary"
          align="center"
        >
          {t('dialogs.cannotDeleteIsPinned')}
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialog__actions}>
        <ButtonContainer>
          <Button variant="contained" onClick={handleClick}>
            {t('dialogs.acceptButton').toUpperCase()}
          </Button>
        </ButtonContainer>
      </DialogContent>
    </Dialog>
  )
}
