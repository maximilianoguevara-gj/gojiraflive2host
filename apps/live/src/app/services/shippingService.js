import PaymentGateways from '../strategy/payment/constants'
import { http } from './baseService'

class ShippingService {
  constructor() {
    if (!ShippingService.instance) {
      ShippingService.instance = this
    }
    return ShippingService.instance
  }

  createShipping(data) {
    const { fullName, shipping, paymentType, directionObject } = data
    const floorApartment = shipping.floorApartment ?? ''
    let payload = {
      fullName: fullName,
      creationDate: new Date().toISOString(),
    }

    if (paymentType === PaymentGateways.ESSEN_ECOMMERCE) {
      const address = {
        stateId: directionObject.provinciaId,
        townHallId: directionObject.partidoId,
        townHall: directionObject.partido,
        location: directionObject.localidad,
        locationId: directionObject.localidadId,
        neighborhoodId: directionObject.barrioId,
        neighborhood: directionObject.barrio,
        street: shipping.address,
        streetNumber: shipping.number,
        floor: shipping.floor || 'N/A',
        department: shipping.apartment || 'N/A',
        postcode: shipping.postalCode,
        betweenStreetsNumberOne: shipping.betweenStreetNumberOne,
        betweenStreetsNumberTwo: shipping.betweenStreetNumberTwo,
      }
      payload = { ...payload, ...address }
    } else {
      payload.address = `${
        shipping.number
          ? shipping.address + ' ' + shipping.number + ' ' + floorApartment
          : shipping.address
      }`
      payload.street = shipping.address
      payload.number = shipping.number
      payload.floor = floorApartment
      payload.city = shipping.city
      payload.postalCode = shipping.postalCode
      payload.region = shipping.region
      payload.colony = shipping.colony || ''
    }

    return new Promise((resolve, reject) => {
      http
        .post(`/api/shippings`, payload)
        .then(function (response) {
          if (response.status === 200) {
            resolve({ shipping: response.data })
          } else {
            reject({ status: response.status, message: 'Create Shipping Failure' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  setOrderId(shippingId, orderId) {
    return new Promise((resolve, reject) => {
      http
        .patch(`/api/shippings/${shippingId}`, {
          orderId,
        })
        .then(function (response) {
          if (response.status === 200) {
            resolve({ shipping: response.data })
          } else {
            reject({ status: response.status, message: 'Update Shipping Failure' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
}

const instance = new ShippingService()
Object.freeze(instance)

export default instance
