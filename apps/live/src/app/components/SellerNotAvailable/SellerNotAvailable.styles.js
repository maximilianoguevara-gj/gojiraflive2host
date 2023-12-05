import styled from 'styled-components'
import { StyledImage } from '../../styles/LoadingLayout.styles'
import { PhoneContainer } from '../Kit/Container/PhoneContainer'

export const ButtonsContainer = styled.div`
  min-height: ${({ minHeight }) => minHeight}
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

export const StyledPhoneContainer = styled(PhoneContainer)`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  align-items: center;
`

export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 2rem;
  padding: 0 2rem;
`

export const Paragraph = styled.p`
  font-size: 1.125rem;
`

export const CustomLogo = styled(StyledImage)`
  margin-top: 6rem;
`

export const StyledTextContainer = styled.div`
  line-height: normal;
  h1 {
    font-size: 1.625rem;
    margin-top: 0;
    margin-bottom: 1rem;
    font-weight: 600;
  }
`
