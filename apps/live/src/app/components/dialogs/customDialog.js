import React from 'react'
import { Dialog, Typography, DialogTitle, DialogContent } from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../../styles/dialog.styles'
import { useTranslation } from 'react-i18next'
import { Button } from '../Kit/Buttons'

const useStyles = makeStyles((theme) => styles(theme))
const CustomDialog = ({ tittle, description, onClose, isOpen }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={isOpen}>
      <DialogTitle>
        <Typography
          className={classes.message}
          component="p"
          variant="h5"
          color="primary"
          align="center"
        >
          {tittle}
        </Typography>
        <Typography
          className={classes.message}
          component="p"
          variant="subtitle2"
          color="primary"
          align="center"
        >
          {description}
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialog__actions}>
        <Button variant="contained" onClick={() => onClose()}>
          {t('dialogs.acceptButton').toUpperCase()}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
export default CustomDialog
CustomDialog.propTypes = {
  tittle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}
