import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { selectCheckoutIframeUrl } from '../../reducers/orderSlice'

const CheckoutIframe = () => {
  return <IFrame src={useSelector(selectCheckoutIframeUrl)} />
}

const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
`

export { CheckoutIframe }
