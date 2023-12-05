import styled from 'styled-components'
import { LocalBuyer } from './LocalBuyer'
import { Buyer } from './Buyer'
import { SellerCamera } from './SellerCamera'
import { UserBox } from './UserBox'
import { device } from '../../../constants/devices'

// Audio
export const AudioBorder = styled.div`
  border: ${({ isSpeaking }) => (isSpeaking ? '0.3rem solid white' : '0.094rem solid white')};
  border-radius: ${({ isMobile }) => (isMobile ? '0.5rem' : '')};
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`
export const MuteIndicator = styled.div`
  border-radius: 100%;
  background-color: white;
  margin: 0.25rem;
  height: 1.5rem;
  width: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${device.laptop} {
    height: 1.75rem;
    width: 1.75rem;
  }
`

// Buyer
export const StyledUserBox = styled(UserBox)`
  @media ${device.laptop} {
    height: 100%;
  }
`

export const CoHostContainer = styled.div`
  height: ${({ activePIP }) => (activePIP ? '100%' : '50%')};
`
export const PopUpCohostVideoDrag = styled.div`
  position: fixed;
  top: ${({ isMobile }) => (isMobile ? '50%' : '60%')};
  left: ${({ isMobile }) => (isMobile ? '65%' : '53%')};
  transform: translate(-50%, -50%);
  display: block;
  width: ${({ isMobile }) => (isMobile ? '30%' : '8%')};
  height: ${({ isMobile }) => (isMobile ? '25%' : '25%')};
  background-color: white;
  z-index: 100000;
  border-radius: 10px;
  overflow: hidden;
  border: none;
  margin-bottom: 0;
  margin-left: 0;
  cursor: grab;
`

// Cameras
export const StyledBuyer = styled(Buyer)`
  width: 5rem;
  height: 5rem;
  position: relative;

  @media (min-width: 300px) and (max-width: 360px) {
    width: 4.5rem;
    height: 4.5rem;
  }
`
export const StyledSeller = styled(SellerCamera)`
  width: 5rem;
  height: 5rem;
  position: relative;

  @media (min-width: 300px) and (max-width: 360px) {
    width: 4.5rem;
    height: 4.5rem;
  }
`
export const StyledLocalBuyerMobile = styled(LocalBuyer)`
  width: 5rem;
  height: 5rem;
  position: relative;
  z-index: 1;

  @media (min-width: 300px) and (max-width: 360px) {
    width: 4.5rem;
    height: 4.5rem;
  }
`
export const StyledButton = styled.button`
  border: none;
  padding: 0;
  border-radius: 10%;
`

// LaptopCameras
export const BuyersContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-shadow: 5px 5px 11px -3px rgba(0, 0, 0, 0.5);
`
export const StyledRemoteBuyer = styled.div`
  position: relative;
  flex: 1;
  flex-basis: 50%;
  top: 0;
  min-height: 33.333%;
`
export const StyledLocalBuyer = styled(LocalBuyer)`
  position: relative;
  flex: 1;
  flex-basis: ${({ localCameraFullWidth }) => (localCameraFullWidth ? '100%' : '50%')};
  top: 0;
  min-height: 33.333%;
`
export const BuyersLayout = styled.div`
  height: 100%;
  display: flex;
  overflow: auto;
  flex-wrap: wrap;
  -ms-overflow-style: none;
`
export const LaptopCamerasContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  gap: 1rem;
  height: 100%;
  width: 100%;
`
export const MicAndCamContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

// UserBox
export const ContainerUserBox = styled.div``

export const UserNameContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  right: 0;
  font-weight: 900;
  font-size: ${({ isMobile }) => (isMobile ? '0.75em' : '1em')};
  padding: ${({ isMobile }) => (isMobile ? '0.25em' : '0 1em 1em 0')};
  color: white;
`
export const UserName = styled.span`
  width: ${({ isMobile }) => (isMobile ? '4em' : '')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: end;
  padding-right: ${({ isMobile }) => (isMobile ? '5px' : '')};
`

// Video
export const Container = styled.div`
  background-color: #e5e5e5;
  border-radius: ${({ isMobile }) => (isMobile ? '0.5rem' : '')};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-shadow: ${({ isMobile }) =>
    isMobile
      ? 'inset 0px -20px 9px 0px rgba(0, 0, 0, 0.3)'
      : 'inset 0px -52px 30px -18px rgba(0, 0, 0, 0.5)'};

  div {
    border-radius: ${({ isMobile, videoIsOn }) => (isMobile && videoIsOn ? '0.5rem' : '')};
  }
`
export const StyledVideocamOff = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: white;
  box-shadow: ${({ isMobile }) => (isMobile ? '0px 2px 3px 0px rgba(0,0,0,0.3)' : '')};

  @media (max-width: 424px) {
    width: 1.8rem;
    height: 1.8rem;
  }
  @media ${device.mobile} {
    width: 1.9rem;
    height: 1.9rem;
  }
  @media ${device.laptop} {
    width: ${({ usersCount }) => (usersCount == 1 ? '6rem' : '3.5rem')};
    height: ${({ usersCount }) => (usersCount == 1 ? '6rem' : '3.5rem')};
  }
  @media ${device.laptopLarge} {
    width: ${({ usersCount }) => (usersCount == 1 ? '7rem' : '4.5rem')};
    height: ${({ usersCount }) => (usersCount == 1 ? '7rem' : '4.5rem')};
  }
`
export const UsersNames = styled.span`
  font-size: ${({ isMobile }) => (isMobile ? '0.7rem' : '1.7rem')};
  font-weight: 600;
  color: #9a9a9a;
  padding: ${({ isMobile }) => (isMobile ? '0' : '0 6px')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
