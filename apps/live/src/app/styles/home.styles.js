export default (theme) => {
  return {
    bgImage_fullScreen__main: {
      backgroundColor: 'black',
      height: '100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      [theme.breakpoints.up('sm')]: {
        flexGrow: 1,
        height: '100vh',
      },
      [theme.breakpoints.down('sm')]: {
        height: window.innerHeight,
      },
    },
    loader__fullheight: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        height: window.innerHeight,
        alignItems: 'center',
      },
    },
    logo: {
      [theme.breakpoints.down('sm')]: {
        width: '60%',
      },
    },
    color__white: {
      color: theme.palette.background.paper,
    },
  }
}
