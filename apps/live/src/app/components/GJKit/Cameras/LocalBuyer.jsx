import React from 'react'
import { UserBox } from './UserBox'
import { useTranslation } from 'react-i18next'
import {
  selectLocalCameraEnabled,
  selectLocalCameraTrack,
  selectLocalMicrophoneEnabled,
  selectLocalMicrophoneTrack,
} from '../../../reducers/callSlice'
import { useSelector } from 'react-redux'

const LocalBuyer = ({ ...props }) => {
  const { t } = useTranslation()
  const audioEnabled = useSelector(selectLocalMicrophoneEnabled)
  const audioTrack = useSelector(selectLocalMicrophoneTrack)

  const videoEnabled = useSelector(selectLocalCameraEnabled)
  const videoTrack = useSelector(selectLocalCameraTrack)

  return (
    <UserBox
      userName={t('chat.localBuyer')}
      audioTrack={audioEnabled ? audioTrack : null}
      dontPlay
      videoTrack={videoEnabled ? videoTrack : null}
      {...props}
    />
  )
}

export { LocalBuyer }
