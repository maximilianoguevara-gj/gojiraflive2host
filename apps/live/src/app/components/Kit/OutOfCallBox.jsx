import styled from 'styled-components'
import { device } from '../../constants/devices'

const OutOfCallBox = styled.div`
  padding: 2rem;
  margin: auto 2rem;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;

  p {
    font-weight: 500;
    font-size: 0.875rem;
    letter-spacing: 1px;
    margin: 1rem 0;

    small {
      font-size: 0.75rem;
      line-height: 1em;
    }

    @media ${device.laptop} {
      font-size: 1.5rem;
      font-weight: 400;
    }
  }

  form {
    width: fit-content;
  }

  .MuiFormControl-root {
    width: unset;
  }

  .MuiFormLabel-root,
  .MuiInputBase-root {
    color: white;
  }

  .MuiInputBase-root::before,
  .MuiInputBase-root::after {
    border-color: white !important;
  }

  @media ${device.laptop} {
    padding: 3rem;
    margin: auto 5rem;
    max-width: 60%;
    align-self: flex-start;

    .MuiButtonBase-root {
      margin: 1rem 0;
    }
  }
`

export { OutOfCallBox }
