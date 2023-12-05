import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Button } from '../Kit/Buttons'
import { MdiUsers } from '../../assets/svg/MdiUsers'
import { MainHeading } from './style'

export const AskJoinChat = ({ handleClick }) => {
  const { t } = useTranslation()
  return (
    <>
      <MainHeading textAlign="center" fontSize="1.125rem">
        {t('chat.askJoinButton')}
      </MainHeading>
      <Button
        display="flex"
        padding="0.5em 2.5em"
        textTransform="none"
        letterSpacing="0.063rem"
        variant="outlined"
        onClick={handleClick}
      >
        <MdiUsers />
        {t('chat.join')}
      </Button>
    </>
  )
}

AskJoinChat.propTypes = {
  handleClick: PropTypes.func.isRequired,
}
