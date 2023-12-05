import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import storeNotFoundStyles from '../styles/storeNotFound.styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => storeNotFoundStyles(theme))

export default function StoreNotFound() {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Grid
      container
      className={clsx(classes.grid__main__child, classes.grid__item__paddingTB)}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography
        component="h1"
        variant="h6"
        className={classes.h1_not_found__message}
        color="primary"
        align="center"
      >
        Ocurrio un error
      </Typography>
      <Button
        className={classes.grid__item__marginT2}
        size="large"
        onClick={() => window.history.back()}
      >
        {t('homePage.sellerNotAvailable.button')}
      </Button>
    </Grid>
  )
}
