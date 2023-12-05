import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'

const Fenicio = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null
  this.products = []

  this.createQuote = ({ order }) => {
    this.quote = order
  }

  this.startCheckout = async () => null

  this.goToCheckout = ({ checkoutWindow }) => {
    this.quote.orderDetails.forEach((orderDetail) => {
      let i = 0
      while (i < orderDetail.product.quantity) {
        this.products.push(orderDetail)
        i++
      }
    })

    const productSkus = this.products
      .map(({ product }) => product.sku)
      .filter((id) => id)
      .join('|')
    const checkoutUrl = new URL('/generar-compra', this.paymentGateway.urlCheckout)
    checkoutUrl.searchParams.set('skus', productSkus)

    checkoutWindow.location.href = checkoutUrl.toString()
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default Fenicio
