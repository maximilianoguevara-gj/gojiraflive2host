import React, { useEffect } from 'react'
import qs from 'qs'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { getStoreById } from '../reducers/storeSlice'
import CheckoutFinishDialog from '../components/dialogs/checkoutFinishDialog'
import UtmUtils from '../utils/utmUtils'
import { useLogger } from '@gojiraf/logger'
import { useAuth } from '@gojiraf/auth'

export default function CheckoutPending({ id }) {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const { addLog } = useLogger()

  useEffect(() => {
    dispatch(getStoreById(id))

    addLog({
      event: 'CHECKOUT_PENDING',
      data: {
        ...queryParams,
        storeId: id,
        userId: user.id,
        ...UtmUtils.getUtmObject(queryParams),
      },
    })
  })

  return <CheckoutFinishDialog pending />
}

CheckoutPending.propTypes = { id: PropTypes.string }
