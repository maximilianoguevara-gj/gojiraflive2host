import React, { useEffect } from 'react'
import qs from 'qs'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useLogger } from '@gojiraf/logger'
import { getStoreById } from '../reducers/storeSlice'
import CheckoutFinishDialog from '../components/dialogs/checkoutFinishDialog'
import UtmUtils from '../utils/utmUtils'
import { useAuth } from '@gojiraf/auth'

export default function CheckoutSuccess({ id }) {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const { addLog } = useLogger()

  useEffect(() => {
    dispatch(getStoreById(id))
    addLog({
      event: 'CHECKOUT_FAILURE',
      data: {
        ...queryParams,
        storeId: id,
        userId: user.id,
        ...UtmUtils.getUtmObject(queryParams),
      },
    })
  }, [dispatch, id])

  return <CheckoutFinishDialog />
}

CheckoutSuccess.propTypes = {
  id: PropTypes.string,
}
