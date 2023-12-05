import styled from 'styled-components'
import { UI_IS_TABLET } from '../../reducers/uiSlice'
import { LazyLoadImage } from 'react-lazy-load-image-component'

export const PopUpContainer = styled.div`
  align-self: center;
  border-radius: 0.5rem;
  width: 100%;
  min-height: ${({ uiSize }) => (uiSize === UI_IS_TABLET ? '6rem' : '8rem')};
  padding: 1rem;

  @media (min-height: 568px) and (max-height: 740px) {
    min-height: 4rem;
  }
`

export const PopUpImage = styled(LazyLoadImage)`
  width: 100%;
  border-radius: 0.5rem;
  cursor: ${({ isurlactive }) => (isurlactive ? 'pointer' : 'default')};
  object-position: center;
  object-fit: fill;
  filter: brightness(93%);
  box-shadow: 1px 4px 3px 0px rgba(0, 0, 0, 0.5);
`
