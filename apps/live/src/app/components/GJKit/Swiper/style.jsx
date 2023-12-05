import styled, { css } from 'styled-components'
import { Swiper } from 'swiper/react'

export const StyledSwiper = styled(Swiper)`
  .swiper-button-prev,
  .swiper-button-next {
    width: 0;
    color: #fff;
    ${({ isTotem }) =>
      !isTotem &&
      css`
        --swiper-navigation-size: 25px;
      `}
    text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.3);
  }

  .swiper-button-disabled {
    display: none;
  }
`

export const Container = styled.div`
  padding: 1rem;
`
