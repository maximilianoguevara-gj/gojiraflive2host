import { http } from '../../services/baseService'
import store from '../../core/store'
import { clearCheckoutStatus } from '../../reducers/orderSlice'

const stripe = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.checkout = null
  this.order = null

  this.createQuote = ({ order }) => {
    this.order = order
  }

  this.startCheckout = async () => {
    const res = await http.post(`/api/orders/startStripe`, {
      paymentGatewayId: this.paymentGateway.id,
      order: this.order,
    })
    this.checkout = res.data
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = this.checkout.checkout
    checkoutWindow.focus()
    store.dispatch(clearCheckoutStatus())
  }
}

export default stripe
