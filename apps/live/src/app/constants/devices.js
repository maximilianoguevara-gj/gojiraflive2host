const size = {
  mobile: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopSmall: '1080px',
  laptopMedium: '1440px',
  laptopLarge: '1680px',
  desktop: '2560px',
}

export const device = {
  mobile: `(min-width: ${size.mobile})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopSmall: `(min-width: ${size.laptopSmall})`,
  laptopMedium: `(min-width: ${size.laptopMedium})`,
  laptopLarge: `(min-width: ${size.laptopLarge})`,
  desktop: `(min-width: ${size.desktop})`,
}
