import React from 'react'
import styled from 'styled-components'
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt'
import { useTranslation } from 'react-i18next'

const PIPBackground = () => {
  const { t } = useTranslation()

  return (
    <PIPBackgroundContainer>
      <PictureInPictureIcon sx={{ fontSize: 70 }} />
      <Text>{t('uiElements.PIPBackground')}</Text>
    </PIPBackgroundContainer>
  )
}

const PIPBackgroundContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #000;
  width: 100%;
  height: 100%;
  z-index: 9;
`
const PictureInPictureIcon = styled(PictureInPictureAltIcon)`
  color: #fff;
  margin: 0.625rem;
`
const Text = styled.p`
  width: 70%;
  font-size: 1.1rem;
  color: #fff;
  text-align: center;
  line-height: normal;
`

export { PIPBackground }
