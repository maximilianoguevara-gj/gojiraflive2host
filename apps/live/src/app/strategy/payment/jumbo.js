import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'

const Jumbo = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null
  this.quantity = []

  this.createQuote = ({ order }) => {
    this.quote = order
  }

  this.startCheckout = async () => null

  this.goToCheckout = ({ checkoutWindow }) => {
    const skus = this.quote.orderDetails
      .map((detail) => {
        this.quantity.push(detail.product.quantity)
        return detail.product.sku
      })
      .filter((sku) => Boolean(sku))
      .reduce((skus, sku) => (skus ? [skus, sku].join(',') : sku), '')
    const qty = this.quantity.join(',')
    checkoutWindow.location.href = `https://www.jumbo.cl/?sku=${skus}&quantity=${qty}&action=highest`
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default Jumbo
