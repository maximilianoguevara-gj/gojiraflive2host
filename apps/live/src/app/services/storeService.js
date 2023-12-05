import { http } from './baseService'
import _get from 'lodash.get'
class StoreService {
  getStoreById(id) {
    return new Promise((resolve, reject) => {
      http
        .get(`/api/stores/${id}`, {
          params: {
            filter: {
              include: ['goJirafUsers', 'calendars', 'paymentGateways', 'company'],
            },
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            resolve({ store: response.data })
          } else {
            reject({ status: response.status, message: 'Store not existent' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
  getStoreIsOpen(id) {
    return new Promise((resolve, reject) => {
      http
        .get(`/api/stores/${id}/isOpen`, {})
        .then(function (response) {
          if (response.status === 200) {
            resolve({ isOpen: response.data })
          } else {
            reject({ status: response.status, message: 'Store not existent' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  callStore(goJirafUserId) {
    return new Promise((resolve, reject) => {
      http
        .get(`/api/goJirafUsers/call/${goJirafUserId}`)
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject({ status: response.status, message: 'Store not available' })
          }
        })
        .catch(function (error) {
          reject(_get(error, 'response.data.error.message', 'Call Store Failed'))
        })
    })
  }

  setFinishEventCountdown(data) {
    return new Promise((resolve, reject) => {
      http
        .post('/api/stores/setFinishEventDateTime', data)
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject({ status: response.status, message: 'Store not available' })
          }
        })
        .catch(function (error) {
          reject(_get(error, 'response.data.error.message', 'Call Store Failed'))
        })
    })
  }

  setStartEventCountdown(data) {
    return new Promise((resolve, reject) => {
      http
        .post('/api/stores/setStartEventDateTime', data)
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject({ status: response.status, message: 'Store not available' })
          }
        })
        .catch(function (error) {
          reject(_get(error, 'response.data.error.message', 'Call Store Failed'))
        })
    })
  }

  setDisplayPopUp(data) {
    return new Promise((resolve, reject) => {
      http
        .post('/api/stores/setDisplayPopUp', data)
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject({ status: response.status, message: 'Store not available' })
          }
        })
        .catch(function (error) {
          reject(_get(error, 'response.data.error.message', 'Call Store Failed'))
        })
    })
  }
}

const instance = new StoreService()
Object.freeze(instance)

export default instance
