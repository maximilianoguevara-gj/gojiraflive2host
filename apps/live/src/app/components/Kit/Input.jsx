import React from 'react'
import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import PropTypes from 'prop-types'

import { device } from '../../constants/devices'

const StyledTextField = styled(TextField)`
  font-size: 0.75rem;
  margin-bottom: 0.75em;
  width: 75%;
  z-index: 1;
  /* Chrome, Safari, Edge, Opera */
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  @media ${device.laptop} {
    font-size: 0.7rem;
  }

  .MuiInputBase-root {
    font-size: inherit;
  }

  .MuiInputBase-input {
    padding: 1rem 0;
    @media ${device.laptop} {
      padding: 0.533rem 0;
    }
    font-size: inherit;
  }

  .MuiFormLabel-root {
    font-size: inherit;
  }
  .MuiFormLabel-colorSecondary.Mui-focused {
    color: #000000;
  }

  .MuiInput-colorSecondary.MuiInput-underline:after {
    border-bottom-color: #000000;
  }
`

export const Input = React.forwardRef(({ ...props }, ref) => (
  <StyledTextField
    size="small"
    autoComplete="off"
    inputRef={ref}
    {...props}
    InputProps={{
      inputProps: { min: 0 },
      endAdornment: props.showPasswordIcon,
    }}
  />
))

Input.displayName = 'Input'

Input.propTypes = {
  ref: PropTypes.func,
  inputProps: PropTypes.object,
  showPasswordIcon: PropTypes.object,
}
