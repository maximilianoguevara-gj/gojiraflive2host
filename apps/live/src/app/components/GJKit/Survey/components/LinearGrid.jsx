import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { selectUiSize, UI_IS_TABLET } from '../../../../reducers/uiSlice'
import { useSelector } from 'react-redux'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useLinearInput } from 'react-google-forms-hooks'
import { useTranslation } from 'react-i18next'

export const LinearGrid = ({ id }) => {
  const { t } = useTranslation()
  const isMobile = useSelector(selectUiSize) === UI_IS_TABLET
  const { options, legend, error } = useLinearInput(id)

  return (
    <>
      <Container isMobile={isMobile}>
        <Label isMobile={isMobile}>{legend.labelFirst}</Label>
        <FormControl>
          <RadioGroupStyled row aria-labelledby="form-control" name="rate">
            {options.map((o) => {
              return (
                <FormControlLabelStyled
                  key={o.id}
                  label={o.label}
                  labelPlacement="top"
                  isMobile={isMobile}
                  control={<Radio {...o.registerOption()} sx={styles} />}
                />
              )
            })}
          </RadioGroupStyled>
        </FormControl>
        <Label isMobile={isMobile}>{legend.labelLast}</Label>
      </Container>
      <ErrorLabel>{error && t('form.satisfactionEvent.errorMessage')}</ErrorLabel>
    </>
  )
}
const styles = {
  p: 0,
  color: '#000',
  '&.Mui-checked': {
    color: '#000',
  },
}

const RadioGroupStyled = styled(RadioGroup)`
  flex-direction: row;
`
const FormControlLabelStyled = styled(FormControlLabel)`
  &.MuiFormControlLabel-root {
    margin-left: ${({ isMobile }) => (isMobile ? '5px' : '16px')};
    margin-right: ${({ isMobile }) => (isMobile ? '5px' : '16px')};
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
`
const Label = styled.div`
  font-family: 'Montserrat';
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0;
  align-self: ${({ isMobile }) => (isMobile ? 'center' : 'flex-end')};
  margin: ${({ isMobile }) => (isMobile ? '1rem 0' : '')};
  width: ${({ isMobile }) => (isMobile ? '46px' : '')};
  text-align: ${({ isMobile }) => (isMobile ? 'center' : '')};
`
const ErrorLabel = styled.span`
  color: red;
`

LinearGrid.propTypes = {
  id: PropTypes.string.isRequired,
}
