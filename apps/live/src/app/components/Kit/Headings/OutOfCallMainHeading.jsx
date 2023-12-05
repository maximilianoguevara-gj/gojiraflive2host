import styled from 'styled-components'
import { device } from '../../../constants/devices'

const OutOfCallMainHeading = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0;

  @media ${device.laptop} {
    font-size: 3rem;
    margin: 0 0 1rem;
    line-height: 1.15;
  }
`

export { OutOfCallMainHeading }
