import { useEffect, useState } from 'react'
import { deviceDetect, isIOS } from 'react-device-detect'
import { useSelector } from 'react-redux'
import { selectDisplayFinishEventCountdownstate } from '../reducers/callSlice'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
export const usePIP = () => {
  const displayFinishEventCountdown = useSelector(selectDisplayFinishEventCountdownstate)
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { browserName } = deviceDetect()
  const canPIP = () => document.pictureInPictureEnabled && browserName !== 'Firefox'
  const isInPIP = () => document.pictureInPictureElement
  const videoElement = document.querySelector('[id="video__streaming"] video')
  const [disablePIP, setDisablePIP] = useState(false)
  const [activePIP, setActivePIP] = useState(false)
  if (videoElement && browserName === 'Safari') {
    videoElement.autoPictureInPicture = true
  }

  const handlePause = () => {
    videoElement.play()
  }

  const handleEnterPictureInPicture = () => {
    setActivePIP(true)
  }
  const handleLeavePictureInPicture = () => {
    setActivePIP(false)
    if (isIOS) handlePause()
  }
  const addEventListeners = () => {
    document.addEventListener('enterpictureinpicture', handleEnterPictureInPicture)
    document.addEventListener('leavepictureinpicture', handleLeavePictureInPicture)
  }
  const removeEventListeners = () => {
    document.removeEventListener('enterpictureinpicture', handleEnterPictureInPicture)
    document.removeEventListener('leavepictureinpicture', handleLeavePictureInPicture)
  }
  useEffect(() => {
    if (canPIP() && !disablePIP) {
      addEventListeners()
    } else {
      removeEventListeners()
    }
    return () => {
      removeEventListeners()
    }
  }, [disablePIP])
  useEffect(async () => {
    if (displayFinishEventCountdown) {
      await closePIP()
      setDisablePIP(true)
    }
  }, [displayFinishEventCountdown])
  const openPIP = async () => {
    try {
      if (!isInPIP()) {
        gaEventTracker('Pip', 'open-pip')
        matomoTrackEvent('Pip', 'open-pip')
        if (browserName === 'Safari') {
          await videoElement.webkitSetPresentationMode('picture-in-picture')
        } else {
          await videoElement.requestPictureInPicture()
        }
        setActivePIP(true)
      }
    } catch (err) {
      console.error(err)
    }
  }
  const closePIP = async () => {
    try {
      if (isInPIP()) {
        gaEventTracker('Pip', 'close-pip')
        matomoTrackEvent('Pip', 'close-pip')
        if (browserName === 'Safari') {
          await videoElement.webkitSetPresentationMode('inline')
        } else {
          await document.exitPictureInPicture()
        }
        setActivePIP(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handlerPIP = async () => {
    isInPIP() ? await closePIP() : await openPIP()
  }
  return {
    canPIP,
    activePIP,
    disablePIP,
    openPIP,
    closePIP,
    handlerPIP,
  }
}
