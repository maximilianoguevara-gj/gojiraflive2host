import { http } from '../../services/baseService'
import store from '../../core/store'
import { clearCheckoutStatus } from '../../reducers/orderSlice'

const MercadoPago = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null

  this.createQuote = ({ order }) => {
    this.orderId = order.id
  }

  this.startCheckout = async () => {
    const res = await http.post(`/api/orders/startMercadoPago`, {
      paymentGatewayId: this.paymentGateway.id,
      orderId: this.orderId,
    })
    this.checkout = res.data
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = this.checkout.preference.init_point
    checkoutWindow.focus()
    store.dispatch(clearCheckoutStatus())
  }
}

export default MercadoPago
