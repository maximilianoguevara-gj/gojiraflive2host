import React, { useRef, useEffect } from 'react'
import { StyledLocalBuyerMobile, StyledBuyer, StyledButton, StyledSeller } from './style'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import styled from 'styled-components'
import { useOtherBuyers } from '../../../hooks/useOtherBuyers'
import { selectLocalCameraEnabled, selectUsers, selectLastVideo } from '../../../reducers/callSlice'
import { selectMainVideo, setChangeMainVideo } from '../../../reducers/uiSlice'
import { useDispatch } from 'react-redux'
import { selectSellerVideoTrack } from '../../../reducers/storeSlice'

const Cameras = ({ visible, ...props }) => {
  const { setVideoHandler, setAudioHandler, usersFilter, usersList } = useOtherBuyers()
  const swiper = useRef()
  const users = useSelector(selectUsers)
  const mainVideo = useSelector(selectMainVideo)
  const dispatch = useDispatch()
  const sellerVideoTrack = useSelector(selectSellerVideoTrack)
  const localCameraEnabled = useSelector(selectLocalCameraEnabled)
  const lastVideo = useSelector(selectLastVideo)

  useEffect(() => {
    if (visible) swiper.current?.swiper.update()
  }, [visible])

  useEffect(() => {
    usersFilter(users, lastVideo)
  }, [users])

  const handleOnClick = () => {
    if (mainVideo && localCameraEnabled) {
      dispatch(setChangeMainVideo({ changeMainVideo: false }))
    } else {
      dispatch(setChangeMainVideo({ changeMainVideo: true }))
    }
  }

  return (
    <>
      {props.allowsMultipleBuyers ? (
        <SwiperWrapper {...props}>
          <Swiper
            modules={[Navigation]}
            navigation
            ref={swiper}
            slidesPerView={3.75}
            breakpoints={{
              300: { slidesPerView: 2.9 },
              360: { slidesPerView: 3.5 },
              390: { slidesPerView: 3.2 },
              412: { slidesPerView: 3.75 },
              460: { slidesPerView: 4.5 },
            }}
            data-test="camera-swiper"
          >
            <SwiperSlide>
              <StyledLocalBuyerMobile data-test="local-camera" />
            </SwiperSlide>

            {usersList.map((user) => {
              return (
                <SwiperSlide key={user.rtcUID}>
                  <StyledBuyer
                    user={user}
                    setVideoHandler={setVideoHandler}
                    setAudioHandler={setAudioHandler}
                    data-test="remote-camera"
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </SwiperWrapper>
      ) : mainVideo ? (
        <div {...props}>
          <StyledButton onClick={handleOnClick}>
            <StyledLocalBuyerMobile data-test="local-camera" />
          </StyledButton>
        </div>
      ) : (
        <div {...props}>
          <StyledButton onClick={handleOnClick}>
            <StyledSeller video={sellerVideoTrack} data-test="seller-camera" />
          </StyledButton>
        </div>
      )}
    </>
  )
}

Cameras.propTypes = {
  visible: PropTypes.bool,
  allowsMultipleBuyers: PropTypes.bool,
}

const SwiperWrapper = styled.div`
  padding: 1rem;
`

export { Cameras }
