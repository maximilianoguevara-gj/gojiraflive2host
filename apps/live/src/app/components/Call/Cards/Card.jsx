import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { closeCallCard } from '../../../reducers/uiSlice'
import { DraggableContainer } from '../../Kit/Container'
import { setCheckoutStarted } from '../../../reducers/orderSlice'

const DragBarContainer = styled.div`
  padding: 0.75rem;
`

const DragHandle = styled.div`
  background-color: #c4c4c4;
  width: 45px;
  height: 5px;
  border-radius: 2px;
  margin: auto;
`

const DragBar = () => (
  <DragBarContainer>
    <DragHandle></DragHandle>
  </DragBarContainer>
)

const CardContainer = styled(DraggableContainer)`
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 2;
`

const CardContent = styled.section`
  padding: 0 2rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px -3px 5px -1px rgb(0 0 0 / 20%), 0px -6px 10px 0px rgb(0 0 0 / 14%),
    0px -1px 18px 0px rgb(0 0 0 / 12%);
  background-color: white;
  overflow: hidden;
`

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
        {children}
      </CardContent>
    </CardContainer>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
}
