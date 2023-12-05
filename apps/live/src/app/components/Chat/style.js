import styled, { css } from 'styled-components'
import { device } from '../../constants/devices'
import { PersonOutline, ReplyOutlined } from '@material-ui/icons'
import { FlexContainer } from '../Kit/Container'
import { RoundedButton } from '../Kit/Buttons'

export const MessagesContainer = styled(FlexContainer)`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  overflow: hidden;
  margin: ${({ isDesktop }) => (!isDesktop ? '0 1rem 0 1rem' : null)};
  padding-bottom: 0.5rem;
  @media ${device.laptop} {
    flex-direction: column;
    .str-chat__list-notifications {
      bottom: 80px;
    }
  }
  .str-chat__ul {
    list-style-type: none;
    padding-inline-start: 0px;
    margin-bottom: 0;
  }

  .str-chat__container {
    position: static;
  }

  .str-chat__li,
  .str-chat__message-simple {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .str-chat__avatar {
    font-size: 0.65rem !important;
    flex-basis: 20px !important;
    width: 20px !important;
    font-weight: 900;
    word-break: break-word;
    :first-letter {
      text-transform: uppercase;
    }
    @media ${device.laptop} {
      font-size: 0.85rem !important;
    }
  }

  .str-chat__message-status,
  .str-chat__date-separator,
  .str-chat__message-options,
  .str-chat__message-data {
    display: none;
  }

  .str-chat__avatar-fallback {
    :after {
      content: ':';
    }
  }

  .str-chat__message-list-scroll {
    overflow-y: ${({ hidescroll }) => (hidescroll ? 'hidden' : 'auto')} !important;
  }

  .str-chat__message-list-scroll > div {
    position: static !important;
  }

  .str-chat__message-text {
    color: 'black';
    font-size: 0.65rem;
    word-break: break-word;
    overflow-wrap: break-word;
    overflow: hidden;
    @media ${device.laptop} {
      font-size: 0.85rem;
    }
  }
  .str-chat__list-notifications {
    position: absolute;
    align-self: end;
  }
`

export const ArrowDownScroll = styled(RoundedButton)`
  background-color: rgba(0, 0, 0, 0.5);
  @media ${device.laptop} {
    margin-right: 1.5rem;
    background-color: rgba(0, 0, 0, 0.75);
    &:hover {
      background-color: black;
    }
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  align-items: center;
  @media ${device.laptop} {
    margin: auto;
  }
`

export const MessageBox = styled.div``

export const UserIcon = styled(PersonOutline)`
  border-radius: 100%;
  font-size: 0.75rem;
  color: white;
  margin: -0.188rem;
  margin-right: 1rem;
  margin-right: 5px;

  @media ${device.laptop} {
    font-size: 1rem;
    color: black;
    background-color: white;
    display: inline-block;
  }
`

export const MessagesListItem = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-top: 0.313rem;
  max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : 'none')};
  &:last-of-type {
    margin-bottom: 0;
  }
`
export const Message = styled.span`
  color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  font-size: 0.65rem;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  @media ${device.laptop} {
    font-size: 0.85rem;
  }
`
export const MessageContainer = styled.div`
  ${({ isModerator }) =>
    isModerator
      ? css`
          padding: 0.1rem 0.5rem;
          border-radius: 0.5rem;
          word-break: break-all;
          background-color: rgba(255, 255, 255, 0.2);
          font-size: 0.75rem;
          font-weight: 700;
          @media ${device.laptop} {
            background-color: rgba(229, 229, 229, 1);
            padding: 0.625rem;
            font-weight: 500;
            max-width: 100%;
          }
        `
      : css`
          padding: 0rem 0.5rem;
        `}
`

export const QuotedMessage = styled.div`
  background: lightgray;
`

export const UserIconContainer = styled.span`
  font-size: 0.75rem;
`

export const MessagesListItemContainer = styled.div`
  padding: 0rem;
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
  @media ${device.laptop} {
    padding: 0.625rem;
    max-width: 100%;
  }
