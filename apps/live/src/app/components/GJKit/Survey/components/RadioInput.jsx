import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useRadioInput } from 'react-google-forms-hooks'
import { useTranslation } from 'react-i18next'

export const RadioInput = ({ id }) => {
  const { t } = useTranslation()
  const { options, customOption, error } = useRadioInput(id)

  return (
    <Container>
      {options.map((o) => (
        <CheckboxContainer key={o.id}>
          <input type="radio" id={o.id} {...o.registerOption()} />
          <label htmlFor={o.id}>{o.label}</label>
        </CheckboxContainer>
      ))}
      {customOption && (
        <CheckboxContainer>
          <input type="radio" id={customOption.id} {...customOption.registerOption()} />
          <label htmlFor={customOption.id}>Outra</label>
          <input
            type="text"
            placeholder={t('form.satisfactionEvent.placeHolderResponse')}
            {...customOption.registerCustomInput()}
          />
        </CheckboxContainer>
      )}
      <ErrorLabel>{error && t('form.satisfactionEvent.errorMessage')}</ErrorLabel>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const CheckboxContainer = styled.div`
  display: flex;

  & label {
    margin: 0 10px;
  }
`
const ErrorLabel = styled.span`
  color: red;
  padding: 10px 0;
`

RadioInput.propTypes = {
  id: PropTypes.string.isRequired,
}
