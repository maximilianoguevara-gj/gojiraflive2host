import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CalendarSVG from '../../../static/calendar.svg'

const EventDate = ({ children, onClick }) => {
  return (
    <DateContainer onClick={onClick}>
      <img src={CalendarSVG}></img>
      <StyledText>{children}</StyledText>
    </DateContainer>
  )
}

const DateContainer = styled.button`
  display: flex;
  gap: 10px;
  border-radius: 1.25rem;
  border: none;
  background-color: #f93700;
  padding: 8px 25px;
  color: #ffffff;
  margin: 10px 0;
  .atcb-list-item-close {
    display: none !important;
  }
`

const StyledText = styled.span`
  font-weight: 600;
  font-size: 0.75rem;
  align-self: center;
`

EventDate.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

export { EventDate }
