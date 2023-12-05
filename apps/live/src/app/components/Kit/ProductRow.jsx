import styled from 'styled-components'

export const ProductRow = styled.div`
  display: flex;
  margin: 0.75rem 0;
  gap: 0.75rem;
  position: relative;
`

export const ProductMiddleCol = styled.div`
  flex-grow: 1;
  overflow: hidden;
`

export const ProductDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5;
  max-height: 3em;
`
export const ProductMoreVariants = styled.span`
  font-size: 0.688rem;
  font-style: normal;
  font-weight: normal;
`
export const ProductRightCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`

export const ProductPrice = styled.div`
  margin: 0;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: end;
`
