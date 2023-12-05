import {
  isChrome,
  isSafari,
  isFirefox,
  isIE,
  isEdge,
  isMobile,
  isIOS,
  isMobileSafari,
} from 'react-device-detect'

export const askIsWebview = () => {
  const instagramWebview = navigator.userAgent.indexOf('Instagram')
  const facebookWebview = navigator.userAgent.indexOf('FB')

  return instagramWebview != -1 || facebookWebview != -1
}

export const openWindow = () => {
  const isWebview = askIsWebview()
  const windowTarget = isWebview ? '_self' : '_blank'
  return window.open('', windowTarget)
}
class BrowserDetectUtils {
  openHelpMicConfig() {
    let url = ''
    if (isChrome) {
      url = 'https://support.google.com/chrome/answer/2693767?co=GENIE.Platform%3DDesktop&hl=en'
    } else if (isSafari) {
      url = 'https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac'
    } else if (isFirefox) {
      url = 'https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions'
    } else if (isIE || isEdge) {
      url = 'https://www.windowscentral.com/how-manage-site-permissions-new-microsoft-edge'
    }
    if (url !== '') {
      window.open(url, '_blank')
    }
  }

  isMobileIosChrome() {
    return isMobile && isIOS && !isMobileSafari
  }

  isMobileIosSafari() {
    return isMobile && isIOS && isMobileSafari
  }
}

const instance = new BrowserDetectUtils()
Object.freeze(instance)

export default instance
