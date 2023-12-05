import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { closeCallCard } from '../../../reducers/uiSlice'
import { setCheckoutStarted } from '../../../reducers/orderSlice'
import {
  CardContainer,
  CardContent,
  ContainerWithTransparentScroll,
  DragBarContainer,
  DragHandle,
} from './style'

const DragBar = () => (
  <DragBarContainer>
    <DragHandle></DragHandle>
  </DragBarContainer>
)

export const Card = ({ children }) => {
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(closeCallCard())
    dispatch(setCheckoutStarted(false))
  }
  return (
    <CardContainer onClose={handleClose}>
      <CardContent>
        <DragBar />
        <ContainerWithTransparentScroll>{children}</ContainerWithTransparentScroll>
      </CardContent>
    </CardContainer>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
}
