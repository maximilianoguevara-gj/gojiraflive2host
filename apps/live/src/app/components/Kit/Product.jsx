import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { FlexContainer } from './Container'

const Product = ({ product: { id = '', imageUrl = '' }, large = false, onProductClicked }) => {
  return (
    <ProductContainer
      large={large}
      onClick={onProductClicked && (() => onProductClicked(id))}
      data-test="product-image-container"
    >
      <ProductImage data-test="product-preview-image" large={large} src={imageUrl} />
    </ProductContainer>
  )
}
Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
  }),
  large: PropTypes.bool,
  onProductClicked: PropTypes.func,
}

const ProductContainer = styled(FlexContainer)`
  width: ${(props) => (props.large ? '5em' : '4.75em')};
  height: ${(props) => (props.large ? '5em' : '4.75em')};
  border-radius: 0.5em;
  position: relative;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'initial')};
`

const ProductImage = styled.img`
  width: ${(props) => (props.large ? '5em' : '4.75em')};
  height: ${(props) => (props.large ? '5em' : '4.75em')};
  border-radius: 0.5em;
  object-fit: cover;
  cursor: default;
  pointer-events: none;
`

const PricedProduct = ({ product: { id = '', imageUrl = '' }, onProductClicked }) => {
  return (
    <ProductContainer onClick={() => onProductClicked(id)}>
      <ProductImage src={imageUrl} />
    </ProductContainer>
  )
}

PricedProduct.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    dueQuantity: PropTypes.number,
    dueValue: PropTypes.number,
  }),
  onProductClicked: PropTypes.func,
}

export { Product, PricedProduct }