`
export const ModeratorMessages = styled.div`
  border-radius: 0.5rem;
  padding: 0.1rem 0.5rem;
  word-break: break-all;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  font-weight: 700;

  @media ${device.laptop} {
    ${({ isreply }) =>
      isreply === 'true'
        ? css`
            background-color: rgba(229, 229, 229, 0.3);
          `
        : 'background-color: rgba(229, 229, 229, 1);'}
    padding: 0.625rem;
    font-weight: 500;
    max-width: 100%;
  }
`

export const ReplyMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: 0.5rem;
  padding: 0.1rem 0.5rem;
  word-break: break-all;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  font-weight: 700;

  @media ${device.laptop} {
    ${({ isreply }) =>
      isreply === 'true'
        ? css`
            background-color: rgba(229, 229, 229, 0.3);
          `
        : 'background-color: rgba(229, 229, 229, 1);'}
    padding: 0.625rem;
    font-weight: 500;
    max-width: 100%;
  }
`
export const ReplyMessageColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const Reply = styled(ReplyOutlined)`
  color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  transform: rotate(180deg);
  font-size: 1.5em;
  margin: 0.2rem;
  align-items: center;
  display: flex;
  flex-direction: row;
`

export const ModeratorIcon = styled(PersonOutline)`
  font-size: 0.75rem;
  color: black;
  display: ${({ isreply }) => (isreply === 'true' ? 'none' : 'inline-block')};
  margin: -0.188rem;
  margin-right: ${({ isPin }) => (isPin ? '0.1rem' : '0.313rem')};
  background-color: white;
  border-radius: 100%;
  @media ${device.laptop} {
    font-size: 1rem;
    display: inline-block;
  }
`
export const ChatContainer = styled(FlexContainer)`
  background: ${({ isDesktop }) =>
    isDesktop ? `none` : `linear-gradient(to top, rgb(0, 0, 0, 0.5), transparent)`};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${({ isDesktop, isLoading }) => (!isDesktop && isLoading ? `end` : 'normal')};
  align-items: ${({ isDesktop, isLoading }) => (!isDesktop && isLoading ? `center` : 'normal')};
  @media ${device.laptop} {
    flex-grow: 1;
  }

  .str-chat__channel {
    overflow: hidden;
    height: 100%;
  }
  .str-chat__container {
    position: static;
    height: 100%;
    width: 100%;
  }
  .str-chat__main-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .str-chat__virtual-list {
    margin: ${({ isDesktop }) => (isDesktop ? '0 1.5rem' : '0')};
    padding-bottom: ${({ isDesktop }) => (isDesktop ? '0.5rem' : '0')};
    max-height: ${({ isDesktop }) => (isDesktop ? 'none' : '8rem')};
    min-height: ${({ isDesktop }) => (isDesktop ? '0' : '6rem')};
    height: 100%;
    overflow-x: hidden;
  }
`
export const MainHeading = styled.h1`
  padding-bottom: 5px;
  text-align: ${({ textAlign }) => (textAlign ? textAlign : 'left')};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '1.5rem')};
  font-weight: 500;
  margin: 0.8em 1.5rem;
  line-height: 1.25em;
`

export const Username = styled.span`
  color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  font-size: 0.65rem;
  font-weight: 600;
  word-break: break-word;
  margin-right: 3px;
  :first-letter {
    text-transform: uppercase;
  }

  @media ${device.laptop} {
    font-size: 0.85rem;
  }
`
export const PinnedMessageContainer = styled.div`
  span + span {
    margin-left: 3px;
  }
`

export const PinMessage = styled(FlexContainer)`
  flex-direction: row;
  gap: 0.5rem;
  border: 1px dotted;
  border-color: white;
  border-radius: 0.5rem;
  padding: 0.1rem 0.5rem;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0.5rem 0;
  justify-content: space-between;
  max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : 'none')};
  @media ${device.laptop} {
    background-color: rgba(229, 229, 229, 0.8);
    border-color: black;
    font-weight: 500;
    padding: 0.5rem 1rem;
    margin: 0.5rem 1.5rem;
  }
`
export const AnchorLink = styled.a`
  color: ${({ isDesktop }) => (isDesktop ? '#0004EA' : 'white')};
  text-decoration: underline;
`

export const JoinChatCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`
export const ConfirmButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.563rem;
`
