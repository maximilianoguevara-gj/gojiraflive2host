import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ActionBar } from './ActionBar'
import { CallAction } from './CallAction'

const CallBottomContainer = ({ onCallFinished, isDesktop }) => {
  const [{ initChat }, setInitChat] = useState({ initChat: () => {} })
  return (
    <>
      {!isDesktop && <CallAction onCallFinished={onCallFinished} setInitChat={setInitChat} />}
      <ActionBar initChat={initChat} />
    </>
  )
}

CallBottomContainer.propTypes = {
  onCallFinished: PropTypes.func.isRequired,
  isDesktop: PropTypes.bool.isRequired,
}

export { CallBottomContainer }
