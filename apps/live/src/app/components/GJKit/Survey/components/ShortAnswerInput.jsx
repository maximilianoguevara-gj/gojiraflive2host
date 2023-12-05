import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '@mui/material'
import { useShortAnswerInput } from 'react-google-forms-hooks'
import { useTranslation } from 'react-i18next'

export const ShortAnswerInput = ({ id }) => {
  const { t } = useTranslation()
  const { register } = useShortAnswerInput(id)

  return (
    <Input
      type="text"
      placeholder={t('form.satisfactionEvent.placeHolderResponse')}
      fullWidth
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

ShortAnswerInput.propTypes = {
  id: PropTypes.string.isRequired,
}
