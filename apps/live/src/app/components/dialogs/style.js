import styled from 'styled-components'
import { Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core'
import { Button } from '../Kit/Buttons'
import { Label } from '../Kit/Label'
import { NameInput } from '../../styles/LoadingLayout.styles'

// AskNameDialog
export const Container = styled(Dialog)`
  .MuiDialog-paper {
    font-size: 0.9em;
    align-items: center;
    width: 400px;
    border-radius: 8px;
  }
`
export const PayPalButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: ${({ padding }) => padding || '0'};
`
export const Link = styled.a`
  color: rgba(47, 130, 255, 1);
`
export const Content = styled(DialogContent)`
  text-align: center;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.2px;

  &.MuiDialogContent-root {
    padding: 2.5em 1.5em 0em 1.5em;
  }
`
export const Actions = styled(DialogActions)`
  flex-direction: column;
  padding: 0;
`
export const Confirm = styled(Button)`
  width: 133px;
  height: 41px;
  background: #000000;
  border-radius: 40px;
  color: #ffffff;
  padding: 0;
`
export const Cancel = styled(Label)`
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #000000;
`
export const Input = styled(NameInput)`
  width: 70%;
  margin: 2.5em 0 2em;

  input {
    text-align: center;
    color: ${({ turnErrorColor }) => (turnErrorColor ? 'red' : '')};
  }
  input::placeholder {
    text-align: center;
    text-align-last: center;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 22px;
    letter-spacing: 0.1px;
    color: #888888;
  }
  .MuiFormHelperText-root {
    font-size: 0.6rem;
    text-align: center;
    color: red;
  }
`

export const JoinChatContainer = styled.div`
  display: ${({ isDesktop }) => (isDesktop ? 'flex' : 'grid')};
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  gap: 1rem;
`

export const Title = styled.h1`
  font-size: 16px;
  font-weight: 600;
  text-align: ${({ isDesktop }) => (isDesktop ? 'center' : 'left')};
`
export const Subtitle = styled.p`
  font-size: 12px;
`

export const HelperText = styled.span`
  font-size: 12px;
  color: red;
  text-align: center;
`

export const InputJoinChat = styled(TextField)`
  .MuiInputLabel-root {
    font-size: 12px;
  }
  font-size: 14px;
  width: 100%;
`

export const JoinChatInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
