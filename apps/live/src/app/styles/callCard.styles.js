export default (theme) => {
  return {
    grid__main__child: {
      [theme.breakpoints.down('sm')]: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      [theme.breakpoints.up('sm')]: {
        height: '100vh',
      },
    },
    call__card: {
      [theme.breakpoints.up('sm')]: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        backgroundImage: `url(../../../assets/calling.svg)`,
      },
      [theme.breakpoints.down('sm')]: {
        position: 'absolute',
        height: window.innerHeight,
        width: window.innerWidth,
        display: 'flex',
        flexDirection: 'column-reverse',
      },
    },
    color__white: {
      color: theme.palette.background.paper,
    },
    column__height: {
      height: '100%',
      margin: '70px 0px',
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: '10px',
      paddingBottom: '220px',
    },
    backgroud__color: {
      backgroundColor: '#28282C',
    },
    'grid__item--paddingTB': {
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(5, 0),
      },
    },
    call_buttons__container: {
      padding: theme.spacing(1, 0),
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      [theme.breakpoints.up('sm')]: {
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      position: 'absolute',
      bottom: '0',
      display: 'flex',
      width: '100%',
      zIndex: '1',
    },
    spacer: {
      width: 59,
    },
    button__colors: {
      backgroundColor: 'red',
      color: theme.palette.background.paper,
    },
    floating__message__container: {
      bottom: '75px',
      zIndex: '1',
      position: 'absolute',
      width: '100%',
    },
    floating__message__box: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      height: '50px',
      width: '100%',
    },
    floating__message: {
      paddingTop: '15px',
      color: theme.palette.background.paper,
    },
    card__store__container: {
      position: 'relative',
      zIndex: 2,
    },
    card__controls__container: {
      position: 'relative',
      zIndex: 2,
    },
    'card--full-width': {
      width: '100%',
    },
  }
}
