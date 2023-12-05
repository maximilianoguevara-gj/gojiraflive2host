import React from 'react'
import PropTypes from 'prop-types'
import { HelperText, InputJoinChat, JoinChatInputContainer } from '../dialogs/style'

export const JoinChatInput = ({
  data,
  setData,
  showErrorMessage,
  errorMessage,
  inputLabel,
  dataTest,
}) => {
  return (
    <JoinChatInputContainer>
      <InputJoinChat
        data-test={dataTest}
        onChange={(e) => setData(e.target.value)}
        label={inputLabel}
        value={data}
        variant="outlined"
        error={showErrorMessage}
        FormHelperTextProps={{ margin: 0 }}
      />
      {showErrorMessage && <HelperText>{errorMessage}</HelperText>}
    </JoinChatInputContainer>
  )
}

JoinChatInput.propTypes = {
  data: PropTypes.string,
  setData: PropTypes.func,
  inputLabel: PropTypes.string,
  errorMessage: PropTypes.string,
  showErrorMessage: PropTypes.bool,
  dataTest: PropTypes.string,
}
