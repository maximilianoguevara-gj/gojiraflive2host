import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

export const CreditCard = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
          fill="black"
        />
      </svg>
      <Span>{t('checkout.legendCreditCard')}</Span>
    </Container>
  )
}

const Container = styled.div`
  margin-left: 1rem;
  gap: 0.3rem;
  display: flex;
  align-items: center;
`
const Span = styled.span`
  color: #50555c;
`
