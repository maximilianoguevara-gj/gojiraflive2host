import React from 'react'
import { useSelector } from 'react-redux'
import { Typography, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { selectCurrentStore } from '../reducers/storeSlice'
import styles from '../styles/storeInfoFloating.styles'

const useStyles = makeStyles((theme) => styles(theme))

const StoreInfoFloating = () => {
  const classes = useStyles()
  const store = useSelector(selectCurrentStore)

  return (
    <div className={classes.call__info__container} data-test="store-info-container">
      <Box className={classes.call__info__box}>
        <div className={classes.call__info__container_child}>
          <div className={classes.img__container}>
            <img
              className={classes.img__logo__card}
              src={store.logoUrl}
              data-test="central-store-logo"
            />
          </div>
          <Typography
            className={classes.store__name}
            component="p"
            variant="subtitle2"
            color="primary"
            align="center"
            justifyContent="center"
            data-test="central-store-name"
          >
            {store.name}
          </Typography>
        </div>
      </Box>
    </div>
  )
}

export { StoreInfoFloating }
