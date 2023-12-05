import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Switch } from '@material-ui/core'

export const IOSSwitch = ({ active = false, onClick, disabled }) => {
  return <StyledSwitch checked={active} onChange={onClick} name="IOSSwitch" disabled={disabled} />
}

const StyledSwitch = styled(Switch).attrs(() => ({
  classes: {
    root: 'root',
    switchBase: 'switchBase',
    thumb: 'thumb',
    track: 'track',
    checked: 'checked',
    focusVisible: 'focusVisible',
  },
  disableRipple: true,
  focusVisibleClassName: 'focusVisible',
}))`
  &.root {
    width: 42px;
    height: 26px;
    padding: 0;
    margin: 0px;
  }

  .switchBase {
    padding: 1px;

    &.checked {
      transform: translateX(16px);
      color: white;
      & + .track {
        background-color: #52d869;
        opacity: 1;
        border: none;
      }
    }

    &.focusVisible &.thumb {
      color: #52d869;
      border: 6x sold #fff;
    }
  }

  .thumb {
    width: 24px;
    height: 24px;
  }

  & .track {
    border-radius: 13px;
    border: 1px solid #bdbdbd;
    background-color: #c4c4c4;
    opacity: 1;
    transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
      border 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .checked {
  }
  .focusVisible {
  }
`
IOSSwitch.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}
