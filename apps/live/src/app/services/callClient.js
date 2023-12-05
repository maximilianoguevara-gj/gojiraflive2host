import axios from 'axios'

const { REACT_APP_CALL_SERVICE = '' } = process.env

const instance = axios.create({
  baseURL: REACT_APP_CALL_SERVICE,
})

export const http = instance
