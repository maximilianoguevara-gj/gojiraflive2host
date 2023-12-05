import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import {
  hideOnCloseMessageCall,
  selectOnCloseMessageCall,
  setShowStoreInfo,
} from '../../reducers/uiSlice'
import { Button } from '../Kit/Buttons'
import { Label } from '../Kit/Label'
import { useTranslation } from 'react-i18next'
import { CallStates } from '../../constants/callStates'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'
import { useNavigate } from 'react-router-dom'
import { selectCurrentStore } from '../../reducers/storeSlice'

const CloseCallDialog = ({ onClose }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const closeCallMessageIsVisible = useSelector(selectOnCloseMessageCall)
  const store = useSelector(selectCurrentStore)

  const handleOnClick = ({ isConfirmed }) => {
    gaEventTracker('InCall', 'close-call-cancel-button')
    matomoTrackEvent('InCall', 'close-call-cancel-button')
    dispatch(hideOnCloseMessageCall())

    if (isConfirmed) {
      dispatch(setShowStoreInfo({ showStoreInfo: false }))
      onClose()
      navigate(`/store/${store.id}/form`)
    } else {
      history.pushState(CallStates.IN_CALL_STATE, CallStates.IN_CALL_STATE)
    }
  }

  return (
    <CloseCallDialog.Container data-test="close-call-container" open={closeCallMessageIsVisible}>
      <CloseCallDialog.Content data-test="close-call-content">
        {t('dialogs.content')}
      </CloseCallDialog.Content>
      <CloseCallDialog.Actions data-test="close-call-actions">
        <CloseCallDialog.Confirm
          variant="contained"
          id="close-call-confirm-button"
          data-test="close-call-confirm"
          onClick={() => handleOnClick({ isConfirmed: true })}
        >
          {t('dialogs.confirm').toUpperCase()}
        </CloseCallDialog.Confirm>
        <CloseCallDialog.Cancel
          id="close-call-cancel-button"
          data-test="close-call-cancel"
          style={{ marginLeft: 0 }}
          onClick={() => handleOnClick({ isConfirmed: false })}
        >
          {t('dialogs.cancel')}
        </CloseCallDialog.Cancel>
      </CloseCallDialog.Actions>
    </CloseCallDialog.Container>
  )
}

CloseCallDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
}

CloseCallDialog.Container = styled(Dialog)`
  .MuiDialog-paper {
    font-size: 0.9em;
    align-items: center;
    max-width: 271px;
    border-radius: 8px;
  }
`
CloseCallDialog.Content = styled(DialogContent)`
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.2px;

  &.MuiDialogContent-root {
    padding: 2.5em 1.7em 1em 1.7em;
  }
`
CloseCallDialog.Actions = styled(DialogActions)`
  flex-direction: column;
  padding-bottom: 3em;
`
CloseCallDialog.Confirm = styled(Button)`
  margin-bottom: 2.2em;
  width: 139px;
`
CloseCallDialog.Cancel = styled(Label)`
  font-weight: 500;
  font-size: 10px;
  line-height: 1px;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
`

export { CloseCallDialog }
