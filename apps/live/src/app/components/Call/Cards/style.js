import styled from 'styled-components'
import { DraggableContainer } from '../../Kit/Container'

export const DragBarContainer = styled.div`
  padding: 0.75rem;
`

export const DragHandle = styled.div`
  background-color: #c4c4c4;
  width: 45px;
  height: 5px;
  border-radius: 2px;
  margin: auto;
`
export const CardContainer = styled(DraggableContainer)`
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 2;
`

export const CardContent = styled.section`
  padding: 0 2rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px -3px 5px -1px rgb(0 0 0 / 20%), 0px -6px 10px 0px rgb(0 0 0 / 14%),
    0px -1px 18px 0px rgb(0 0 0 / 12%);
  background-color: white;
  overflow-y: hidden;
  display: block;
`

export const ContainerWithTransparentScroll = styled.div`
  display: absolute;
  max-height: 83vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
`
