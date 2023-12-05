import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Controller } from 'react-hook-form'
import { Input } from '../../../Kit/Input'
import { Row } from '../../../GJKit/Checkout.styles'
export const TiendaNubeData = ({ control, langCheckout }) => {
  const { t } = useTranslation()
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
    </>
  )
}

TiendaNubeData.propTypes = {
  control: PropTypes.object.isRequired,
  langCheckout: PropTypes.object.isRequired,
}
