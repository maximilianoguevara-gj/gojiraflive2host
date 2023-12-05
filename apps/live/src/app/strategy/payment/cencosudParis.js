import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'
import { CheckoutStates } from '../../constants/checkoutStates'

const CencosudParis = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.productsParam = ''
  this.goToCheckout = CheckoutStates.STARTED

  /*
   * Contamos la cantidad de cada producto en el carrito y armamos el deepLink para el checkout
   */
  this.createQuote = ({ order }) => {
    const orderProducts = new Map()
    for (const orderDetail of order.orderDetails) {
      if (orderProducts.has(orderDetail.product.sku)) {
        orderProducts.get(orderDetail.product.sku).qty =
          orderProducts.get(orderDetail.product.sku).qty + orderDetail.product.quantity
      } else {
        orderProducts.set(orderDetail.product.sku, {
          qty: orderDetail.product.quantity,
          pid: orderDetail.product.sku,
        })
      }
    }
    let deepLink = ''
    Array.from(orderProducts.values()).forEach(function (value, i) {
      deepLink = deepLink + '&pid' + (i + 1) + '=' + value.pid + '&qty' + (i + 1) + '=' + value.qty
    })
    this.productsParam = deepLink.replace(/&/, '?')
  }

  this.startCheckout = async () => null

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = new URL(
      `${this.paymentGateway.urlCheckout}/s/Paris/cart${this.productsParam}`,
    ).toString()
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default CencosudParis
