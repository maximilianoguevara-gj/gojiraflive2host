import { CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export const DeepLink = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(`/.well-known/assetlinks.json`)
  }, [])

  return (
    <Container>
      <CircularProgress color="inherit" />
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
