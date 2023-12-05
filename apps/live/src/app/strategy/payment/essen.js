import store from '../../core/store'
import { http } from '../../services/baseService'
import { clearCheckoutStatus, setCheckoutIframeUrl } from '../../reducers/orderSlice'
import { closeCallCard, showCheckoutIframe } from '../../reducers/uiSlice'

const Essen = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null

  this.createQuote = ({ order }) => {
    this.orderId = order.id
    this.quote = {
      orderId: order.id,
      sellerExternalId: this.paymentGateway.sellerExternalId,
      clientEmail: order.shippingOrderEmail,
    }
  }

  this.startCheckout = async () => {
    const res = await http.post(`/api/orders/startEssen`, this.quote)
    this.checkout = res.data.checkout
  }

  this.goToCheckout = () => {
    store.dispatch(setCheckoutIframeUrl({ url: this.checkout.url }))
    store.dispatch(showCheckoutIframe())
    store.dispatch(clearCheckoutStatus())
    store.dispatch(closeCallCard())
  }
}

export default Essen
