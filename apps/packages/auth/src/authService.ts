import to from 'await-to-js';
import { authClient } from './authClient';
import { useAuthStore } from './useAuthStore';
import { Role } from './userRoles';

interface ILogin {
  storeId: string
  userName?: string
  role?: Role
  pin?: string
}

export const login = async ({
  storeId, userName, role, pin,
}: ILogin) => {
  let response = null;
  if (role === 'MODERATOR' || role === 'COHOST') {
    response = await authClient.post('/login', {
      storeId,
      role,
      password: pin,
    });
    useAuthStore.getState().setModCreds({
      id: response.data.payload.user.uuid,
      role,
      name: userName,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      },
    });
  } else {
    response = await authClient.post('/login', {
      storeId,
    });
    useAuthStore.getState().setBuyerCreds({
      id: response.data.payload.user.uuid,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      },
    });
  }

  return response.data;
};

export interface IRefreshInput {
  storeId: string
}

export interface IRefreshOutput {
  accessToken: string
  refreshToken: string
}

export const refresh = async ({ storeId }: IRefreshInput): Promise<IRefreshOutput> => {
  const { tokens } = useAuthStore.getState().user;

  if (tokens === null) {
    throw Error('Cannot refresh without a refresh token.');
  }

  const { refreshToken } = tokens;
  const [error, refreshedTokens] = await to(authClient.post('/refresh', {
    refreshToken,
  }));

  if (error) {
    const response = await authClient.post('/login', {
      storeId,
    });

    const loginTokens = response.data;

    useAuthStore.getState().setBuyerCreds({
      id: loginTokens.data.payload.user.uuid,
      tokens: {
        accessToken: loginTokens.data.accessToken,
        refreshToken: loginTokens.data.refreshToken,
      },
    });

    return {
      accessToken: loginTokens.data.accessToken,
      refreshToken: loginTokens.data.refreshToken,
    };
  }

  const {
    payload: {
      user: {
        uuid,
      },
    },
    accessToken,
  } = refreshedTokens.data;

  useAuthStore.getState().setBuyerCreds({
    id: uuid,
    tokens: {
      accessToken,
      refreshToken: refreshedTokens.data.refreshToken,
    },
  });

  return {
    accessToken,
    refreshToken: refreshedTokens.data.refreshToken,
  };
};
