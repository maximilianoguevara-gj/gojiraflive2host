import store from '../../core/store'
import { EnvConfig } from '../../../config/env'
import {
  rejectPaypal,
  startPaypal,
  setCheckoutFinishedSuccess,
  paypalNotification,
} from '../../reducers/orderSlice'
import StoreUtils from '../../utils/storeUtils'
import to from 'await-to-js'
import { setPayPalButtonMounted, setPayPalDialogVisible } from '../../reducers/uiSlice'
import { ENVIROMENTS } from '../../constants/enviroments'

const Paypal = function (paymentGateway) {
  this.paymentGateway = paymentGateway
  this.quote = null
  this.checkout = null
  this.orderId = null
  this.lang = null
  this.countryCode = null

  this.createQuote = ({ store, order }) => {
    this.orderId = order.id
    this.lang = store.lang === 'es' ? store.lang : 'en'
    this.countryCode = store.countryCode ?? 'AR'
    this.quote = {
      intent: 'CAPTURE',
      application_context: {
        return_url: `${EnvConfig.hostedUrl}/store?id=${store.id}`,
        cancel_url: `${EnvConfig.hostedUrl}/store?id=${store.id}`,
        brand_name: store.name,
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    }
  }

  this.startCheckout = async () => {
    store.dispatch(setPayPalDialogVisible(true))
    const [err, res] = await to(
      store.dispatch(
        startPaypal({
          quote: this.quote,
          paymentGatewayId: this.paymentGateway.id,
          orderId: this.orderId,
        }),
      ),
    )
    if (!err) {
      this.checkout = res.payload
    } else {
      console.error(err)
    }
  }

  this.goToCheckout = ({ paymentGateway, orderId }) => {
    window.paypal.Button.render(
      {
        env: process.env.REACT_APP_CHECKOUT_ENVIRONMENT || ENVIROMENTS.SANDBOX,
        client: {
          sandbox: this.paymentGateway.publicKeyVendor,
          production: this.paymentGateway.publicKeyVendor,
        },
        locale: StoreUtils.getFormatPaypalLanguage(this.lang, this.countryCode),
        style: {
          size: 'medium',
          color: 'gold',
          shape: 'pill',
          tagline: false,
          label: 'pay',
        },
        commit: true,
        payment: () => this.checkout.orderId,
        onAuthorize: async function (data) {
          store.dispatch(
            paypalNotification({
              paymentToken: data.paymentToken,
              orderId,
              paymentGatewayId: paymentGateway.id,
            }),
          )
          store.dispatch(setCheckoutFinishedSuccess(true))
          store.dispatch(setPayPalButtonMounted(false))
          store.dispatch(setPayPalDialogVisible(false))
        },
        onCancel: function () {
          store.dispatch(rejectPaypal())
          store.dispatch(setCheckoutFinishedSuccess(false))
        },
      },
      '#paypal-button',
    )
    store.dispatch(setPayPalButtonMounted(true))
  }
}

export default Paypal
