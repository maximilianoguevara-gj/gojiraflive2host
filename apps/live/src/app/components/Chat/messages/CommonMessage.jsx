import React from 'react'
import PropTypes from 'prop-types'
import {
  Message,
  MessageBox,
  MessageContainer,
  UserIcon,
  ModeratorIcon,
  UserIconContainer,
  Username,
} from '../style'
import { useTranslation } from 'react-i18next'
import { StreamRoles } from '../../../constants/streamRoles'
import MessageWithLink from './MessageWithLink'

export const CommonMessage = ({ message, isDesktop, isModerator }) => {
  const { t } = useTranslation()
  const textMessage = (message) => {
    if (message.type === 'deleted') {
      return t('chat.deletedMessage')
    }
    return message.text
  }

  return (
    <MessageContainer isModerator={isModerator}>
      <MessageBox>
        <UserIconContainer>{isModerator ? <ModeratorIcon /> : <UserIcon />}</UserIconContainer>
        <Username isDesktop={isDesktop}>{`${message.user.name}: `}</Username>
        {message.user.role === StreamRoles.ADMIN ? (
          <MessageWithLink isDesktop={isDesktop}>
            <Message isDesktop={isDesktop} data-test="user-message">
              {textMessage(message)}
            </Message>
          </MessageWithLink>
        ) : (
          <Message isDesktop={isDesktop} data-test="user-message">
            {textMessage(message)}
          </Message>
        )}
      </MessageBox>
    </MessageContainer>
  )
}

CommonMessage.propTypes = {
  isDesktop: PropTypes.bool,
  message: PropTypes.object.isRequired,
  isModerator: PropTypes.object.isRequired,
}
