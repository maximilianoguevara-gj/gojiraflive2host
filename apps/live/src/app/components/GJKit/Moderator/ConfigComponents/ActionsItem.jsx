import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IOSSwitch } from './Switch'
import { debounce } from 'lodash'

export const ActionsItem = ({ text, onActive, disableByProp = false, defaultState }) => {
  const [active, setActive] = useState(defaultState)
  const [disabled, setdisabled] = useState(false)

  const handleClick = () => {
    setActive(!active)
    onActive()
    setdisabled(true)
    debounceDisabled()
  }

  const debounceDisabled = debounce(() => {
    setdisabled(false)
  }, 3000)

  return (
    <ActionItem>
      <StyledText active={active}>{text}</StyledText>
      <IOSSwitch active={active} onClick={handleClick} disabled={disabled || disableByProp} />
    </ActionItem>
  )
}

const ActionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`
const StyledText = styled.p`
  color: ${({ active }) => (active ? 'black' : 'rgba(136, 136, 136, 1)')};
  font-weight: 600;
`
ActionsItem.propTypes = {
  disableByProp: PropTypes.string,
  text: PropTypes.string.isRequired,
  onActive: PropTypes.func.isRequired,
  defaultState: PropTypes.bool.isRequired,
}
