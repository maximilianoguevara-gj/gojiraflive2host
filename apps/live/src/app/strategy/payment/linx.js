import { http } from '../../services/baseService'
import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'

const Linx = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.productIds = null
  this.orderId = null
  this.lang = 'es'

  this.createQuote = ({ order, productsList, store }) => {
    this.lang = store.lang ?? this.lang
    this.orderId = order.id
    this.quote = {
      items: order.orderDetails.map((detail) => {
        return {
          ProductID: productsList.find((product) =>
            product.skus.some((sku) => sku.id == detail.product.skuId),
          ).id,
          SkuID: detail.product.skuId,
          Quantity: detail.product.quantity,
        }
      }),
    }
  }

  this.startCheckout = async () => {
    let response
    try {
      response = await http.post('/api/orders/startLinx', {
        paymentGateway: paymentGateway,
        orderId: this.orderId,
        quote: this.quote,
      })
    } catch (err) {
      console.error(err)
      return
    }
    this.basketId = response.data?.preference?.basketId
    this.sessionId = response.data?.preference?.sessionId
    this.checkoutUrl = response.data?.preference?.checkoutUrl
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    const redirectUrl = new URL(`${window.location.origin}/linx/redirect`)
    redirectUrl.searchParams.append('BasketID', this.basketId)
    redirectUrl.searchParams.append('SessionID', this.sessionId)
    redirectUrl.searchParams.append('CheckoutURL', this.checkoutUrl)
    redirectUrl.searchParams.append('lang', this.lang)
    checkoutWindow.location.href = redirectUrl
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default Linx
