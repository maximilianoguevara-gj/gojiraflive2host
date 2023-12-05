import _filter from 'lodash.filter'
class StoreUtils {
  getPaymentGateways(store) {
    const paymentGateways = _filter(store.paymentGateways, { isDefault: true })
    return paymentGateways
  }
  getFormatPaypalLanguage(lang, countryCode) {
    const currentCountryCode = countryCode || 'AR'
    const language = lang || 'es'
    return `${language.toLowerCase()}_${currentCountryCode.toUpperCase()}`
  }

  getBackgroundImage({
    isMobile,
    isCountdownPage = false,
    backgroundUrlCountdown = null,
    backgroundUrlMobile = null,
    backgroundUrl,
  }) {
    if (isCountdownPage && backgroundUrlCountdown) return backgroundUrlCountdown
    return isMobile && backgroundUrlMobile ? backgroundUrlMobile : backgroundUrl
  }

  reloadWindow() {
    window.location.reload(true)
  }
}

const instance = new StoreUtils()
Object.freeze(instance)

export default instance
