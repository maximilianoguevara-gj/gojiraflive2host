import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectBuyerPoorNetwork } from '../../reducers/callSlice'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import PoorNetworkIcon from '../../../static/poor-network-icon.svg'
import { Button } from '../Kit/Buttons'
import { useTranslation } from 'react-i18next'

const PoorNetworkDialog = () => {
  const buyerPoorNetwork = useSelector(selectBuyerPoorNetwork)
  const { t } = useTranslation()
  const [buyerPoortNetworkAcknowledged, setBuyerPoorNetworkAcknowledged] = useState(false)
  const handleOnClick = ({ isConfirmed }) => {
    if (isConfirmed === true) {
      setBuyerPoorNetworkAcknowledged(true)
    } else {
      setBuyerPoorNetworkAcknowledged(false)
    }
  }
  return (
    <PoorNetworkDialog.Container
      data-test="close-call-container"
      open={buyerPoorNetwork && !buyerPoortNetworkAcknowledged}
    >
      <PoorNetworkDialog.Icon data-test="poor-network-icon">
        <img src={PoorNetworkIcon}></img>
      </PoorNetworkDialog.Icon>
      <PoorNetworkDialog.Content data-test="poor-network-content">
        {t('dialogs.buyerPoorNetworkDescription')}
      </PoorNetworkDialog.Content>
      <PoorNetworkDialog.Actions data-test="poor-network-actions">
        <PoorNetworkDialog.Confirm
          variant="contained"
          data-test="poor-network-confirm"
          onClick={() => handleOnClick({ isConfirmed: true })}
        >
          {t('dialogs.acceptButton').toUpperCase()}
        </PoorNetworkDialog.Confirm>
      </PoorNetworkDialog.Actions>
    </PoorNetworkDialog.Container>
  )
}

PoorNetworkDialog.Icon = styled.span`
  text-align: center;
  margin-top: 2rem;
`
PoorNetworkDialog.Container = styled(Dialog)`
  .MuiDialog-paper {
    font-size: 0.9em;
    align-items: center;
    max-width: 17rem;
  }
`
PoorNetworkDialog.Content = styled(DialogContent)`
  text-align: center;
  font-weight: 600;
  line-height: 1rem;
  &.MuiDialogContent-root {
    padding: 1.188rem 1.5rem 1.188rem 1.5rem;
  }
`
PoorNetworkDialog.Actions = styled(DialogActions)`
  flex-direction: column;
  padding-bottom: 1rem;
`
PoorNetworkDialog.Confirm = styled(Button)`
  margin-bottom: 1rem;
`

export { PoorNetworkDialog }
