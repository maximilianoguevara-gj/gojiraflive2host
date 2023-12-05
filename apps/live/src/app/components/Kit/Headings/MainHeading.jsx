import styled from 'styled-components'

import { device } from '../../../constants/devices'

export const MainHeading = styled.h2`
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.05rem;
  line-height: 0.75rem;

  @media ${device.laptop} {
    font-size: 1.5rem;
    font-weight: 500;
  }
`
