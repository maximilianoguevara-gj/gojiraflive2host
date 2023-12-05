import styled from 'styled-components'
import { FlexContainer } from '../Kit/Container'

export const Row = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
`

export const TopNavBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: ${({ isDesktop }) => (isDesktop ? '0.5rem' : '0')};
  margin-top: ${({ isDesktop }) => (isDesktop ? '-2.5rem' : '0')};
  align-self: ${({ isDesktop }) => (isDesktop ? 'end' : 'auto')};
`

export const BaseCallLayout = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`

export const MainContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  flex-grow: 1;
`
