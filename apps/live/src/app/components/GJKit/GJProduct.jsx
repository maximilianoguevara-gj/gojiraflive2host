import React from 'react'
import { PricedProduct, Product } from '../Kit/Product'

const GJProduct = (props) => {
  return <Product {...props} />
}

const GJPricedProduct = (props) => {
  return <PricedProduct {...props} />
}

export { GJProduct, GJPricedProduct }
