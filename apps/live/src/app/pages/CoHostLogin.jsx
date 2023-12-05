import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Splash } from '../components/Splash'
import { getStoreById, selectCurrentStore } from '../reducers/storeSlice'
import StoreUtils from '../utils/storeUtils'
import { PhoneContainer } from '../components/Kit/Container'
import { CallHomeContainer } from './oneToOneLayout'
import LoadingLayout from '../components/LoadingLayout'
import { selectUiSize, setUiSize, UI_IS_LAPTOP, UI_IS_TABLET } from '../reducers/uiSlice'
import { useDevices } from '../hooks/useDevices'
import { device } from '../constants/devices'
import { login } from '@gojiraf/auth'
import { CustomerRoles } from '../constants/customerRoles'
import { useGoogleAnalytics } from '@gojiraf/analytics'
import { useLocalMicrophone } from '../hooks/useLocalMicrophone'
import { useLocalCamera } from '../hooks/useLocalCamera'

export const CoHostLogin = () => {
  const { gaSendPageView } = useGoogleAnalytics()
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const store = useSelector(selectCurrentStore)
  const [isLoading, setIsLoading] = useState(true)
  const uiSize = useSelector(selectUiSize)
  const { handlers, clean, current } = useDevices()
  const isMobile = uiSize === UI_IS_TABLET
  const { toggleMicrophone } = useLocalMicrophone()
  const { toggleCamera, enabled: videoEnabled } = useLocalCamera()

  useEffect(() => {
    gaSendPageView()
  }, [])

  useEffect(() => {
    const handle = (e) => {
      if (e.matches) {
        dispatch(setUiSize({ chatSize: UI_IS_LAPTOP }))
      } else {
        dispatch(setUiSize({ chatSize: UI_IS_TABLET }))
      }
    }
    handlers[2].setHandler(handle)
    if (!current || current === device.tablet || current === device.mobile) {
      dispatch(setUiSize({ chatSize: UI_IS_TABLET }))
    } else {
      dispatch(setUiSize({ chatSize: UI_IS_LAPTOP }))
    }
    return () => {
      clean()
    }
  }, [current])

  useEffect(() => {
    if (!store && params?.storeId) {
      dispatch(getStoreById(params.storeId))
    } else {
      setIsLoading(false)
    }
  }, [params, store])

  const onSubmit = async ({ pin, name }) => {
    await login({
      userName: name,
      storeId: params.storeId,
      pin,
      role: CustomerRoles.COHOST,
    })
    navigate(`/store/${store.id}${window.location.search}`, { state: { isCohostUser: true } })
  }
  return (
    <>
      {isLoading || store == null ? (
        <Splash />
      ) : (
        <CallHomeContainer
          style={{
            backgroundImage: `url(${StoreUtils.getBackgroundImage({
              isMobile,
              backgroundUrlMobile: store.backgroundUrlMobile,
              backgroundUrl: store.backgroundUrl,
            })})`,
          }}
          data-test="background-image"
        >
          <PhoneContainer
            isSecondHostLogin={true}
            data-test="login-screen-container"
            uiSize={uiSize}
          >
            <LoadingLayout
              onSubmit={onSubmit}
              disabled={false}
              isCoHostLogin={true}
              toggleMicrophone={videoEnabled ? toggleMicrophone : null}
              toggleCamera={toggleCamera}
            />
          </PhoneContainer>
        </CallHomeContainer>
      )}
    </>
  )
}
