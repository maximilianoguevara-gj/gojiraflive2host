import { http } from '../../services/baseService'
import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'

const Shopify = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.productIds = null
  this.orderId = null

  const getIdsProducts = (orderDetails) => {
    let products = []
    orderDetails.map(({ product }) => {
      products.push({ variant_id: product.id, quantity: product.quantity })
    })
    return products
  }
  this.createQuote = ({ order }) => {
    const { orderDetails } = order
    this.productIds = getIdsProducts(orderDetails)
    this.orderId = order.id
    this.quote = {
      fullName: order.buyerName,
      phone: {
        number: order.buyerPhoneNumber,
      },
      address: this.address,
      products: this.productIds,
      quote: order,
    }
  }

  this.startCheckout = async () => {
    let response
    try {
      response = await http.post('/api/orders/startShopify', {
        paymentGateway: paymentGateway,
        orderId: this.orderId,
        quote: this.quote,
      })
    } catch (err) {
      console.error(err)
      return
    }
    this.checkout = response.data?.checkout
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = this.checkout.invoice_url
    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default Shopify
