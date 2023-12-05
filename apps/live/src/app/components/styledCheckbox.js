import React from 'react'
import Checkbox from '@mui/material/Checkbox'

export default function StyledCheckbox(props) {
  return (
    <Checkbox
      color="default"
      sx={{
        padding: 0,
        '&.Mui-checked': {
          color: 'black',
        },
      }}
      disableRipple
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  )
}
