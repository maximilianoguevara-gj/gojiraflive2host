import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentStore } from '../reducers/storeSlice'
import StoreUtils from '../utils/storeUtils'
import { GJLogo, LiveShopping } from '../components/GJKit/newGJLogo'
import { FlexContainer } from '../components/Kit/Container'
import { Survey } from '../components/GJKit/Survey/Survey'
import { useAuth } from '@gojiraf/auth'
import { CustomerRoles } from '../constants/customerRoles'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { UI_IS_TABLET, selectUiSize } from '../reducers/uiSlice'

export const FormSplash = () => {
  const { user } = useAuth()
  const params = useParams()
  const notShowSurvey = user.role === CustomerRoles.MODERATOR || user.role === CustomerRoles.COHOST
  const store = useSelector(selectCurrentStore)
  const navigate = useNavigate()
  const { gaSendPageView } = useGoogleAnalytics()
  const { trackPageView } = useMatomoAnalytics()
  const uiSize = useSelector(selectUiSize)
  const isMobile = uiSize === UI_IS_TABLET

  useEffect(() => {
    gaSendPageView()
    trackPageView()
    if (store == null) {
      navigate(`/store/${params.storeId}`)
    }
  }, [])

  return (
    <CallHomeContainer
      style={{
        backgroundImage: `url(${StoreUtils.getBackgroundImage({
          isMobile,
          backgroundUrlMobile: store?.backgroundUrlMobile,
          backgroundUrl: store?.backgroundUrl,
        })})`,
      }}
      data-test="background-image"
    >
      <LiveShopping />
      <GJLogo />
      {store && !notShowSurvey && <Survey />}
    </CallHomeContainer>
  )
}

const CallHomeContainer = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  gap: 3rem;
`
