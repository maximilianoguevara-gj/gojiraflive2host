import { useTranslation } from 'react-i18next'

export const useLangCheckout = (store) => {
  const { t } = useTranslation()
  const returnFullNameLabel = (store) => {
    if (store.company.companyConfigurations.useCuit) return '*Razón social'
    return '*Nombre y Apellido'
  }

  const checkoutRegion = {
    AR: {
      fullName: `${returnFullNameLabel(store)}`,
      email: '*Email',
      currency: 'ARS',
      address: '*Calle',
      numberAddress: '*Número',
      floorApartment: 'Piso - Depto',
      city: '*Localidad',
      postalCode: '*Código Postal',
      phone: '*Teléfono de contacto',
      region: '*Provincia',
      resellerNumber: '*N de Cuenta',
      zoneNumber: '*N de zona',
      identityDocument: {
        value: `${store.company.companyConfigurations.useCuit ? '*CUIT' : '*D.N.I'}`,
        minLength: `${store.company.companyConfigurations.useCuit ? 11 : 8}`,
        maxLength: `${store.company.companyConfigurations.useCuit ? 11 : 8}`,
        required: t('checkout.required'),
      },
    },

    CL: {
      fullName: '*Nombre y Apellido',
      email: '*Email',
      currency: 'CLP',
      address: '*Calle',
      numberAddress: '*Número',
      floorApartment: 'Piso - Depto',
      city: '*Comuna',
      postalCode: '*Código Postal',
      phone: '*Teléfono de contacto',
      region: '*Región',
      resellerNumber: '*N de Cuenta',
      zoneNumber: '*N de zona',
      identityDocument: {
        value: '*R.U.T',
        minLength: 9,
        maxLength: 9,
        required: t('checkout.required'),
      },
    },

    UY: {
      fullName: '*Nombre y Apellido',
      email: '*Email',
      currency: 'UYU',
      address: '*Calle',
      numberAddress: '*Número',
      floorApartment: 'Piso - Depto',
      city: '*Departamento',
      postalCode: '*Código Postal',
      phone: '*Teléfono de contacto',
      region: '*Ciudad',
      resellerNumber: '*Nº de Cuenta',
      zoneNumber: '*Nº de zona',
      identityDocument: {
        value: '*C.I',
        minLength: 8,
        maxLength: 8,
        required: t('checkout.required'),
      },
    },

    PY: {
      fullName: '*Nombre y Apellido',
      email: '*Email',
      currency: 'PYG',
      address: '*Calle',
      numberAddress: '*Número',
      floorApartment: 'Piso - Depto',
      city: '*Departamento',
      postalCode: '*Código Postal',
      phone: '*Teléfono de contacto',
      region: '*Municipio',
      resellerNumber: '*Nº de Cuenta',
      zoneNumber: '*Nº de zona',
      identityDocument: {
        value: '*D.N.I/R.U.C',
        minLength: 8,
        maxLength: 13,
        required: t('checkout.required'),
      },
    },

    MX: {
      fullName: '*Nombre y Apellido',
      email: '*Email',
      currency: 'MXN',
      address: '*Calle',
      numberAddress: '*Exterior',
      floorApartment: 'Interior',
      city: '*Estado',
      colony: '*Colonia',
      postalCode: '*Código Postal',
      phone: '*Teléfono de contacto',
      region: '*Municipio',
      resellerNumber: '*Nº de Cuenta',
      zoneNumber: '*Nº de zona',
      identityDocument: {
        value: 'C.U.R.P',
        minLength: 2,
        maxLength: 18,
        required: false,
      },
    },

    CO: {
      fullName: '*Nombre y Apellido',
      email: '*Email',
      currency: 'COP',
      address: '*Calle + numero',
      numberAddress: '*Número',
      floorApartment: 'Piso - Depto',
      city: '*Ciudad',
      postalCode: '*Código Postal',
      phone: '*Teléfono de contacto',
      region: '*Departamento',
      resellerNumber: '*Nº de Cuenta',
      zoneNumber: '*Nº de zona',
      identityDocument: {
        value: '*CC/CE',
        minLength: 2,
        maxLength: 20,
        required: t('checkout.required'),
      },
    },

    ES: {
      fullName: '*Nombre y Apellido',
      email: '*Email',
      currency: 'EUR',
      address: '*Calle',
      numberAddress: '*Número',
      floorApartment: 'Piso - Puerta',
      city: '*Localidad',
      postalCode: '*Código Postal',
      phone: '*Teléfono de contacto',
      region: '*Provincia',
      resellerNumber: '*Nº de Cuenta',
      zoneNumber: '*Nº de zona',
      identityDocument: {
        value: '*N.I.F',
        minLength: 2,
        maxLength: 20,
        required: t('checkout.required'),
      },
    },

    US: {
      fullName: '*Name and Surname',
      email: '*Email',
      currency: 'USD',
      address: '*Address',
      numberAddress: '*Number',
      floorApartment: 'N/A',
      city: '*City',
      postalCode: '*Zip Code',
      phone: '*Phone Number',
      region: '*State',
      resellerNumber: '*Account Number',
      zoneNumber: '*Zone Number',
      identityDocument: {
        value: '*I.D',
        minLength: 10,
        maxLength: 20,
        required: t('checkout.required'),
      },
    },

    BR: {
      fullName: '*Nome e Sobrenome',
      email: '*Email',
      currency: 'BRL',
      address: '*Endereço',
      numberAddress: '*Número',
      floorApartment: 'Apartamento',
      city: '*Cidade',
      postalCode: '*CEP',
      phone: '*Telefone de contato',
      region: '*Estado',
      resellerNumber: '*Nº de Conta',
      zoneNumber: '*Nº de zona',
      identityDocument: {
        value: '*CPF',
        minLength: 10,
        maxLength: 20,
        required: t('checkout.required'),
      },
    },
  }

  const langCheckout = checkoutRegion[store.countryCode]

  return { langCheckout }
}
