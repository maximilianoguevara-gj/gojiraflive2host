import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  const { t } = useTranslation()

  return (
    <HeaderContainer>
      <MainHeader>{t('dialogs.configurationHeader')}</MainHeader>
      <Subtitle>{t('dialogs.configurationSubtitle')}</Subtitle>
    </HeaderContainer>
  )
}
const HeaderContainer = styled.div`
  background-color: rgba(242, 242, 242, 1);
  padding: 20px 25px;
  border-radius: 8px 8px 0 0;
`
const MainHeader = styled.h3`
  margin: 0;
`
const Subtitle = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 400;
`
