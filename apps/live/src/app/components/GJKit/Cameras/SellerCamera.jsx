import React from 'react'
import PropTypes from 'prop-types'
import { UserBox } from './UserBox'

const SellerCamera = ({ video, ...props }) => {
  return <UserBox userName={'Seller'} videoTrack={video} {...props} />
}

SellerCamera.propTypes = {
  video: PropTypes.object,
}

export { SellerCamera }
