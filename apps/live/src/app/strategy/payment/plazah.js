import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'
import { CheckoutStates } from '../../constants/checkoutStates'

const plazaH = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.productList = []
  this.goToCheckout = CheckoutStates.STARTED

  this.createQuote = ({ order }) => {
    const products = []
    order.orderDetails.forEach((orderDetail) => {
      let i = 0
      while (i < orderDetail.product.quantity) {
        products.push(orderDetail)
        i++
      }
    })
    products.reduce((_, orderDetail) => {
      this.productList.push(orderDetail.product.sku)
    }, {})
  }

  this.startCheckout = async () => null

  this.goToCheckout = ({ checkoutWindow }) => {
    let productsParam = '?' + this.productList.join('&')
    checkoutWindow.location.href = new URL(
      `${this.paymentGateway.urlCheckout}/cart_add/${this.paymentGateway.sellerExternalId}` +
        productsParam,
    ).toString()
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default plazaH
