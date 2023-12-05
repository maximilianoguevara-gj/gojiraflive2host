export default (theme) => {
  return {
    fullheight__card__floating: {
      height: '100%',
      padding: theme.spacing(3),
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    },
    padding__TB: {
      padding: theme.spacing(3, 0, 3, 0),
    },
    color__white: {
      color: theme.palette.background.paper,
    },
    bgImage_fullScreen__main: {
      backgroundColor: 'black',
      height: '100vh',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
  }
}
