import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { selectUiSize, UI_IS_LAPTOP } from '../../../reducers/uiSlice'
import { ArrowDownward } from '@material-ui/icons'
import { ArrowDownScroll } from '../style'

export const ScrollToBottom = ({ showNotification, onClick, isMessageListScrolledToBottom }) => {
  const chatSize = useSelector(selectUiSize)
  const displayScrolltoBottom = !isMessageListScrolledToBottom || showNotification

  return (
    <>
      {displayScrolltoBottom && (
        <ArrowDownScroll
          onClick={onClick}
          size={chatSize === UI_IS_LAPTOP ? 'medium' : 'small'}
          color="secondary"
        >
          <ArrowDownward />
        </ArrowDownScroll>
      )}
    </>
  )
}

ScrollToBottom.propTypes = {
  showNotification: PropTypes.bool,
  onClick: PropTypes.func,
  isMessageListScrolledToBottom: PropTypes.bool,
}
