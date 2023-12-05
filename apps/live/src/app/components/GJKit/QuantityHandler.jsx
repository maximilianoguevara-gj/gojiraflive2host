import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Product } from '../Kit/Product'
import { useDispatch } from 'react-redux'
import { setQuantity } from '../../reducers/cartSlice'
import { TrashIconSVG } from '../../assets/svg/TrashIconSVG'
import {
  AddButton,
  InputQuantity,
  QuantityItem,
  QuantityProduct,
  RemoveButton,
} from './QuantityHandler.style'

export const QuantityHandler = ({
  selectedItem,
  product,
  handleDelete,
  isCartProduct = false,
  setProductQuantityPDP,
}) => {
  const dispatch = useDispatch()
  const [productQuantity, setProductQuantity] = useState(product.quantity || 1)

  const subtractProductQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity((prev) => Math.max(prev - 1))
    }
  }
  const addProductQuantity = () => {
    if (productQuantity < 10) {
      setProductQuantity((prev) => Math.max(prev + 1))
    }
  }

  const handleSubtract = (product) => {
    if (productQuantity == 1 && isCartProduct) {
      handleDelete(product)
    } else {
      subtractProductQuantity()
    }
  }

  useEffect(() => {
    if (!isCartProduct) {
      setProductQuantityPDP(productQuantity)
    } else {
      dispatch(
        setQuantity({
          uid: product.uid,
          quantity: productQuantity,
          total: productQuantity * product.price,
        }),
      )
    }
  }, [productQuantity, selectedItem])

  return (
    <>
      <QuantityProduct isCartProduct={isCartProduct} data-test="quantity-options">
        <QuantityItem onClick={() => handleSubtract(product)} data-test="subtract-button">
          {productQuantity == 1 && isCartProduct ? <TrashIconSVG /> : <RemoveButton />}
        </QuantityItem>

        <InputQuantity
          isCartProduct={isCartProduct}
          data-test="quantity-input"
          type="text"
          readOnly
          value={productQuantity}
        />
        <QuantityItem data-test="add-button">
          <AddButton onClick={addProductQuantity} />
        </QuantityItem>
      </QuantityProduct>
    </>
  )
}

QuantityHandler.propTypes = {
  product: PropTypes.objectOf(Product.propTypes),
  handleDelete: PropTypes.func,
  isCartProduct: PropTypes.bool,
  selectedItem: PropTypes.number,
  setProductQuantityPDP: PropTypes.func,
}
