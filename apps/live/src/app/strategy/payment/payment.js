import PaymentGateways from './constants'

import Cash from './cash'
import Essen from './essen'
import Fenicio from './fenicio'
import Jumbo from './jumbo'
import MercadoPago from './mercadoPago'
import Paypal from './paypal'
import Vtex from './vtex'
import Magento2 from './magento2'
import TiendaNube from './tiendaNube'
import EssenEcommerce from './essenEcommerce'
import plazaH from './plazah'
import CencosudParis from './cencosudParis'
import Shopify from './shopify'
import Carso from './carso'
import toAgree from './toAgree'
import stripe from './stripe'
import privaliaHome from './privaliaHome'
import Linx from './linx'

class Payment {
  constructor(paymentGateway) {
    let PaymentMethod = null
    switch (paymentGateway.type) {
      case PaymentGateways.MERCADO_PAGO:
        PaymentMethod = MercadoPago
        break
      case PaymentGateways.PAYPAL:
        PaymentMethod = Paypal
        break
      case PaymentGateways.ESSEN:
        PaymentMethod = Essen
        break
      case PaymentGateways.FENICIO:
        PaymentMethod = Fenicio
        break
      case PaymentGateways.JUMBO:
        PaymentMethod = Jumbo
        break
      case PaymentGateways.CASH:
        PaymentMethod = Cash
        break
      case PaymentGateways.VTEX:
        PaymentMethod = Vtex
        break
      case PaymentGateways.MAGENTO2:
        PaymentMethod = Magento2
        break
      case PaymentGateways.TIENDA_NUBE:
        PaymentMethod = TiendaNube
        break
      case PaymentGateways.ESSEN_ECOMMERCE:
        PaymentMethod = EssenEcommerce
        break
      case PaymentGateways.PLAZAH:
        PaymentMethod = plazaH
        break
      case PaymentGateways.CENCOSUD_PARIS:
        PaymentMethod = CencosudParis
        break
      case PaymentGateways.SHOPIFY:
        PaymentMethod = Shopify
        break
      case PaymentGateways.CARSO:
        PaymentMethod = Carso
        break
      case PaymentGateways.TO_AGREE:
        PaymentMethod = toAgree
        break
      case PaymentGateways.STRIPE:
        PaymentMethod = stripe
        break
      case PaymentGateways.PRIVALIA_HOME:
        PaymentMethod = privaliaHome
        break
      case PaymentGateways.LINX:
        PaymentMethod = Linx
        break
      default:
    }

    this._paymentMethod = new PaymentMethod(paymentGateway)
  }

  createQuote(args) {
    return this._paymentMethod.createQuote(args)
  }

  startCheckout(args) {
    return this._paymentMethod.startCheckout(args)
  }

  goToCheckout(args) {
    return this._paymentMethod.goToCheckout(args)
  }
}

export default Payment
