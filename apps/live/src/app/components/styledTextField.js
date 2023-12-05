import { withStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'

export const StyledLightTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#FFFFFF',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#FFFFFF',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FFFFFF',
    },
    '& .MuiInputBase-input': {
      fontSize: '10px',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FFFFFF',
      },
      '&:hover fieldset': {
        borderColor: '#FFFFFF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFFFFF',
      },
    },
  },
})(TextField)
