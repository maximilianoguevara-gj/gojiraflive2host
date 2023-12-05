import React from 'react'
import PropTypes from 'prop-types'
import { useDropdownInput } from 'react-google-forms-hooks'

export const DropdownInput = ({ id }) => {
  const { register, options } = useDropdownInput(id)

  return (
    <div>
      <select {...register()}>
        <option value="">Select option</option>
        {options.map((o) => {
          return (
            <option key={o.label} value={o.label}>
              {o.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

DropdownInput.propTypes = {
  id: PropTypes.string.isRequired,
}
