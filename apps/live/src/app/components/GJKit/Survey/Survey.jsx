import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Paper, Modal } from '@mui/material'
import { selectUiSize, UI_IS_TABLET } from '../../../reducers/uiSlice'
import { useSelector } from 'react-redux'
import { useStore } from 'state'
import { StyledEngineProvider } from '@mui/material/styles'
import { GoogleFormProvider, useGoogleForm } from 'react-google-forms-hooks'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { useTranslation } from 'react-i18next'
import {
  CheckboxGridInput,
  CheckboxInput,
  RadioInput,
  ShortAnswerInput,
  LongAnswerInput,
  RadioGridInput,
  DropdownInput,
  LinearGrid,
  Footer,
} from './components/index'

// Generated Form from Google Forms folder
import form_en from './forms/SatisfactionFormEn.json'
import form_es from './forms/SatisfactionFormEs.json'
import form_pt from './forms/SatisfactionFormPt.json'

export const Survey = () => {
  const { t } = useTranslation()
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const [open, setOpen] = useState(true)
  const store = useStore()
  const storeLang = store?.store.lang || 'es'
  const form = {
    en: form_en,
    es: form_es,
    pt: form_pt,
  }[storeLang]
  const methods = useGoogleForm({ form })
  const isMobile = useSelector(selectUiSize) === UI_IS_TABLET

  let IdEventStore = null
  let IdCompany = null

  const Questions = () => {
    return (
      <>
        {form.fields.map((field) => {
          const { id } = field
          let questionInput = null

          switch (field.type) {
            case 'CHECKBOX':
              questionInput = <CheckboxInput id={id} />
              break
            case 'RADIO':
              questionInput = <RadioInput id={id} />
              break
            case 'SHORT_ANSWER':
              if (field.label === t('form.satisfactionEvent.eventStore')) {
                questionInput = null
                IdEventStore = id
              } else if (field.label === t('form.satisfactionEvent.company')) {
                questionInput = null
                IdCompany = id
              } else {
                questionInput = <ShortAnswerInput id={id} />
              }
              break
            case 'LONG_ANSWER':
              questionInput = <LongAnswerInput id={id} />
              break
            case 'RADIO_GRID':
              questionInput = <RadioGridInput id={id} />
              break
            case 'CHECKBOX_GRID':
              questionInput = <CheckboxGridInput id={id} />
              break
            case 'DROPDOWN':
              questionInput = <DropdownInput id={id} />
              break
            case 'LINEAR':
              questionInput = <LinearGrid id={id} />
              break
            default:
              return null
          }

          if (!questionInput) {
            return null
          }

          return (
            <QuestionContainer key={id} elevation={0}>
              <QuestionLabel>{field.label}</QuestionLabel>
              {questionInput}
            </QuestionContainer>
          )
        })}
      </>
    )
  }

  //se utiliza para enviar mensaje al iframe de otro sitio.
  const handleSendMessageToParent = () => {
    window.parent.postMessage({ message: 'redirectoLive', isRedirect: true }, '*')
  }

  const onSubmit = async (data) => {
    try {
      gaEventTracker('Satisfaction Survey', 'send-satisfaction-survey')
      matomoTrackEvent('Satisfaction Survey', 'send-satisfaction-survey')
      handleSendMessageToParent()
      const storeName = store?.store.name
      const companyName = store?.store.company.name
      data[IdEventStore] = storeName
      data[IdCompany] = companyName
      await methods.submitToGoogleForms(data)
      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal
      open={open}
      aria-labelledby="modal-survey-title"
      aria-describedby="modal-survey-description"
    >
      <BoxSurvey
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
          p: 0,
          outline: 'none',
        }}
        autoComplete="off"
        isMobile={isMobile}
      >
        <CardSurvey sx={{ backgroundColor: '#f6f6f6' }}>
          <GoogleFormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(onSubmit)} isMobile={isMobile}>
              <StyledEngineProvider injectFirst>
                <Top />
                <TitleContainer elevation={0}>
                  <Title>{form.title}</Title>
                </TitleContainer>
                <Questions />
                <Footer />
              </StyledEngineProvider>
            </Form>
          </GoogleFormProvider>
        </CardSurvey>
      </BoxSurvey>
    </Modal>
  )
}

const BoxSurvey = styled(Box)`
  width: ${({ isMobile }) => (isMobile ? '95vw' : '700px')};
  height: ${({ isMobile }) => (isMobile ? '95vh' : '80vh')};
  max-height: ${({ isMobile }) => (isMobile ? '' : '800px')};
`
const CardSurvey = styled(Paper)`
  width: 100%;
  height: 100%;
  padding: 0.625rem;
`
const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ isMobile }) => (isMobile ? '16px 8px' : '16px 0')};
  overflow-x: hidden;
  overflow-y: visible;
  height: 100%;
`
const TitleContainer = styled(Paper)`
  padding: 1rem;
  margin-bottom: 12px;
  border: 1px solid #dadce0;
`
const Top = styled.div`
  background-color: #000;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: 10px;
  position: relative;
  top: 3px;
  width: 100%;
`
const Title = styled.h1`
  font-family: 'Montserrat';
  font-weight: 400;
  font-size: 28px;
  line-height: 1.25;
  letter-spacing: 0;
`
const QuestionContainer = styled(Paper)`
  padding: 24px;
  margin-bottom: 12px;
  word-wrap: break-word;
  border: 1px solid #dadce0;

  .MuiPaper-root {
    background-color: #fff;
    border-radius: 8px;
  }
`
const QuestionLabel = styled.h3`
  margin-bottom: 16px;
  font-family: 'Montserrat';
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
  color: #000;
`
