import { CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

export default function LinxRedirector() {
  const [searchParams] = useSearchParams()
  const basketId = searchParams.get('BasketID')
  const sessionId = searchParams.get('SessionID')
  const checkoutUrl = searchParams.get('CheckoutURL')
  const lang = searchParams.get('lang')

  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation()

  const redirectToLinx = async () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = checkoutUrl
    const input1 = document.createElement('input')
    input1.type = 'hidden'
    input1.name = 'BasketID'
    input1.value = basketId
    const input2 = document.createElement('input')
    input2.type = 'hidden'
    input2.name = 'SessionID'
    input2.value = sessionId
    form.append(input1)
    form.append(input2)
    window.document.body.append(form)
    form.submit()
  }

  useEffect(() => {
    if (lang !== undefined) {
      changeLanguage(lang)
    }
  }, [lang])

  useEffect(() => {
    redirectToLinx()
  }, [])

  return (
    <Container>
      <Label>{t('checkout.linxRedirecting')}</Label>
      <CircularProgress color="inherit" />
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Label = styled.span`
  margin: 10px;
`
