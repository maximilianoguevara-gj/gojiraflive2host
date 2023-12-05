import React from 'react'
import { Container } from './style'
import { useSelector } from 'react-redux'
import { selectShowAskNameDialog } from '../../reducers/uiSlice'
import { JoinChatForm } from '../Chat/JoinChatForm'

const AskNameDialog = () => {
  const askNameDialogIsVisible = useSelector(selectShowAskNameDialog)

  return (
    <Container data-test="askName-container" open={askNameDialogIsVisible ?? false}>
      <JoinChatForm isDesktop />
    </Container>
  )
}

export default AskNameDialog
