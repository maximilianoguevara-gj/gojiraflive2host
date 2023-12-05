/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import errorStyles from '../styles/error.styles'
import { useTranslation } from 'react-i18next'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const useStyles = makeStyles((theme) => errorStyles(theme))

export default function ErrorPage() {
  const { gaSendPageView } = useGoogleAnalytics()
  const { trackPageView } = useMatomoAnalytics()
  const { t } = useTranslation()
  const classes = useStyles()

  useEffect(() => {
    gaSendPageView()
    trackPageView()
  }, [])

  return (
    <>
      <Grid item className={classes.grid__item__paddingTB}>
        <Typography
          component="h1"
          variant="h6"
          className={classes.h1_error__message}
          color="primary"
          align="center"
        >
          {t('homePage.errorTypography')}
        </Typography>
      </Grid>
    </>
  )
}
