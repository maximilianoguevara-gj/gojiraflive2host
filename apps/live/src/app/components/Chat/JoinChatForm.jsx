import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Cancel, Confirm, JoinChatContainer, Title } from '../dialogs/style'
import { JoinChatInput } from './JoinChatInput'
import { JoinChatCheckbox } from './JoinChatCheckbox'
import { useSendUser } from '../../hooks/useSendUser'
import { CircularProgress } from '@material-ui/core'
import { ConfirmButtonContainer } from './style'

export const JoinChatForm = ({ isDesktop = false }) => {
  const { t } = useTranslation()
  const {
    handleConfirm,
    handleCancel,
    nickname,
    email,
    loading,
    showErrorMessageCheckbox,
    showErrorMessageEmail,
    showErrorMessageNickname,
    disable,
    checked,
    setChecked,
    setEmail,
    setNickname,
  } = useSendUser({ isDesktop })

  return (
    <JoinChatContainer isDesktop={isDesktop}>
      <Title data-test="askName-title" isDesktop={isDesktop}>
        {t('chat.contentTitle')}
      </Title>
      <JoinChatInput
        dataTest="askName-input"
        inputLabel={t('chat.inputNicknamePlaceholder')}
        errorMessage={t('homePage.lengthErrorName')}
        data={nickname}
        setData={setNickname}
        showErrorMessage={showErrorMessageNickname}
      />
      <JoinChatInput
        dataTest="askEmail-input"
        inputLabel={t('chat.inputEmailPlaceholder')}
        errorMessage={t('chat.formatErrorEmail')}
        data={email}
        setData={setEmail}
        showErrorMessage={showErrorMessageEmail}
      />
      <JoinChatCheckbox
        checked={checked}
        setChecked={() => setChecked(!checked)}
        showErrorMessage={showErrorMessageCheckbox}
        errorMessage={t('chat.errorCheckbox')}
      />
      <ConfirmButtonContainer>
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Confirm
            data-test="askName-confirm"
            variant="contained"
            disabled={disable}
            onClick={handleConfirm}
          >
            {t('chat.buttonConfirm').toUpperCase()}
          </Confirm>
        )}
      </ConfirmButtonContainer>

      {isDesktop && (
        <Cancel data-test="askName-cancel" disable={loading} onClick={handleCancel}>
          {t('chat.buttonCancel')}
        </Cancel>
      )}
    </JoinChatContainer>
  )
}

JoinChatForm.propTypes = {
  isDesktop: PropTypes.bool,
}
