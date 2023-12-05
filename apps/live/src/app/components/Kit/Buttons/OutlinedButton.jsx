import React from 'react'
import styled from 'styled-components'

import { Button } from './Button'

const StyledOutlinedButton = styled(Button)`
  font-size: 0.5625rem;
  font-weight: 500;
  letter-spacing: 2px;
`

export const OutlinedButton = ({ ...props }) => (
  <StyledOutlinedButton variant="outlined" {...props} />
)
