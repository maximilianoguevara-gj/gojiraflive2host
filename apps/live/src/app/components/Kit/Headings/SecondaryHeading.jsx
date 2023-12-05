import styled from 'styled-components'

import { device } from '../../../constants/devices'

export const SecondaryHeading = styled.h2`
  font-size: 0.875rem;
  line-height: 1em;
  font-weight: 600;
  letter-spacing: 0.1px;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media ${device.laptop} {
    font-size: 1rem;
    margin-top: 1.5rem;
  }
`
export const AuxiliarHeading = styled.h2`
  margin-top: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 0.5rem;
`
