import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { Dialog, DialogContent } from '@material-ui/core'
import { VolumeOffOutlined } from '@material-ui/icons'
import { useAuth } from '@gojiraf/auth'

import CallService from '../services/callService'
import { useTranslation } from 'react-i18next'
import { CallStates } from '../constants/callStates'
import { useDispatch, useSelector } from 'react-redux'
import { leaveCall, selectBanUser, selectCallState } from '../reducers/callSlice'
import { selectCurrentStore } from '../reducers/storeSlice'
import { useNavigate } from 'react-router-dom'
import { selectChatMuted } from '../reducers/uiSlice'

const AutoPlayUnlocker = ({ children }) => {
  const { t } = useTranslation()
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const dispatch = useDispatch()
  const callState = useSelector(selectCallState)
  const chatMuted = useSelector(selectChatMuted)
  const banUser = useSelector(selectBanUser)
  const { id: storeId } = useSelector(selectCurrentStore)
  const navigate = useNavigate()
  const { addBan, addMute } = useAuth()

  useEffect(() => {
    AgoraRTC.onAutoplayFailed = () => {
      setDialogIsOpen(true)
    }
  }, [])

  useEffect(() => {
    if (callState === CallStates.SELLER_HANG_UP_ALL) {
      setDialogIsOpen(false)
    }
  }, [callState])

  useEffect(() => {
    if (banUser) {
      addBan(storeId)
      dispatch(leaveCall())
      navigate(`/`)
    }
  }, [banUser])

  useEffect(() => {
    if (chatMuted) addMute(storeId)
  }, [chatMuted])

  const handleOnClose = () => {
    setDialogIsOpen(false)
    CallService.restartAudioTracks()
  }

  return (
    <>
      {children}
      <AutoPlayUnlocker.Container open={dialogIsOpen} onClick={handleOnClose}>
        <AutoPlayUnlocker.Icon />
        <AutoPlayUnlocker.Content>
          {t('dialogs.autoPlayUnlocker.dialogContentText')}
        </AutoPlayUnlocker.Content>
      </AutoPlayUnlocker.Container>
    </>
  )
}

AutoPlayUnlocker.Icon = styled(VolumeOffOutlined)`
  text-align: center;
  margin-top: 2rem;
  font-size: 2.5rem;
`
AutoPlayUnlocker.Container = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 0.5rem;
    font-size: 0.9em;
    align-items: center;
    max-width: 10rem;
  }
`
AutoPlayUnlocker.Content = styled(DialogContent)`
  text-align: center;
  font-weight: 600;
  color: black;
  line-height: 1rem;
  &.MuiDialogContent-root {
    padding: 1.05rem 1.5rem 1.05rem 1.5rem;
  }
`

AutoPlayUnlocker.propTypes = {
  children: PropTypes.any,
}

export { AutoPlayUnlocker }
