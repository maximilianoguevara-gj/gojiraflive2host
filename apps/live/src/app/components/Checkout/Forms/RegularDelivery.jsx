import React from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Row } from '../../GJKit/Checkout.styles'
import { SecondaryHeading } from '../../Kit/Headings/SecondaryHeading'
import { Input } from '../../Kit/Input'
import { countryCodes } from '../../../constants/countryCodes'

export const RegularDelivery = ({ control, langCheckout, countryCode, storeLang }) => {
  const { t } = useTranslation()
  const MEXICAN_COUNTRY_CODE = countryCodes.find((country) => country === 'MX')

  return (
    <>
      <SecondaryHeading data-test="datos-envio-domicilio">
        {t('checkout.secondaryHeadingDelivery')}
      </SecondaryHeading>

      <Controller
        name="shipping.address"
        control={control}
        defaultValue=""
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <Input
            data-test="checkout-address"
            type="text"
            label={langCheckout.address}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={Boolean(error)}
            helperText={error?.message}
            inputProps={{ autoComplete: 'address-line1' }}
            style={{ width: '100%' }}
          />
        )}
        rules={{ required: t('checkout.required') }}
      />

      <Row>
        {storeLang == 'en' ? null : (
          <>
            <Controller
              name="shipping.number"
              control={control}
              defaultValue=""
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  data-test="checkout-shipping-num"
                  type="number"
                  label={langCheckout.numberAddress}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                  inputProps={{ autoComplete: 'address-line2' }}
                  style={{ width: '35%', marginRight: '0.5rem' }}
                />
              )}
              rules={{ required: t('checkout.required') }}
            />
            <Controller
              name="shipping.floorApartment"
              control={control}
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  data-test="checkout-address-apt"
                  type="text"
                  label={langCheckout.floorApartment}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputProps={{ autoComplete: 'address-line3' }}
                />
              )}
            />
          </>
        )}
      </Row>

      <Row>
        <Controller
          name="shipping.region"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-region"
              type="text"
              label={langCheckout.region}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'address-line3' }}
              style={{ width: '35%', marginRight: '0.5rem' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
        <Controller
          name="shipping.city"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-city"
              type="text"
              label={langCheckout.city}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'address-level2' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
      </Row>
      {countryCode === MEXICAN_COUNTRY_CODE && (
        <Row>
          <Controller
            name="shipping.colony"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                data-test="checkout-colony"
                type="text"
                label={langCheckout.colony}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(error)}
                helperText={error?.message}
                inputProps={{ autoComplete: 'colony' }}
                style={{ width: '100%' }}
              />
            )}
            rules={{ required: t('checkout.required') }}
          />
        </Row>
      )}
      <Row>
        <Controller
          name="shipping.postalCode"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-postal"
              type="text"
              label={langCheckout.postalCode}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'postal-code' }}
              style={{ width: '100%' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
      </Row>
    </>
  )
}

RegularDelivery.propTypes = {
  control: PropTypes.object.isRequired,
  langCheckout: PropTypes.object.isRequired,
  countryCode: PropTypes.string.isRequired,
  storeLang: PropTypes.string.isRequired,
}
