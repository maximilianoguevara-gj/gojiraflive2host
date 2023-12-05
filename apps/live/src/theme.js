import { createTheme } from '@material-ui/core/styles'
import MontserratRegular from './fonts/Montserrat-Regular.ttf'
import MontserratMedium from './fonts/Montserrat-Medium.ttf'
import MontserratSemibold from './fonts/Montserrat-SemiBold.ttf'

const montserrat = {
  fontFamily: 'Montserrat',
  fontStyle: 'normal',
  fontDisplay: 'swap',
}

const montserratRegular = {
  ...montserrat,
  fontWeight: 400,
  src: `
    local('Montserrat'),
    url(${MontserratRegular}) format('truetype')
  `,
}

const montserratMedium = {
  ...montserrat,
  fontWeight: 500,
  src: `
    local('Montserrat'),
    url(${MontserratMedium}) format('truetype')
  `,
}

const montserratSemibold = {
  ...montserrat,
  fontWeight: 600,
  src: `
    local('Montserrat'),
    url(${MontserratSemibold}) format('truetype')
  `,
}

const primaryColor = '#000000'
const secondaryColor = '#FFFFFF'
const successColor = '#32D74B'
const alertColor = '#F9371C'
const errorColor = '#FF3B30'
const infoColor = '#0A84FF'
const textColor = '#FFFFFF'
// const backgroundColor = '#F5F0f0'
const backgroundColor = '#ffffff'
const grey = '#888888'

const theme = () => {
  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
      success: {
        main: successColor,
      },
      error: {
        main: errorColor,
        dark: alertColor,
      },
      info: {
        main: infoColor,
      },
      background: {
        default: backgroundColor,
        paper: textColor,
      },
      text: {
        primary: '#000',
        disabled: '#E7EAF1',
        secondary: grey,
      },
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
      h5: {
        fontWeight: 600,
        fontSize: 20,
        lineHeight: 1.26,
        letterSpacing: 0.2,
        color: primaryColor,
      },
      h6: {
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 1.22,
        letterSpacing: '0.01em',
        color: primaryColor,
      },
      subtitle2: {
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 1.16,
        letterSpacing: 2.0,
        color: primaryColor,
      },
      body1: {
        fontWeight: 400,
        fontSize: 16,
        lineHeight: '18px',
        letterSpacing: '0.01em',
        color: primaryColor,
      },
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [montserratRegular, montserratMedium, montserratSemibold],
        },
      },
    },
  })
}

export default theme
