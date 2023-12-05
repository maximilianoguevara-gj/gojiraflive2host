import styled from 'styled-components'
import { Cancel } from '@material-ui/icons'
import { FlexContainer } from '../Kit/Container'
import { device } from '../../constants/devices'
import { SendButton as Send } from 'stream-chat-react'

export const Container = styled.div`
  @media ${device.laptop} {
    flex-grow: unset;
    max-width: unset;
    width: 100%;
    bottom: 5px;
    padding: 1.5rem 1.5rem;
    border-top: 1px solid black;
  }
`

export const Input = styled.input`
  color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  background-color: transparent;
  border: none;
  font-size: 0.813rem;
  flex-grow: 1;
  outline: none;
  ::placeholder {
    color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
    opacity: 1;
  }
  :-ms-input-placeholder {
    color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  }
  ::-ms-input-placeholder {
    color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  }
`

export const InputContainer = styled(FlexContainer)`
  align-items: center;
  flex-direction: row;
  padding: 0.5em 1em;
  border-radius: 1.5rem;
  margin: ${({ isDesktop }) => (!isDesktop ? '0 1rem 0 1rem' : null)};
  border: 1px solid ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};

  .str-chat__fileupload-wrapper,
  .str-chat__send-button,
  .str-chat__emojiselect-wrapper,
  .rfu-dropzone__inner {
    display: none;
  }

  div {
    flex-grow: 1;
    display: flex;
  }

  textarea {
    width: 100%;
    color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
    font-size: 0.75rem;
    font-family: Montserrat;
    margin-right: 1em;
    background-color: transparent;
    border: none;
    outline: none;
    resize: none;
    white-space: nowrap;
    overflow: hidden;

    ::placeholder {
      color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
      opacity: 1;
    }
  }

  @media ${device.laptop} {
    padding: 0.5em 1em;
  }
`

export const QuotedMessagePreview = styled.span`
  color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  font-size: ${({ isDesktop }) => (isDesktop ? '0.813rem' : '0.75rem')};
  font-weight: 500;
  font-size: 0.75rem;
  margin-right: 1rem;
  white-space: nowrap;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  :first-letter {
    text-transform: uppercase;
  }
`

export const Message = styled.div`
  color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  font-size: 0.75rem;
`

export const SendButton = styled(Send)`
  transform: rotate(-45deg);
  font-size: 1.25em;
  margin: -0.05em 0 0.2em 0;
  border: none;
  background: none;
  cursor: pointer;

  path {
    fill: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  }
`
export const CancelButton = styled(Cancel)`
  color: ${({ isDesktop }) => (isDesktop ? 'black' : 'white')};
  margin: 0rem 0.25rem;
  font-size: 1.5em;
  cursor: pointer;
`
