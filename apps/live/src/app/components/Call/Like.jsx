import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player'
import heart from '../../../static/like-effect.json'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsLikeAnimationVisible, setIsLikeAnimationVisible } from '../../reducers/uiSlice'
import styled from 'styled-components'

const LikeContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 0;
  pointer-events: none;
`

const Like = () => {
  const showLike = useSelector(selectIsLikeAnimationVisible)
  const dispatch = useDispatch()

  const handleEvents = (event) => {
    if (event === 'complete') {
      dispatch(setIsLikeAnimationVisible({ isLikeAnimationVisible: false }))
    }
  }

  return (
    <LikeContainer data-test="like-container">
      {showLike === true ? (
        <Player
          autoplay={true}
          loop={false}
          src={heart}
          style={{ transform: 'scale(10) translateY(-50%)' }}
          onEvent={handleEvents}
        ></Player>
      ) : null}
    </LikeContainer>
  )
}

export { Like }
