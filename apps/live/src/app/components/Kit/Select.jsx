import React, { useState } from 'react'
import styled from 'styled-components'
import { MenuItem, FormControl, Select as MuiSelect, InputLabel } from '@material-ui/core'
import PropTypes from 'prop-types'

export const Select = ({ options, onChange, label, error }) => {
  const [selectedVariant, setSelectedVariant] = useState(undefined)
  const handleChange = (event) => {
    const option = event.target.value
    setSelectedVariant(option)
    onChange(option)
  }

  return (
    <StyledFormControl error={!selectedVariant && error} variant="outlined" size="small">
      {!selectedVariant && <InputLabel>{label}</InputLabel>}
      <MuiSelect error={!selectedVariant && error} value={selectedVariant} onChange={handleChange}>
        {options.map((op) => {
          return (
            <MenuItem key={op.id || op} value={op}>
              {op.name || op}
            </MenuItem>
          )
        })}
      </MuiSelect>
    </StyledFormControl>
  )
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool.isRequired,
}

const StyledFormControl = styled(FormControl)`
  .MuiInputBase-root {
    font-size: 0.625rem;
    border-radius: 2rem;
  }

  .MuiFormLabel-root {
    font-size: 0.688rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .MuiInputLabel-asterisk {
    display: none;
  }

  svg {
    color: ${({ error }) => (error ? 'rgba(234, 62, 35, 1)' : 'rgba(0, 0, 0, 0.54)')};
  }
`
