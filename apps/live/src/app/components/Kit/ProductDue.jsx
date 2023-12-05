import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ProductPrice } from './ProductRow'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { formatNumber } from 'ui'

export const ProductDueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0.75em 0;
`
export const TotalWithDue = styled.div`
  display: flex;
  text-align: right;
  margin: 1em 0;
  font-size: 0.75rem;

  span {
    margin-right: 1em;
  }
`
export const ProductDueDescription = styled.p`
  margin: 0;
  color: #888888;
  font-size: 0.5rem;
  font-weight: 600;
`
const ProductPriceWithDueContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 0.75rem;
  align-items: flex-end;
  justify-content: space-between;
`

export const ProductPriceWithDue = ({ product }) => {
  const { t } = useTranslation()

  const store = useSelector(selectCurrentStore)

  return (
    <ProductPriceWithDueContainer data-test="cart-product-with-due-container">
      <ProductDueDescription data-test="cart-product-with-due-drescription">
        {product.dueQuantity} {t('products.installments')}
      </ProductDueDescription>
      <ProductPrice data-test="cart-product-with-due-price">
        {formatNumber({ countryCode: store.countryCode, num: product.dueValue })}
      </ProductPrice>
    </ProductPriceWithDueContainer>
  )
}

ProductPriceWithDue.propTypes = {
  product: PropTypes.object,
}
