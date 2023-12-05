import { http } from './baseService'

const fields = {
  price: true,
  originalPrice: true,
  thirdPrice: true,
  externalId: true,
  dueQuantity: true,
  dueValue: true,
  description: true,
  imageUrl: true,
  sku: true,
  id: true,
  variantId: true,
  variantOptions: true,
  variants: true,
}
class ProductService {
  getProductsByListIds(productListIds) {
    return new Promise((resolve, reject) => {
      http
        .get(`/api/products`, {
          params: {
            filter: {
              include: [
                {
                  variant: ['options'],
                },
              ],
              where: {
                id: { inq: this.getProductsIds(productListIds) },
              },
              fields,
            },
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject({ status: response.status, message: 'Product does not exist' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }

  async getExternalProductsByListIds(storeId, productListIds) {
    let idsToFilter = []

    for (let p of productListIds) {
      idsToFilter.push(p.id)
    }

    const body = JSON.stringify({ storeId: storeId, page: 0, size: 100, ids: idsToFilter })

    const response = await http.post(
      new URL('/Prod/products', process.env.REACT_APP_PRODUCTS_SERVICE).toString(),
      body,
    )

    return response.data.products
  }

  getProductsIds(productsList) {
    let productsIds = []
    for (const product of productsList) {
      productsIds.push(product.id)
    }

    return productsIds
  }

  createOrderDetail(orderId, product, variantOption) {
    return new Promise((resolve, reject) => {
      http
        .post(`/api/orders/${orderId}/orderDetails`, {
          orderId,
          product,
          variantOption,
        })
        .then(function (response) {
          if (response.status === 200) {
            resolve({ orderDetail: response.data })
          } else {
            reject({ status: response.status, message: 'Create Order Detail Failed!' })
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
}

const instance = new ProductService()
Object.freeze(instance)

export default instance
