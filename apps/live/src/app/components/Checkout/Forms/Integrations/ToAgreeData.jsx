import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Controller } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input'
import CheckoutConstants from '../../../../utils/checkoutConstants'
import { countryCodes, noIdentityDocument } from '../../../../constants/countryCodes'
import { Input } from '../../../Kit/Input'
import { Row } from '../../../GJKit/Checkout.styles'

export const ToAgreeData = ({ control, langCheckout, countryCode, storeLang, isReseller }) => {
  const { t } = useTranslation()
  const identityDocument = CheckoutConstants['identityDocument'][countryCode]
  const defaultMessage = `Número de ${identityDocument} inválido`
  const ERROR_MESSAGE = {
    es: defaultMessage,
    en: `Invalid ${identityDocument} number`,
    pt: defaultMessage,
  }
  const errorMessage = ERROR_MESSAGE[storeLang]

  const renderDocumentInput = () => {
    const renderDocumentInput = !noIdentityDocument.includes(countryCode)
    return renderDocumentInput
  }

  return (
    <>
      <Controller
        name="fullName"
        control={control}
        defaultValue=""
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input
            data-test="checkout-input-name"
            type="text"
            label={langCheckout.fullName}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={Boolean(error)}
            helperText={error?.message}
            style={{ width: '100%' }}
          />
        )}
        rules={{ required: t('checkout.required') }}
      />
      <Row>
        {renderDocumentInput() && (
          <Controller
            name="dni"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                data-test="checkout-id"
                type="text"
                label={langCheckout.identityDocument.value}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(error)}
                helperText={error?.message}
                style={{ width: '35%', marginRight: '0.5rem' }}
              />
            )}
            rules={{
              required: langCheckout.identityDocument.required,
              minLength: {
                value: langCheckout.identityDocument.minLength,
                message: errorMessage,
              },
              maxLength: {
                value: langCheckout.identityDocument.maxLength,
                message: errorMessage,
              },
            }}
          />
        )}
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-email"
              type="email"
              label={langCheckout.email}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'email' }}
            />
          )}
          rules={{
            required: t('checkout.required'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('checkout.wrongEmailFormat'),
            },
          }}
        />
      </Row>
      <Row>
        <Controller
          name="buyerPhoneNumber"
          data-test="flag-selector"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <PhoneInput
              inputComponent={Input}
              data-test="checkout-phone"
              countries={countryCodes}
              defaultCountry={countryCode}
              addInternationalOption={false}
              style={{
                width: '100%',
                '--PhoneInputCountrySelectArrow-color': 'black',
                '--PhoneInputCountrySelectArrow-opacity': 'none',
              }}
              type="tel"
              label={langCheckout.phone}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'tel' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
      </Row>
      {isReseller && (
        <Row>
          <Controller
            name="resellerNumber"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                data-test="checkout-reseller-number"
                type="number"
                label={langCheckout.resellerNumber}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(error)}
                helperText={error?.message}
                inputProps={{ autoComplete: 'number' }}
              />
            )}
            rules={{
              required: t('checkout.required'),
              maxLength: {
                value: 11,
                message: t('checkout.wrongResellerNumberFormat'),
              },
            }}
          />
          <Controller
            name="zoneNumber"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                data-test="checkout-reseller-number"
                type="number"
                label={langCheckout.zoneNumber}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(error)}
                helperText={error?.message}
                inputProps={{ autoComplete: 'number' }}
              />
            )}
            rules={{
              required: t('checkout.required'),
              maxLength: {
                value: 3,
                message: t('checkout.wrongZoneNumberFormat'),
              },
            }}
          />
        </Row>
      )}
    </>
  )
}

ToAgreeData.propTypes = {
  control: PropTypes.object.isRequired,
  langCheckout: PropTypes.object.isRequired,
  countryCode: PropTypes.string.isRequired,
  storeLang: PropTypes.string.isRequired,
  isDeliveryOrder: PropTypes.bool.isRequired,
  isReseller: PropTypes.bool.isRequired,
}
