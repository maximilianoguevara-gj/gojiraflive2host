import React from 'react'
import PropTypes from 'prop-types'
import { Container, StyledSwiper } from './style'
import { SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { ProductImage, usePDP } from 'ui'
import { useViews } from 'state'
import { useGoogleAnalytics, useElasticEventTracker, useMatomoAnalytics } from '@gojiraf/analytics'
import UtmUtils from '../../../utils/utmUtils'
import qs from 'qs'
import { useUtm } from '@gojiraf/useutm'

const GJSwiper = ({ products }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const { send: sendViews } = useViews()
  const { send: sendPDP } = usePDP()
  const queryParams = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const { utm_medium } = UtmUtils.getUtmObject(queryParams)
  const { isTotemDevice } = useUtm(utm_medium)
  const { sendEventPostToElastic } = useElasticEventTracker()

  if (products.length === 0) {
    return null
  }

  const setProduct = (product) => {
    gaEventTracker('InCall > Products', `click-product-detail-m [${product.name}]`)
    matomoTrackEvent('InCall > Products', `click-product-detail-m [${product.name}]`)
    sendEventPostToElastic('products', `click-product-detail`, `${product.name}`)
    sendPDP({
      type: 'SET_PRODUCT',
      productId: product.id,
    })

    sendViews({
      type: 'SHOW_PDP',
    })
  }

  return (
    <Container>
      <StyledSwiper
        modules={[Navigation]}
        navigation
        slidesPerView={3.75}
        isTotem={isTotemDevice}
        breakpoints={{
          300: { slidesPerView: 2.9 },
          360: { slidesPerView: 3.5 },
          390: { slidesPerView: 3.2 },
          412: { slidesPerView: 3.75 },
          460: { slidesPerView: 4.5 },
        }}
      >
        {products.map((product) => {
          return (
            <SwiperSlide key={product.id}>
              <ProductImage
                url={product.images[0].imageUrl}
                alt={product.images[0].alt}
                onClick={() => setProduct(product)}
              />
            </SwiperSlide>
          )
        })}
      </StyledSwiper>
    </Container>
  )
}

GJSwiper.propTypes = {
  products: PropTypes.array.isRequired,
}

export { GJSwiper }
