export default (theme) => {
  return {
    h1_not_found__message: {
      color: theme.palette.background.paper,
    },
    grid__main__child: {
      [theme.breakpoints.up('sm')]: {
        flexGrow: 1,
        height: '100vh',
      },
      [theme.breakpoints.down('sm')]: {
        height: '50vh',
        margin: theme.spacing(4, 0),
      },
    },
    grid__item__paddingTB: {
      padding: theme.spacing(5, 0),
    },
    grid__item__marginT2: {
      marginTop: theme.spacing(3),
    },
  }
}
