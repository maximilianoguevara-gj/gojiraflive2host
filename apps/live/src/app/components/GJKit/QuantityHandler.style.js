import styled from 'styled-components'

import { Add, Remove } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'

export const QuantityItem = styled(IconButton)`
  padding: 2px;
`

export const QuantityProduct = styled.div`
  display: ${({ isCartProduct }) => (isCartProduct ? 'flex' : 'inline-flex')};
  grid-column: ${({ isCartProduct }) => (isCartProduct ? 'auto' : '3')};
  height: ${({ isCartProduct }) => (isCartProduct ? 'auto' : '100%')};
  align-self: end;
  align-items: center;
  justify-content: end;
  font-weight: 500;
`

export const InputQuantity = styled.input`
  width: ${({ isCartProduct }) => (isCartProduct ? '1.75rem' : '25%')};
  height: ${({ isCartProduct }) => (isCartProduct ? '1.75rem' : 'auto')};
  text-align: center;
  border: 0;
  font-size: 0.9rem;

  &:focus {
    outline: none;
  }
`

export const AddButton = styled(Add)`
  color: rgba(80, 85, 92, 1);
`

export const RemoveButton = styled(Remove)`
  color: rgba(80, 85, 92, 1);
`
