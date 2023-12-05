import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'

const privaliaHome = function (paymentGateway) {
  this.paymentGateway = paymentGateway

  this.createQuote = () => {}

  this.startCheckout = () => {}

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = this.paymentGateway.urlCheckout
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default privaliaHome
