import React from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { t } = useTranslation()
  return (
    <>
      <ButtonContainer>
        <ButtonSubmit type="submit" variant="contained">
          {t('form.satisfactionEvent.send')}
        </ButtonSubmit>
        <ButtonClear type="reset" variant="text">
          {t('form.satisfactionEvent.reset')}
        </ButtonClear>
      </ButtonContainer>
      <PassLeyend>{t('form.satisfactionEvent.passLeyend')}</PassLeyend>
      <NofityForm>
        <span>{t('form.satisfactionEvent.leyend')}</span>
      </NofityForm>

      <FooterGoogle>
        <FooterGoogleLink href="//www.google.com/forms/about/" target="_blank" rel="noreferrer">
          <FooterGoogleImg
            src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_dark_clr_74x24px.svg"
            alt="Google"
            height="24px"
            width="74px"
          />
          <FooterGoogleSpan> {t('form.satisfactionEvent.forms')}</FooterGoogleSpan>
        </FooterGoogleLink>
      </FooterGoogle>
    </>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 16px 0;
`
const ButtonSubmit = styled(Button)`
  background-color: #000;
  color: #fff;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  text-transform: none;

  &:hover {
    background-color: #000;
  }
`

const ButtonClear = styled(Button)`
  background-color: none;
  color: #000;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  text-transform: none;
`

const PassLeyend = styled.div`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.3px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.66);
  margin-top: 8px;
`

const NofityForm = styled.div`
  color: rgba(0, 0, 0, 0.66);
  font-size: 12px;
  font-weight: 400;
  margin: 16px 0;
  padding: 0 16px;
  text-align: center;
`

const FooterGoogle = styled.div`
  margin: 24px 0;
  text-align: center;
`
const FooterGoogleLink = styled.a`
  color: black;
  opacity: 0.55;
  text-decoration: none;
`
const FooterGoogleImg = styled.img`
  display: inline-block;
  vertical-align: middle;
`
const FooterGoogleSpan = styled.span`
  font-size: 22px;
  position: relative;
  top: 2px;
`
