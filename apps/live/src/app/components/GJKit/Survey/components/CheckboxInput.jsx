import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useCheckboxInput } from 'react-google-forms-hooks'
import { useTranslation } from 'react-i18next'

export const CheckboxInput = ({ id }) => {
  const { t } = useTranslation()
  const { options, customOption } = useCheckboxInput(id)

  return (
    <Container>
      {options.map((o) => (
        <CheckboxContainer key={o.id}>
          <input type="checkbox" id={o.id} {...o.registerOption()} />
          <label htmlFor={o.id}>{o.label}</label>
        </CheckboxContainer>
      ))}
      {customOption && (
        <CheckboxContainer>
          <input type="checkbox" id={customOption.id} {...customOption.registerOption()} />
          <label htmlFor={customOption.id}>Outra</label>
          <input
            type="text"
            placeholder={t('form.satisfactionEvent.placeHolderResponse')}
            {...customOption.registerCustomInput()}
          />
        </CheckboxContainer>
      )}
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

CheckboxInput.propTypes = {
  id: PropTypes.string.isRequired,
}
