import axios from 'axios';
import { useAuthStore } from '@gojiraf/auth';

const {
  REACT_APP_CORE_URL,
} = process.env;

const coreClient = axios.create({
  baseURL: `${REACT_APP_CORE_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

coreClient.interceptors.request.use(
  async (config) => {
    const { tokens } = useAuthStore.getState().user;
    if (tokens !== null) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export {
  coreClient,
};
