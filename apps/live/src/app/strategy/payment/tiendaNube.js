import { http } from '../../services/baseService'
// import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'
import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'
import { CheckoutStates } from '../../constants/checkoutStates'

const TiendaNube = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null
  this.products = null
  this.checkoutInitializeStatus = CheckoutStates.STARTED

  this.createQuote = ({ order, orderData }) => {
    const products = []
    order.orderDetails.forEach(({ product }) => {
      products.push({ variant_id: product.id, quantity: product.quantity })
    })
    this.products = products
    this.orderId = order.id
    this.quote = orderData
  }

  this.startCheckout = async () => {
    let response
    try {
      response = await http.post('/api/orders/startTiendaNube', {
        paymentGatewayId: this.paymentGateway.id,
        products: this.products,
        quote: this.quote,
        orderId: this.orderId,
      })
    } catch (err) {
      if (err.response.status === 500) {
        this.checkoutInitializeStatus = CheckoutStates.INSUFFICIENT_STOCK
        return this.checkoutInitializeStatus
      }
      this.checkoutInitializeStatus = CheckoutStates.NOT_INITIALIZED
      return this.checkoutInitializeStatus
    }
    this.checkout = response.data.checkout
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = this.checkout.checkout_url
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default TiendaNube
