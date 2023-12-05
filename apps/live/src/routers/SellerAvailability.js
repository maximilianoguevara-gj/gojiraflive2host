import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectCurrentStore, selectSellerIsAvailable } from '../app/reducers/storeSlice'

export const SellerAvailability = ({ children }) => {
  const location = useLocation()
  const { isAvailable, meetingIsFull } = useSelector(selectSellerIsAvailable)
  const store = useSelector(selectCurrentStore)

  if (!isAvailable || meetingIsFull) {
    return <Navigate to={`/seller-not-available/${store.id}`} state={{ from: location }} />
  }
  return children
}

SellerAvailability.propTypes = {
  children: PropTypes.element,
}
