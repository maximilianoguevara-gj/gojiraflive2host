import axios from 'axios';

const {
  REACT_APP_AUTH_URL,
} = process.env;

export const authClient = axios.create({
  baseURL: REACT_APP_AUTH_URL,
});
