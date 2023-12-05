import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import { useLongAnswerInput } from 'react-google-forms-hooks'
import { useTranslation } from 'react-i18next'

export const LongAnswerInput = ({ id }) => {
  const { t } = useTranslation()
  const { register } = useLongAnswerInput(id)

  return (
    <TextField
      type="text"
      placeholder={t('form.satisfactionEvent.placeHolderResponse')}
      maxRows={7}
      multiline
      fullWidth
      variant="standard"
      inputProps={inputProps}
      sx={styles}
      {...register()}
    />
  )
}

const inputProps = {
  maxlength: 300,
}
const styles = {
  '& .MuiInputBase-input': {
    fontFamily: 'Montserrat',
    fontSize: '14px',
  },
  '& ::placeholder': {
    fontFamily: 'Montserrat',
  },
  '& .MuiInputBase-root:after': {
    borderBottom: '2px solid #000',
  },
}

LongAnswerInput.propTypes = {
  id: PropTypes.string.isRequired,
}
