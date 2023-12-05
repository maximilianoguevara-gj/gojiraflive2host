import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'
import { selectUiSize, UI_IS_TABLET } from '../../../reducers/uiSlice'
import { useSelector } from 'react-redux'
import { useDevices } from '@gojiraf/responsive'
import { isIOS } from 'react-device-detect'

const PhoneContainer = ({ children, ...props }) => {
  const [containerHeight, setContainerHeight] = useState(window.innerHeight)
  const { isMd } = useDevices()
  const StyledPhoneContainerRef = useRef(null)
  const uiSize = useSelector(selectUiSize)
  const isMobile = uiSize === UI_IS_TABLET

  useEffect(() => {
    const handleResize = () => {
      const browserBarHeight = window.outerHeight - window.innerHeight
      setContainerHeight(window.innerHeight - browserBarHeight)
    }
    if (StyledPhoneContainerRef.current) {
      if (isMobile) {
        StyledPhoneContainerRef.current.style.width = '100%'
        if (!isMd && !isIOS) {
          window.addEventListener('resize', handleResize)
          handleResize()
        }
      } else {
        StyledPhoneContainerRef.current.style.width =
          (StyledPhoneContainerRef.current.clientHeight * 9) / 16 + 'px'
      }
    }
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const inIframe = sessionStorage.getItem('inIframe') === 'true'

  return (
    <StyledPhoneContainer
      isMobile={isMobile}
      inIframe={inIframe}
      ref={StyledPhoneContainerRef}
      height={containerHeight}
      component="section"
      elevation={12}
      {...props}
    >
      {children}
    </StyledPhoneContainer>
  )
}

const StyledPhoneContainer = styled(Paper)`
  height: ${({ isMobile, height, inIframe }) =>
    inIframe && isMobile ? '100vh' : isMobile ? `${height}px` : '87.5vh'};
  margin: ${({ isMobile }) => (isMobile ? '0' : '1rem')};
  border-radius: ${({ isMobile }) => (isMobile ? '0' : '1rem')};
  transition: height 0.2s ease;
  position: relative;
  overflow: hidden;
`

PhoneContainer.propTypes = {
  children: PropTypes.any,
  isModeratorLogin: PropTypes.bool,
}

export { PhoneContainer }
