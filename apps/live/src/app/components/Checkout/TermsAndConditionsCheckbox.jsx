import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { LabelCheckbox } from '../GJKit/Checkout.styles'
import { Controller } from 'react-hook-form'
import StyledCheckbox from '../styledCheckbox'
import { Link } from '../dialogs/style'
import { FormHelperText } from '@material-ui/core'

export const TermsAndConditionsCheckbox = ({
  control,
  customTermsAndConditionsArray = [],
  termsAndConditionsError,
}) => {
  const { t } = useTranslation()
  const [termsAndConditionsArray, setTermsAndConditionsArray] = useState(
    customTermsAndConditionsArray,
  )

  const goJirafTermsAndConditions = {
    url: 'https://gojiraf.com/terms',
    text: t('checkout.controllerTermsAndConditions'),
  }

  useEffect(() => {
    const newArray = termsAndConditionsArray.concat([goJirafTermsAndConditions])
    setTermsAndConditionsArray(newArray)
  }, [])

  const renderTermsAndConditions = () => {
    if (termsAndConditionsArray.length === 1) {
      return (
        <>
          {t('checkout.controllerAcceptTermsAndConditions')}
          <Link href={termsAndConditionsArray[0].url} target="_blank" rel="noreferrer">
            {` ${termsAndConditionsArray[0].text}.`}
          </Link>
        </>
      )
    }

    const renderedUrls = termsAndConditionsArray.map((termsAndConditions, index) => {
      if (index === termsAndConditionsArray.length - 1) {
        return (
          <>
            {` ${t('checkout.and')}`}
            <Link href={termsAndConditions.url} key={index} target="_blank" rel="noreferrer">
              {` ${termsAndConditions.text}.`}
            </Link>
          </>
        )
      } else {
        return (
          <Link href={termsAndConditions.url} key={index} target="_blank" rel="noreferrer">
            {` ${termsAndConditions.text},`}
          </Link>
        )
      }
    })

    return (
      <>
        {t('checkout.controllerAcceptTermsAndConditions')}
        {renderedUrls}
      </>
    )
  }

  return (
    <>
      <LabelCheckbox>
        <Controller
          data-test="button-terms"
          name="termsAndConditions"
          control={control}
          defaultValue={false}
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledCheckbox
              data-test="checkbox-terms"
              checked={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
        <span>{renderTermsAndConditions()}</span>
      </LabelCheckbox>
      <FormHelperText data-test="terms-error" error>
        {termsAndConditionsError && t('checkout.controllerTermsAndConditionsError')}
        <br />
      </FormHelperText>
    </>
  )
}

TermsAndConditionsCheckbox.propTypes = {
  control: PropTypes.object.isRequired,
  customTermsAndConditionsArray: PropTypes.array.isRequired,
  termsAndConditionsError: PropTypes.any.isRequired,
}
