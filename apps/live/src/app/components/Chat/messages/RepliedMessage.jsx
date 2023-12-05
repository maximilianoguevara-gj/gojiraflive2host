import React from 'react'
import PropTypes from 'prop-types'
import {
  Message,
  MessageBox,
  MessageContainer,
  Reply,
  ReplyMessageContainer,
  UserIcon,
  ModeratorIcon,
  UserIconContainer,
  Username,
} from '../style'
import MessageWithLink from './MessageWithLink'

export const RepliedMessage = ({ message, isDesktop }) => {
  const showMessage = message.type !== 'deleted'

  return (
    <>
      {showMessage && (
        <MessageContainer>
          <UserIconContainer>
            <UserIcon />
          </UserIconContainer>
          <Username isDesktop={isDesktop}>{`${message.quoted_message.user.name}: `}</Username>
          <Message isDesktop={isDesktop}>{message.quoted_message.text}</Message>
          <ReplyMessageContainer>
            <Reply isDesktop={isDesktop} />
            <ModeratorIcon />
            <MessageBox>
              <Username data-test="username-inner-chat" isDesktop={isDesktop}>
                {`${message.user.name}: `}
              </Username>
              <MessageWithLink isDesktop={isDesktop}>
                <Message isDesktop={isDesktop}>{message.text}</Message>
              </MessageWithLink>
            </MessageBox>
          </ReplyMessageContainer>
        </MessageContainer>
      )}
    </>
  )
}

RepliedMessage.propTypes = {
  isDesktop: PropTypes.bool,
  message: PropTypes.object.isRequired,
}
