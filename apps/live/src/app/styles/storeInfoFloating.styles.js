export default (theme) => {
  return {
    call__info__container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 'fit-content',
    },
    call__info__box: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingRight: '1em',
      borderRadius: '16em',
    },
    img__container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0.25em',
    },
    img__logo__card: {
      maxWidth: '2em',
      maxHeight: '2em',
      with: '22px',
      height: '22px',
      borderRadius: '50%',
    },
    call__info__container_child: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      alignItems: 'center',
    },
    store__name: {
      marginLeft: '10px',
      color: theme.palette.background.paper,
      letterSpacing: '0px',
      fontSize: '11px',
      fontWeight: 'normal',
    },
  }
}
