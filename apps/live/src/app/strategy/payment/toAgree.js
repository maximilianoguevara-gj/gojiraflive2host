import store from '../../core/store'
import { sendEmails, setCheckoutFinishedSuccess } from '../../reducers/orderSlice'

const toAgree = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null

  this.createQuote = () => null

  this.startCheckout = async () => null

  this.goToCheckout = () => {
    store.dispatch(sendEmails())
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default toAgree
