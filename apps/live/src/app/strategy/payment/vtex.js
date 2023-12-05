import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'
import { http } from '../../services/baseService'

const Vtex = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.checkout = null
  this.orderId = null

  this.createQuote = ({ order }) => {
    this.orderId = order.id
  }

  this.startCheckout = async () => {
    let response
    try {
      response = await http.post('/api/orders/startVtexCheckout', {
        paymentGatewayId: this.paymentGateway.id,
        orderId: this.orderId,
      })
    } catch (err) {
      console.error(err)
      return
    }

    this.checkout = response.data
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = new URL(`${this.checkout.checkout.url}`).toString()
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default Vtex
