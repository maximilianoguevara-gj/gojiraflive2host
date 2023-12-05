import store from '../../core/store'
import { CheckoutStates } from '../../constants/checkoutStates'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'

const Carso = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.product = []
  this.goToCheckout = CheckoutStates.STARTED
  this.redirectUrl = null
  this.carsoAccessToken = ''

  this.createQuote = () => {}

  this.startCheckout = () => {}

  this.goToCheckout = () => {
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default Carso
