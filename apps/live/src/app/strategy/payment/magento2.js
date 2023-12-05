import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'
import { http } from '../../services/baseService'

const Magento2 = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null

  this.createQuote = ({ order }) => {
    this.orderId = order.id
    this.quote = order.orderDetails.reduce((cartItems, orderDetail) => {
      const productExists = cartItems[orderDetail.product.sku]
      const qty = orderDetail.product.quantity
      cartItems[orderDetail.product.sku] = productExists ? productExists + qty : qty
      return cartItems
    }, {})
  }

  this.startCheckout = async () => {
    let response
    try {
      response = await http.post('/api/orders/startMagento2', {
        paymentGatewayId: this.paymentGateway.id,
        orderId: this.orderId,
        quote: this.quote,
      })
    } catch (err) {
      console.error(err)
      return
    }

    this.checkout = response.data
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = new URL(
      `/gojiraf/cart/redirect?CART_ID=${this.checkout.checkout.quoteId}`,
      this.paymentGateway.urlCheckout,
    ).toString()
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default Magento2
