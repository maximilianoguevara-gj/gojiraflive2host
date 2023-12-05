import React from 'react'
import { Subtitle, Title, StyledImage } from '../styles/LoadingLayout.styles'
import styled from 'styled-components'
import { GJLogo } from './GJKit/newGJLogo'
import { ScaleLoader } from 'react-spinners'
import { useTranslation } from 'react-i18next'
import { selectCurrentStoreImage } from '../reducers/storeSlice'
import { useSelector } from 'react-redux'

export default function CallingLoader() {
  const { t } = useTranslation()
  const logoImage = useSelector(selectCurrentStoreImage)

  return (
    <Container data-test="container-landing">
      <StyledGJLogo data-test="home-page-gojiraf-logo" />
      <CustomImage src={logoImage} alt={'Store logo'} data-test="home-page-store-logo" />
      <TextContainer>
        <Title data-test="home-page-title">
          <span>Live</span> Shopping
        </Title>
        <Subtitle data-test="home-page-subtitle">
          {t('homePage.loadercontainerTypography')}
        </Subtitle>
      </TextContainer>
      <ScaleLoaderContainer>
        <ScaleLoader color="#000000" loading={true} height={22} width={3} radius={2} margin={2} />
      </ScaleLoaderContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem 2rem;
  height: 100%;
`

const StyledGJLogo = styled(GJLogo)`
  align-self: flex-end;
`

const CustomImage = styled(StyledImage)`
  margin-top: 2rem;
`

const TextContainer = styled.div`
  margin-top: 2rem;
`

const ScaleLoaderContainer = styled.div`
  margin: auto;
`
