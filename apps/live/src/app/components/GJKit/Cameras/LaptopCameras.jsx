import { React, useEffect } from 'react'
import {
  BuyersContainer,
  StyledRemoteBuyer,
  StyledLocalBuyer,
  BuyersLayout,
  LaptopCamerasContainer,
  MicAndCamContainer,
} from './style'
import PropTypes from 'prop-types'
import { MainHeading } from '../../Kit/Headings/MainHeading'
import { useOtherBuyers } from '../../../hooks/useOtherBuyers'
import { Buyer } from './Buyer'
import { useSelector } from 'react-redux'
import {
  selectLocalCameraEnabled,
  selectLocalMicrophoneEnabled,
  selectUserCount,
  selectUsers,
  selectLastVideo,
} from '../../../reducers/callSlice'
import { MicrophoneWithBorder } from '../LocalMedia/Microphone'
import { CameraWithBorder } from '../LocalMedia/Camera'
import { useTranslation } from 'react-i18next'

const LaptopCameras = ({ allowsMultipleBuyers, toggleCamera, toggleMicrophone, ...props }) => {
  const { t } = useTranslation()
  const { setVideoHandler, setAudioHandler, usersFilter, usersList } = useOtherBuyers()
  const users = useSelector(selectUsers)
  const audioEnabled = useSelector(selectLocalMicrophoneEnabled)
  const videoEnabled = useSelector(selectLocalCameraEnabled)
  const usersCount = useSelector(selectUserCount)
  const lastVideo = useSelector(selectLastVideo)

  useEffect(() => {
    usersFilter(users, lastVideo)
  }, [users])

  return (
    <>
      <LaptopCamerasContainer data-test="cameras-container" {...props}>
        <MainHeading white={true} data-test="participants-text">
          {t('chat.mainHeading')}
          {allowsMultipleBuyers ? ` (${usersCount})` : ''}
        </MainHeading>
        <BuyersContainer>
          <BuyersLayout data-test="buyers-list">
            <StyledLocalBuyer
              localCameraFullWidth={users.length === 1}
              usersCount={usersCount}
              data-test="local-camera"
            />
            {usersList.map((user) => {
              return (
                <StyledRemoteBuyer key={user.rtcUID}>
                  <Buyer
                    user={user}
                    setVideoHandler={setVideoHandler}
                    setAudioHandler={setAudioHandler}
                    data-test="remote-camera"
                  />
                </StyledRemoteBuyer>
              )
            })}
          </BuyersLayout>
        </BuyersContainer>

        <MicAndCamContainer data-test="mic-cam-container">
          <MicrophoneWithBorder
            audioEnabled={audioEnabled}
            data-test="microphone"
            toggleMicrophone={toggleMicrophone}
          />
          <CameraWithBorder
            videoEnabled={videoEnabled}
            data-test="camera"
            toggleCamera={toggleCamera}
          />
        </MicAndCamContainer>
      </LaptopCamerasContainer>
    </>
  )
}

LaptopCameras.propTypes = {
  allowsMultipleBuyers: PropTypes.bool,
  toggleMicrophone: PropTypes.func,
  toggleCamera: PropTypes.func,
}

export { LaptopCameras }
