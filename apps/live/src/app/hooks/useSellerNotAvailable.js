import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setSellerIsAvailable } from '../reducers/storeSlice'

export const useSellerNotAvailable = (store) => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(setSellerIsAvailable(true))
    if (!store) {
      navigate(`/store/${params.storeId}`)
    } else {
      setIsLoading(false)
    }
  }, [])

  return { isLoading }
}

useSellerNotAvailable.propTypes = {
  store: PropTypes.object.isRequired,
}
