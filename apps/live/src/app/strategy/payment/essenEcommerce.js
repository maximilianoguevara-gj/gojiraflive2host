import store from '../../core/store'
import { setCheckoutFinishedSuccess } from '../../reducers/orderSlice'
import { http } from '../../services/baseService'
import { CheckoutStates } from '../../constants/checkoutStates'
import { setPostalCodeErrorMessage } from '../../reducers/uiSlice'

const EssenEcommerce = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null
  this.productList = []
  this.address = null
  this.checkoutInitializeStatus = CheckoutStates.STARTED

  this.createQuote = ({ order }) => {
    order.orderDetails.reduce((_, orderDetail) => {
      this.productList.push({
        sku: orderDetail.product.sku,
        qty: orderDetail.product.quantity,
      })
    }, {})
    this.address = {
      stateId: order.shipping.stateId,
      townHallId: order.shipping.townHallId,
      townHall: order.shipping.townHall,
      location: order.shipping.location,
      locationId: order.shipping.locationId,
      neighborhoodId: order.shipping.neighborhoodId,
      neighborhood: order.shipping.neighborhood,
      street: order.shipping.street,
      streetNumber: order.shipping.streetNumber,
      floor: order.shipping.floor,
      department: order.shipping.department,
      postcode: order.shipping.postcode,
      betweenStreetsNumberOne: order.shipping.betweenStreetsNumberOne,
      betweenStreetsNumberTwo: order.shipping.betweenStreetsNumberTwo,
    }
    this.orderId = order.id
    this.quote = {
      fullName: order.buyerName,
      email: order.shippingOrderEmail,
      phone: {
        code: order.buyerPhoneCode,
        number: order.buyerPhoneNumber,
      },
      address: this.address,
      products: this.productList,
    }
  }

  this.startCheckout = async () => {
    let response
    try {
      response = await http.post('/api/orders/startEssenEcommerce', {
        paymentGatewayId: this.paymentGateway.id,
        orderId: this.orderId,
        quote: this.quote,
      })
    } catch (err) {
      console.error(err)
      const errorMessage = err.response.data.error.message
      let postalCodeError = ''
      if (errorMessage.includes('El codigo postal es erroneo.')) {
        postalCodeError = errorMessage.substr(errorMessage.indexOf(':') + 1)
        postalCodeError = postalCodeError.split(',')
        postalCodeError = postalCodeError.filter(Number)
        postalCodeError = postalCodeError.join(' / ')
      }
      switch (err.response.status) {
        case 404:
          store.dispatch(setPostalCodeErrorMessage(''))
          this.checkoutInitializeStatus = CheckoutStates.INSUFFICIENT_STOCK
          break
        case 400:
          if (postalCodeError) {
            store.dispatch(setPostalCodeErrorMessage(postalCodeError))
          }
          this.checkoutInitializeStatus = CheckoutStates.NOT_INITIALIZED
          break
        default:
          store.dispatch(setPostalCodeErrorMessage(''))
          this.checkoutInitializeStatus = CheckoutStates.NOT_INITIALIZED
          break
      }
      return this.checkoutInitializeStatus
    }

    this.checkout = response.data
    return this.checkoutInitializeStatus
  }

  this.goToCheckout = ({ checkoutWindow }) => {
    checkoutWindow.location.href = new URL(`${this.checkout.checkout.url}`).toString()

    checkoutWindow.focus()
    store.dispatch(setCheckoutFinishedSuccess(true))
  }
}

export default EssenEcommerce
