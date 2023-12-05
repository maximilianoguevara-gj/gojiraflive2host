import styled from 'styled-components'
import { Input } from '../components/Kit/Input'
import { UI_IS_TABLET } from '../reducers/uiSlice'

export const TitleAndSubtitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: ${({ uiSize }) => (uiSize === UI_IS_TABLET ? '3rem' : '6rem')};
`
export const Title = styled.h1`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 1.55rem;
  line-height: 20px;
  color: black;
  margin-bottom: 0.25em;
  span {
    color: #f93700;
  }
`
export const Subtitle = styled.h2`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  text-align: center;
  color: #000000;
  margin: 0;
`

export const NameInput = styled(Input)`
  z-index: 1;
  margin-top: 0.5rem;
  width: 100%;
  .MuiFormLabel-colorSecondary.Mui-focused {
    color: #000000;
  }

  .MuiInput-colorSecondary.MuiInput-underline:after {
    border-bottom-color: #000000;
  }
`
export const PinInput = styled(Input)`
  z-index: 1;
  width: 100%;
  padding: 0.188rem;

  .MuiInputBase-root {
    color: #888888;
    letter-spacing: 2px;
    font-size: ${({ uiSize }) => (uiSize === UI_IS_TABLET ? 'inherit' : '0.8rem')};
  }
  .MuiIconButton-edgeEnd {
    margin-right: ${({ uiSize }) => (uiSize === UI_IS_TABLET ? '0' : '-8px')};
    padding: ${({ uiSize }) => (uiSize === UI_IS_TABLET ? '0' : '4px')};
  }
  .MuiInputBase-input {
    padding: ${({ uiSize }) => (uiSize === UI_IS_TABLET ? '0.6rem 0' : '0.8rem 0')};
  }
`
export const StyledImage = styled.img`
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 50%;
  width: 50%;
`
