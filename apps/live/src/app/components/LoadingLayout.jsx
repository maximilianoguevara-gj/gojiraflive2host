import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'

import { GJLogo } from './GJKit/newGJLogo'
import { Button } from './Kit/Buttons'
import { IconButton, InputAdornment, makeStyles, Typography } from '@material-ui/core'
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material/'
import { FlexContainer } from './Kit/Container'
import { ScaleLoader } from 'react-spinners'
import callCardStyles from '../styles/callCard.styles'
import {
  TitleAndSubtitleContainer,
  Title,
  Subtitle,
  NameInput,
  StyledImage,
  PinInput,
} from '../styles/LoadingLayout.styles'
import { CameraWithBorder } from './GJKit/LocalMedia/Camera'
import { MicrophoneWithBorder } from './GJKit/LocalMedia/Microphone'
import { useTranslation } from 'react-i18next'
import { selectCurrentStoreImage, selectCurrentStore } from '../reducers/storeSlice'
import { useSelector } from 'react-redux'
import { CustomerRoles } from '../constants/customerRoles'
import { selectUiSize, UI_IS_TABLET } from '../reducers/uiSlice'
import { selectLocalCameraEnabled, selectLocalMicrophoneEnabled } from '../reducers/callSlice'
import { useAuth, DefaultBuyerName } from '@gojiraf/auth'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const useStyles = makeStyles((theme) => callCardStyles(theme))

