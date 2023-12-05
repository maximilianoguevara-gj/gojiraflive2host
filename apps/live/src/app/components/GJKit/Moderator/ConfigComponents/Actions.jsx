import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ActionsItem } from './ActionsItem'
import { useSelector } from 'react-redux'
import {
  selectDisplayFinishEventCountdownstate,
  selectDisplayPopUpState,
  selectDisplayStartEventCountdownstate,
} from '../../../../reducers/callSlice'
import { selectDisableStartEvent } from '../../../../reducers/uiSlice'
import { useTranslation } from 'react-i18next'
import { selectCurrentStore } from '../../../../reducers/storeSlice'

export const Actions = ({ dispatchFinishCountdown, dispatchStartCountdown, dispatchPopUp }) => {
  const { t } = useTranslation()
  const store = useSelector(selectCurrentStore)
  const { redirectToCall } = store.company.companyConfigurations
  const displayStartEventCountdown = useSelector(selectDisplayStartEventCountdownstate)
  const disableStartEvent = useSelector(selectDisableStartEvent)
  const displayFinishEventCountdown = useSelector(selectDisplayFinishEventCountdownstate)
  const displayPopUp = useSelector(selectDisplayPopUpState)

  return (
    <ActionsContainer>
      <ActionsItem
        text={t('dialogs.configurationActionItemOne')}
        onActive={dispatchPopUp}
        defaultState={displayPopUp}
      />
      {redirectToCall && (
        <ActionsItem
          disableByProp={disableStartEvent || displayFinishEventCountdown}
          text={t('dialogs.configurationActionItemTwo')}
          onActive={dispatchStartCountdown}
          defaultState={displayStartEventCountdown}
        />
      )}
      <ActionsItem
        disableByProp={displayStartEventCountdown}
        text={t('dialogs.configurationActionItemThree')}
        onActive={dispatchFinishCountdown}
        defaultState={displayFinishEventCountdown}
      />
    </ActionsContainer>
  )
}

const ActionsContainer = styled.div`
  background-color: white;
  width: 100%;
  padding: 0 25px;
  border-radius: 0 0 8px 8px;
  div + div {
    border-top: 1px solid rgba(0, 0, 0, 0.5);
  }
`
Actions.propTypes = {
  dispatchFinishCountdown: PropTypes.func.isRequired,
  dispatchStartCountdown: PropTypes.func.isRequired,
  dispatchPopUp: PropTypes.func.isRequired,
}
