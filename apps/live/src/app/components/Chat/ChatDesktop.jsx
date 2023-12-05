import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useViews } from 'state'
import { useAuth } from '@gojiraf/auth'
import { selectCurrentStore } from '../../reducers/storeSlice'
import { PhoneContainer } from '../Kit/Container'
import { LaptopCameras } from '../GJKit/Cameras/LaptopCameras'
import { ChatModule } from './ChatModule'
import { useChat } from '../../hooks/useChat'
import { useTranslation } from 'react-i18next'
import { selectActiveCallAction, CALL_ACTION_CAMERAS } from '../../reducers/uiSlice'

const ChatDesktop = ({ toggleMicrophone, toggleCamera }) => {
  const { user } = useAuth()
  const activeCard = useSelector(selectActiveCallAction)
  const { initChat, chatData, channelDeleted } = useChat({ user, isDesktop: true })
  const { state, send } = useViews()
  const { isOneToManySale, storeConfigurations } = useSelector(selectCurrentStore)
  const { t } = useTranslation()

  useEffect(() => {
    if (activeCard === CALL_ACTION_CAMERAS) {
      send({ type: 'SHOW_PARTICIPANTS' })
    } else {
      send({ type: 'SHOW_CHAT' })
    }
  }, [])

  if (channelDeleted) {
    return (
      <ChatDesktopContainer data-test="chat-desktop-container">
        {!isOneToManySale ? (
          <HidableCameras
            allowsMultipleBuyers={storeConfigurations.allowsMultipleBuyers}
            visible={state.matches('secondary.showingParticipants') === true}
            toggleMicrophone={toggleMicrophone}
            toggleCamera={toggleCamera}
          />
        ) : (
          <TextError>{`${t('errorMessage.deletedChannel')}`}</TextError>
        )}
      </ChatDesktopContainer>
    )
  }

  return (
    <ChatDesktopContainer data-test="chat-desktop-container">
      {!isOneToManySale && (
        <HidableCameras
          allowsMultipleBuyers={storeConfigurations.allowsMultipleBuyers}
          visible={state.matches('secondary.showingParticipants') === true}
          toggleMicrophone={toggleMicrophone}
          toggleCamera={toggleCamera}
        />
      )}
      {state.matches('secondary.showingChat') === true && (
        <ChatModule isDesktop chatData={chatData} initChat={initChat} user={user} />
      )}
    </ChatDesktopContainer>
  )
}

ChatDesktop.propTypes = {
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
}
const HidableCameras = styled(LaptopCameras)`
  ${({ visible }) => (visible ? '' : 'display: none;')}
`

const ChatDesktopContainer = styled(PhoneContainer)`
  background: white;
  display: flex;
  flex-direction: column;
`
const TextError = styled.p`
  text-align: center;
`

export { ChatDesktop }
