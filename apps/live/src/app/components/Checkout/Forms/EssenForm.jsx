import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input } from '../../Kit/Input'
import { Controller } from 'react-hook-form'
import { AuxiliarHeading, SecondaryHeading } from '../../Kit/Headings/SecondaryHeading'
import { useTranslation } from 'react-i18next'
import { getLocalidadesOf, getProvincias } from '../../../utils/essenDireccionesUtils'
import {
  Row,
  SelectInputsRow,
  StyledAutoComplete,
  StyledPaper,
  StyledTextField,
} from '../../GJKit/Checkout.styles'

export const EssenForm = ({ control }) => {
  const { t } = useTranslation()
  const [isProvinceSelected, setIsProvinceSelected] = useState(false)
  const [provinceId, setProvinceId] = useState(1)
  const essenProvincias = getProvincias()
  const [provinceValue, setProvinceValue] = useState(null)
  const [locationValue, setLocationValue] = useState(null)

  return (
    <>
      <SecondaryHeading data-test="datos-envio-domicilio">
        {t('checkout.secondaryHeadingDelivery')}
      </SecondaryHeading>
      <Row>
        <Controller
          name="shipping.address"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-address"
              type="text"
              label={'*'.concat(t('checkout.inputLabelAddress'))}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'address-line1' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
      </Row>
      <Row>
        <Controller
          name="shipping.number"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-shipping-num"
              type="number"
              label={'*'.concat(t('checkout.inputLabelNumber'))}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'address-line2' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
        <Controller
          name="shipping.floor"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              data-test="checkout-address-floor"
              type="text"
              label={t('checkout.inputLabelFloor')}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              inputProps={{ autoComplete: 'address-line3' }}
            />
          )}
        />
        <Controller
          name="shipping.apartment"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              data-test="checkout-address-apt"
              type="text"
              label={t('checkout.inputLabelApartment')}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              inputProps={{ autoComplete: 'address-line4' }}
            />
          )}
        />
      </Row>
      <AuxiliarHeading>{t('checkout.auxiliarHeading')}</AuxiliarHeading>
      <Row>
        <Controller
          name="shipping.betweenStreetNumberOne"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-betweenStreetNumberOne"
              type="text"
              label={'*'.concat(t('checkout.inputLabelAddress'), ' 1')}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'address-line5' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
        <Controller
          name="shipping.betweenStreetNumberTwo"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-betweenStreetNumberTwo"
              type="text"
              label={'*'.concat(t('checkout.inputLabelAddress'), ' 2')}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'address-line6' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
      </Row>
      <SelectInputsRow>
        <Controller
          name="shipping.province"
          control={control}
          defaultValue=""
          render={({ field: { onChange } }) => (
            <StyledAutoComplete
              data-test="checkout-province-essen"
              disableClearable
              options={essenProvincias}
              fullWidth
              value={provinceValue}
              PaperComponent={({ children }) => <StyledPaper>{children}</StyledPaper>}
              onChange={(e, data) => {
                // debemos manipular el onChange de esta manera con el AutoComplete porque en la version que manejamos de material hay un bug en este component
                setIsProvinceSelected(true)
                setLocationValue(null)
                setProvinceValue(data)
                setProvinceId(data.id)
                onChange(data)
              }}
              getOptionLabel={(option) => option.nombre}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  InputLabelProps={{ required: false }}
                  required
                  label={'*'.concat(t('checkout.inputLabelProvince'))}
                />
              )}
            />
          )}
        />
        <Controller
          name="shipping.city"
          control={control}
          defaultValue=""
          render={({ field: { onChange } }) => (
            <StyledAutoComplete
              data-test="checkout-city-essen"
              disabled={!isProvinceSelected}
              disableClearable
              clearText="Clear"
              options={getLocalidadesOf(provinceId)}
              fullWidth
              PaperComponent={({ children }) => <StyledPaper>{children}</StyledPaper>}
              value={locationValue}
              onChange={(e, data) => {
                //debemos manipular el onChange de esta manera con el AutoComplete porque en la version que manejamos de material hay un bug en este component
                setLocationValue(data)
                onChange(data)
              }}
              getOptionLabel={(option) => option.nombre}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  required
                  InputLabelProps={{ required: false }}
                  label={'*'.concat(t('checkout.inputLabelCity'))}
                />
              )}
            />
          )}
        />
      </SelectInputsRow>

      <Row>
        <Controller
          name="shipping.postalCode"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Input
              data-test="checkout-postal"
              type="number"
              label={'*'.concat(t('checkout.inputLabelPostalCode'))}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={Boolean(error)}
              helperText={error?.message}
              inputProps={{ autoComplete: 'postal-code' }}
            />
          )}
          rules={{ required: t('checkout.required') }}
        />
      </Row>
    </>
  )
}

EssenForm.propTypes = {
  control: PropTypes.object.isRequired,
}
