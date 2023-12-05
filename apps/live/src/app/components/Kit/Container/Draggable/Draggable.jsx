import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { selectShowDraggable, setShowDraggable } from '../../../../reducers/uiSlice'

const Draggable = ({ onClose, children, ...props }) => {
  const ref = useRef()
  const dispatch = useDispatch()
  const showDraggable = useSelector(selectShowDraggable)

  const openDraggable = () => ref.current.open()
  const closeDraggable = () => ref.current.close()

  useEffect(() => {
    if (showDraggable) {
      openDraggable()
    } else {
      closeDraggable()
    }
  }, [showDraggable])

  return (
    <div
      ref={ref}
      sheetStyle={{ position: 'absolute' }}
      touchEnable={true}
      onClose={() => {
        dispatch(setShowDraggable(false))
        onClose
      }}
      {...props}
    >
      {children}
    </div>
  )
}

Draggable.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.element,
}

export { Draggable }
