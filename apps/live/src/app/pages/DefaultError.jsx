import * as React from 'react'
import { useTranslation } from 'react-i18next'

export const DefaultError = () => {
  const { t } = useTranslation()
  return <>{alert(t('homePage.defaultError'))}</>
}
