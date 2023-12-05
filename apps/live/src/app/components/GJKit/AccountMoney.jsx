import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

export const AccountMoney = () => {
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
          d="M11 17H13V16H14C14.55 16 15 15.55 15 15V12C15 11.45 14.55 11 14 11H11V10H15V8H13V7H11V8H10C9.45 8 9 8.45 9 9V12C9 12.55 9.45 13 10 13H13V14H9V16H11V17ZM20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V6H20V18Z"
          fill="black"
        />
      </svg>
      <Span>{t('checkout.legendAccountMoney')}</Span>
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