const LoadingLayout = (props) => {
  const { isCoHostLogin, isModeratorLogin, allowsMultipleBuyers } = props
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const uiSize = useSelector(selectUiSize)

  const { t } = useTranslation()
  const audioEnabled = useSelector(selectLocalMicrophoneEnabled)
  const videoEnabled = useSelector(selectLocalCameraEnabled)

  const classes = useStyles()
  const logoImage = useSelector(selectCurrentStoreImage)
  const { user } = useAuth()
  const isModerator = user.role === CustomerRoles.MODERATOR
  const store = useSelector(selectCurrentStore)
  const Filter = require('bad-words')
  const words = require('../../bad-words.json')
  const filter = new Filter({ value: true })
  filter.addWords(...words)
  if (store.badWords) {
    filter.addWords(...store.badWords)
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm()

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const { pathname } = useLocation()
  const [, , , loginPath] = pathname.split('/')

  const onSubmit = async ({ name = DefaultBuyerName, pin }) => {
    try {
      gaEventTracker(
        'Login Page',
        `${loginPath === 'login' ? 'login-button-moderator' : 'login-button-buyer'}`,
      )
      matomoTrackEvent(
        'Login Page',
        `${loginPath === 'login' ? 'login-button-moderator' : 'login-button-buyer'}`,
      )
      await props.onSubmit({ name, pin })
    } catch (error) {
      setError('pin', { type: 'manual', message: error.message })
    }
  }

  const getCurrentSubtitle = () => {
    if (isModeratorLogin) return t('homePage.moderator')
    if (isCoHostLogin) return t('homePage.cohost')
    return t('homePage.subtitle')
  }

  return (
    <Container data-test="home-page-container">
      <StyledGJLogo uiSize={uiSize} data-test="home-page-gojiraf-logo" />

      <StyledImage src={logoImage} alt={'Store logoimage'} data-test="home-page-store-logo" />

      <TitleAndSubtitleContainer data-test="home-page-title-and-subtitle-container" uiSize={uiSize}>
        <Title data-test="home-page-title">
          <span>Live</span> Shopping
        </Title>
        <Subtitle data-test="home-page-subtitle">{getCurrentSubtitle()}</Subtitle>
      </TitleAndSubtitleContainer>
      {!isModeratorLogin && !isCoHostLogin ? (
        <MicAndCamContainer data-test="home-page-mic-and-camera-container">
          <MicrophoneWithBorder
            data-test="preview-mic"
            audioEnabled={audioEnabled}
            toggleMicrophone={props.toggleMicrophone}
          />
          <CameraWithBorder
            data-test="preview-cam"
            videoEnabled={videoEnabled}
            toggleCamera={props.toggleCamera}
          />
        </MicAndCamContainer>
      ) : null}

      {!allowsMultipleBuyers && !isModeratorLogin && !isCoHostLogin ? (
        <Text data-test="home-page-text">
          <b data-test="home-page-first-text">
            {audioEnabled && videoEnabled
              ? t('homePage.micAndCamContainer.textCaseOne')
              : audioEnabled && !videoEnabled
              ? t('homePage.micAndCamContainer.textCaseTwo')
              : !audioEnabled && videoEnabled
              ? t('homePage.micAndCamContainer.textCaseThree')
              : t('homePage.micAndCamContainer.textDefault')}
          </b>
          <p data-test="home-page-second-text">
            {audioEnabled && videoEnabled
              ? ` `
              : audioEnabled && !videoEnabled
              ? t('homePage.micAndCamContainer.parragraphCaseOne')
              : !audioEnabled && videoEnabled
              ? t('homePage.micAndCamContainer.parragraphCaseTwo')
              : t('homePage.micAndCamContainer.parragraphDefault')}
          </p>
        </Text>
      ) : (
        ''
      )}
      <StyledForm onSubmit={handleSubmit(onSubmit)} isModerator={isModeratorLogin}>
        {allowsMultipleBuyers && !isModerator ? (
          <>
            <Text data-test="home-page-nickname-text">{t('homePage.nickname')}</Text>
            <NameInput
              {...register('name', {
                minLength: 2,
                maxLength: 15,
                required: true,
                validate: {
                  isProfane: (value) => {
                    return !filter.isProfane(value) || 'This word is unaccepted'
                  },
                },
              })}
              data-test="home-page-nickname-input"
              color="secondary"
              label={t('homePage.nicknameLabel')}
              sx={{ width: 300 }}
            />

            <InputError>
              {errors.name &&
                (errors.name.type === 'maxLength' || errors.name.type === 'minLength') &&
                t('homePage.lengthErrorName')}
              {errors.name && errors.name.type === 'isProfane' && t('homePage.profaneName')}
            </InputError>
          </>
        ) : isModeratorLogin ? (
          <ModeratorContainer uiSize={uiSize}>
            <PinText data-test="home-page-pin-text">{t('homePage.pinLabel')}</PinText>
            <PinInput
              {...register('pin', {
                minLength: 8,
                required: true,
              })}
              data-test="home-page-pin-input"
              color="secondary"
              type={showPassword ? 'text' : 'password'}
              uiSize={uiSize}
              showPasswordIcon={
                <InputAdornment position="end">
                  <IconButton
                    data-test="home-page-pin-reveal-icon"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <InputPinError data-test="home-page-pin-error">
              {errors.pin && t('moderatorPage.wrongPin')}
            </InputPinError>
            {/*<ForgotPin href="#" data-test="home-page-pin-recovery">
              {t('homePage.pinForgotten')}
            </ForgotPin>*/}
          </ModeratorContainer>
        ) : isCoHostLogin ? (
          <ModeratorContainer uiSize={uiSize}>
            <PinText data-test="home-page-nickname-text">{t('homePage.nickname')}</PinText>
            <NameInput
              {...register('name', {
                minLength: 2,
                maxLength: 15,
                required: true,
              })}
              data-test="home-page-nickname-input"
              color="secondary"
              label={'*'.concat(t('homePage.nicknameLabel'))}
              sx={{ width: 300 }}
            />
            {errors.name && <InputError>{t('homePage.lengthErrorName')}</InputError>}
            <PinText data-test="home-page-pin-text">{t('homePage.pin')}</PinText>
            <PinInput
              {...register('pin', {
                minLength: 8,
                required: true,
              })}
              data-test="home-page-pin-input"
              color="secondary"
              type={showPassword ? 'text' : 'password'}
              uiSize={uiSize}
              showPasswordIcon={
                <InputAdornment position="end">
                  <IconButton
                    data-test="home-page-pin-reveal-icon"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.pin && (
              <InputPinError data-test="home-page-pin-error">
                {t('moderatorPage.wrongPin')}
              </InputPinError>
            )}
          </ModeratorContainer>
        ) : null}

        <AccessButton
          id="home-page-login-button"
          data-test="home-page-login-button"
          type="submit"
          variant="contained"
          color="secondary"
          disabled={props.disabled}
        >
          {props.disabled ? (
            <CallingButtonContainer data-test="home-page-container-calling-button">
              <ButtonText
                data-test="home-page-button-calling-button"
                className={classes.color__white}
                component="p"
                color="primary"
                align="center"
              >
                {t('homePage.calling').toUpperCase()}
              </ButtonText>
              <ScaleLoader
                color="#FFFFFF"
                loading={true}
                height={6}
                width={2}
                radius={1}
                margin={1}
              />
            </CallingButtonContainer>
          ) : (
            <ButtonText
              data-test="home-page-button-calling-button"
              className={classes.color__white}
              component="p"
              color="primary"
              align="center"
            >
              {t('homePage.join').toUpperCase()}
            </ButtonText>
          )}
        </AccessButton>
      </StyledForm>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 100%;
  padding: 1rem 1rem 2rem;
`
const ModeratorContainer = styled.div`
  padding: 0.625rem 1.625rem;
  margin-bottom: ${({ uiSize }) => (uiSize === UI_IS_TABLET ? '0.7rem' : '4rem')};
`
const StyledGJLogo = styled(GJLogo)`
  align-self: end;
`
const InputError = styled.p`
  display: inline-block;
  color: red;
  font-size: 0.75rem;
  margin: 0.5em 0;
  min-height: 1rem;
  min-width: 100%;
  width: 0;
`
const InputPinError = styled.p`
  display: block;
  color: red;
  font-size: 0.75rem;
  margin: 0;
  min-height: 1.5rem;
`
const Text = styled.p`
  font-family: Montserrat;
  font-style: normal;
  font-size: 0.813rem;
  text-align: center;
  color: #50555c;
  margin: 0;
`
const PinText = styled.p`
  font-family: Montserrat;
  font-weight: 600;
  font-size: 0.875rem;
  color: #50555c;
  margin: 0;
`

const ButtonText = styled(Typography)`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 9px;
  text-align: center;
  letter-spacing: 2px;
  color: #ffffff;
`
const AccessButton = styled(Button)`
  background: #000000;
  color: #ffffff;
  z-index: 1;
`
const CallingButtonContainer = styled(FlexContainer)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const MicAndCamContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const StyledForm = styled.form`
  width: ${({ isModerator }) => (isModerator ? '90%' : '')};
`

LoadingLayout.propTypes = {
  onSubmit: PropTypes.func,
  setInput: PropTypes.func,
  disabled: PropTypes.bool,
  isModeratorLogin: PropTypes.bool,
  isCoHostLogin: PropTypes.bool,
  allowsMultipleBuyers: PropTypes.bool,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
}

export default LoadingLayout
