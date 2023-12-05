import React from 'react'
import PropTypes from 'prop-types'
import { MainHeading } from './style'

export const ChatHeader = ({ isModerator = false, usersCount }) => {
  return (
    <MainHeading data-test="main-heading-text">
      Chat{isModerator ? ` (${usersCount})` : ''}
    </MainHeading>
  )
}

ChatHeader.propTypes = {
  isModerator: PropTypes.bool,
  usersCount: PropTypes.number.isRequired,
}
