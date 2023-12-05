/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { ErrorOutline } from '@material-ui/icons'
import { StoreKeys } from '../../constants/storeKeys'
import { selectCurrentStore } from '../../reducers/storeSlice'
import StorageService from '../../../storage'
import StoreUtils from '../../utils/storeUtils'
import { PhoneContainer } from '../Kit/Container'
import { AlternateHeading } from '../Kit/Headings/AlternateHeading'
import { GJLogo } from '../GJKit/GJLogo'
import { Button } from '../Kit/Buttons'
import { useTranslation } from 'react-i18next'
import { UI_IS_TABLET, selectUiSize } from '../../reducers/uiSlice'

const Link = styled(RouterLink)`
  text-align: center;
`

const Container = styled.div`
  height: 100vh;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FlexPhoneContainer = styled(PhoneContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url('/assets/calling.svg');
  background-size: cover;
  text-align: center;
  padding: 2rem;
  color: white;
  align-items: center;
  gap: 1.5rem;

  svg {
    font-size: 3rem;
  }

  > *:first-child {
    margin-top: auto;
  }

  img {
    margin-top: auto;
  }
`

const CheckoutFinishDialog = ({ success, pending }) => {
  const { t } = useTranslation()
  const store = useSelector(selectCurrentStore)
  const { backgroundUrlMobile = null, backgroundUrl } = store
  const [queryParams, setQueryParams] = useState('?')
  const uiSize = useSelector(selectUiSize)
  const isMobile = uiSize === UI_IS_TABLET

  useEffect(() => {
    setQueryParams(StorageService.getValue(StoreKeys.INITIAL_QUERY_PARAMS) || '?')
  }, [])

  return (
    <Container
      backgroundImage={StoreUtils.getBackgroundImage({
        isMobile,
        backgroundUrlMobile,
        backgroundUrl,
      })}>
      <FlexPhoneContainer>
        {success ? (
          <AlternateHeading>
            {t('dialogs.alternateHeadingSuccess')}
            {store.name}
          </AlternateHeading>
        ) : (
          <>
            <ErrorOutline fontSize="large" />
            <AlternateHeading>
              {pending ? t('dialogs.alternateHeadingPending') : t('dialogs.alternateHeadingError')}
            </AlternateHeading>
          </>
        )}
        <Button to={`/store${queryParams}`} component={Link} color="secondary" variant="outlined">
          {t('dialogs.goBackButton')}
        </Button>
        <GJLogo />
      </FlexPhoneContainer>
    </Container>
  )
}

export default CheckoutFinishDialog
CheckoutFinishDialog.propTypes = {
  success: PropTypes.bool.isRequired,
  pending: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
}

CheckoutFinishDialog.defaultProps = {
  success: false,
  pending: false,
}
