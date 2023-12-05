import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Dialog, Typography, Button, DialogContent } from '@material-ui/core'
import { Button as StyledButton } from '../Kit/Buttons'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../../styles/dialog.styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  leaveCall,
  setTermsAndConditionsAccepted,
  selectTermsAndConditionsAccepted,
} from '../../reducers/callSlice'
import { useLocalMicrophone } from '../../hooks/useLocalMicrophone'
import { useLocalCamera } from '../../hooks/useLocalCamera'
import { ButtonContainer, Link } from './style'
import { EventLogs } from '../../constants/eventLogs'
import { TermsAndConditionsIcon } from '../../assets/svg/TermsAndConditionsIcon'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const useStyles = makeStyles((theme) => styles(theme))

export const TermsAndConditions = ({ customTermsAndConditions, onCallFinished }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()
  const termsAndConditionsAccepted = useSelector(selectTermsAndConditionsAccepted)
  const { closeMicrophone } = useLocalMicrophone()
  const { closeCamera } = useLocalCamera()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const classes = useStyles()

  const acceptTermsAndConditions = () => {
    gaEventTracker('Terminos y Condiciones Evento', 'button-accept-terms-and-conditions')
    matomoTrackEvent('Terminos y Condiciones Evento', 'button-accept-terms-and-conditions')
    dispatch(setTermsAndConditionsAccepted(true))
  }
  const rejectTermsAndConditions = () => {
    gaEventTracker('Terminos y Condiciones Evento', 'button-exit-the-event-terms-and-conditions')
    matomoTrackEvent('Terminos y Condiciones Evento', 'button-exit-the-event-terms-and-conditions')
    closeMicrophone()
    closeCamera()
    dispatch(leaveCall())
    onCallFinished(EventLogs.BUYER_REJECTED_TERMS_AND_CONDITIONS)
  }

  const handleClickReadTermsAndConditions = () => {
    gaEventTracker('Terminos y Condiciones Evento', 'read-terms-and-conditions')
    matomoTrackEvent('Terminos y Condiciones Evento', 'read-terms-and-conditions')
    dispatch(setTermsAndConditionsAccepted(true))
  }

  const getTermsAndConditionsWithLink = (text) => {
    const textToLink = t('dialogs.termsAndConditionsBrTitle')
    const [firstPieceOfText, secondPieceOfText] = text.split(textToLink)

    return (
      <div>
        {firstPieceOfText}
        <Link
          href={
            customTermsAndConditions.active
              ? customTermsAndConditions.url
              : 'https://gojiraf.com/terms.php'
          }
          target="_blank"
          rel="noreferrer"
          onClick={handleClickReadTermsAndConditions}
          id="read-terms-and-conditions-br"
          data-test="read-terms-and-conditions-br"
        >
          {textToLink}
        </Link>
        {secondPieceOfText}
      </div>
    )
  }
  return (
    <StyledDialog
      BackdropProps={{ style: { backgroundColor: 'transparent', backdropFilter: 'blur(4px)' } }}
      aria-labelledby="simple-dialog-title"
      open={!termsAndConditionsAccepted}
      id="terms-and-conditions-br"
      data-test="terms-and-conditions"
    >
      <StyledTermIcon />
      <StyledTypography variant="h6" color="primary" align="center">
        {t('dialogs.termsAndConditionsBrTitle')}
      </StyledTypography>
      <StyledTypography variant="subtitle2" color="primary" align="center">
        {getTermsAndConditionsWithLink(t('dialogs.termsAndConditionsBr'))}
      </StyledTypography>
      <DialogContent className={classes.dialog__actions}>
        <ButtonContainer>
          <StyledButton
            variant="contained"
            onClick={acceptTermsAndConditions}
            id="accept-terms-and-conditions-br"
            data-test="accept-terms-and-conditions-br"
          >
            {t('dialogs.acceptButton').toUpperCase()}
          </StyledButton>
          <StyledCloseButton
            onClick={rejectTermsAndConditions}
            id="reject-terms-and-conditions-br"
            data-test="reject-terms-and-conditions-br"
          >
            {t('dialogs.leaveButton').toUpperCase()}
          </StyledCloseButton>
        </ButtonContainer>
      </DialogContent>
    </StyledDialog>
  )
}

TermsAndConditions.propTypes = {
  onCallFinished: PropTypes.func.isRequired,
  customTermsAndConditions: PropTypes.object,
}

export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    font-size: 12px;
    font-weight: 500;
    align-items: center;
    max-width: 16.938rem;
    max-height: 16.25rem;
    gap: 0.5rem;
    padding: ${({ padding }) => padding || '0.938rem'};
    border-radius: 8px;
    overflow: hidden;
  }
`
const StyledTermIcon = styled(TermsAndConditionsIcon)`
  margin-top: 11px;
`
export const StyledTypography = styled(Typography)`
  font-size: ${({ fontSize }) => fontSize || '1rem'};
  line-height: 16px;
  letter-spacing: 0.2px;
`
const StyledCloseButton = styled(Button)`
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 2px;
`
