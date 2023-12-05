import styled from 'styled-components'
import { CircularProgress, Paper, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export const BottomActions = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
`

export const Form = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  overflow: auto;
`

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`

export const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.4em;
`

export const SummaryTotal = styled(SummaryLine)`
  padding-top: 0.5em;
  border-top: 1px solid black;
  font-weight: 600;
  margin-bottom: 1rem;
`

export const Text = styled.p`
  font-size: 0.8rem;
  color: rgb(75, 75, 75);
  line-height: 1em;
  margin-bottom: 1rem;
`

export const LabelCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 1em;
  color: rgb(75, 75, 75);
  font-size: 0.8rem;
  margin-bottom: 1rem;
`

export const BoldText = styled.span`
  font-weight: 600;
`

export const Row = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const StyledAutoComplete = styled(Autocomplete)`
  .MuiAutocomplete-root {
    font-size: 0.75rem;
  }
`
export const StyledPaper = styled(Paper)`
  width: 12.5rem;
`

export const StyledTextField = styled(TextField)`
  .MuiFormLabel-root {
    font-size: 0.75rem;
  }
  .MuiInputBase-input {
    font-size: 0.75rem;
  }
`
export const SelectInputsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`
export const StyledSpinner = styled(CircularProgress)`
  margin: 1rem;
`
