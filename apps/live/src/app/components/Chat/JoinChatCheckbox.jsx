import React from 'react'
import PropTypes from 'prop-types'
import StyledCheckbox from '../styledCheckbox'
import { useTranslation } from 'react-i18next'
import { HelperText, Link } from '../dialogs/style'
import { JoinChatCheckboxContainer } from './style'

export const JoinChatCheckbox = ({ checked, setChecked, showErrorMessage, errorMessage }) => {
  const { t } = useTranslation()
  return (
    <>
      <JoinChatCheckboxContainer>
        <StyledCheckbox
          data-test="check-term-save-email"
          id="join-chat-checkbox"
          checked={checked}
          onClick={setChecked}
        />
        <label htmlFor="join-chat-checkbox">
          {t('chat.accept')}
          <Link href="https://gojiraf.com/terms/" target="_blank" rel="noreferrer">
            {` ${t('chat.termsAndConditions')}.`}
          </Link>
        </label>
      </JoinChatCheckboxContainer>
      {showErrorMessage && <HelperText>{errorMessage}</HelperText>}
    </>
  )
}

JoinChatCheckbox.propTypes = {
  checked: PropTypes.bool,
  setChecked: PropTypes.func,
  errorMessage: PropTypes.string,
  showErrorMessage: PropTypes.bool,
}
