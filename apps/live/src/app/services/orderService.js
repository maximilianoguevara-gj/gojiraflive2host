import { http } from './baseService'

class OrderService {
  constructor() {
    if (!OrderService.instance) {
      OrderService.instance = this
    }
    return OrderService.instance
  }

  createOrder(args) {
    const order = {
      // creationDate: new Date().toISOString(),
      shippingOrderEmail: args.shippingEmail,
      storeId: args.store.id,
      sellerId: args.sellerId,
      storeName: args.store.name,
      storeEmail: args.store.email,
      storePhoneNumber: args.store.phoneNumber,
      buyerId: args.user.id,
      buyerName: args.username,
      buyerPhoneNumber: args.buyerPhoneNumber,
      buyerPhoneCode: args.buyerPhoneCode ?? '',
      paymentType: args.paymentType,
      buyerDni: args.buyerDni,
      shippingId: args.shippingId,
      shippingType: args.shippingType,
      shippingPrice: args.shippingPrice,
      utmParams: args.utmParams,
      details: args.details,
      resellerNumber: args.resellerNumber,
      zoneNumber: args.zoneNumber,
    }
    return new Promise((resolve, reject) => {
      http
        .post(`/api/orders/createOrder`, { data: order })
        .then(function (response) {
          if (response.status === 200) {
            resolve({ order: response.data })
          } else {
            reject({ status: response.status, message: 'Create Order Failure' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  startCheckoutProcessStatus(order, user) {
    return new Promise((resolve, reject) => {
      http
        .post(`/api/orders/${order.id}/checkoutProcessStarted`, {
          goJirafUserId: user.id,
        })
        .then(function (response) {
          if (response.status === 200) {
            resolve({ order: response.data })
          } else {
            reject({ status: response.status, message: 'Checkout Process Status Failure' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  getOrderById(id) {
    return new Promise((resolve, reject) => {
      http
        .get(`/api/orders/${id}`, {
          params: {
            filter: {
              include: ['orderDetails', 'shipping'],
            },
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            resolve({ order: response.data })
          } else {
            reject({ status: response.status, message: 'Order does not exist' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  sendEmails(orderId) {
    return new Promise((resolve, reject) => {
      http
        .post(`/api/orders/${orderId}/sendEmails`)
        .then(function (response) {
          if (response.status === 200) {
            resolve({ order: response.data })
          } else {
            reject({ status: response.status, message: 'Order does not exist' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
  rejectPaypal(args) {
    const order = { orderId: args.id }
    return new Promise((resolve, reject) => {
      http
        .post(`/api/orders/rejectPaypal`, order)
        .then(function (response) {
          if (response.status === 200) {
            resolve({ order: response.data })
          } else {
            reject({ status: response.status, message: 'Reject Paypal Order Failure' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  async startPaypal({ paymentGatewayId, orderId, quote }) {
    let res
    try {
      res = await http.post(`/api/orders/startPaypal`, {
        paymentGatewayId: paymentGatewayId,
        orderId: orderId,
        preference: quote,
      })
    } catch (error) {
      console.error(error)
    }

    return res.data.checkout
  }

  async paypalNotification({ paymentGatewayId, paymentToken, orderId }) {
    let res
    try {
      res = await http.post(`/api/orders/${orderId}/paypalNotification`, {
        paymentGatewayId: paymentGatewayId,
        paymentId: paymentToken,
      })
    } catch (error) {
      console.error(error)
    }

    return res.data.checkout
  }
}

const instance = new OrderService()
Object.freeze(instance)

export default instance
