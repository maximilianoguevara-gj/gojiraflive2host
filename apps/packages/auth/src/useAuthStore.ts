import dayjs from 'dayjs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DefaultBuyerName } from './buyerNames';
import { config } from './config';
import { Role } from './userRoles';

const {
  BAN_TIME_NUMBER,
  BAN_TIME_UNIT,
} = config;

export interface ISetBuyerCredsPayload {
  id: AuthState['user']['id']
  tokens: AuthState['user']['tokens']
}

export interface ISetModCredsPayload extends ISetBuyerCredsPayload {
  name?: AuthState['user']['name']
  role: AuthState['user']['role']
}

interface AuthState {
  user: {
    id: string
    name: string
    role: Role
    tokens: {
      accessToken: string | null
      refreshToken: string | null
    } | null,
    bans: {
      [storeId: string]: number
    }
    mutes: {
      [storeId: string]: number
    }
  },
  userForBan: {
    id: string | null,
    name: string | null,
  },
  userForMute: {
    id: string | null,
    name: string | null,
    channelId: string | null,
  },
  addBan: (storeId: string) => void
  addMute: (storeId: string) => void
  deleteBan: (storeId: string) => void
  deleteMute: (storeId: string) => void
  setBuyerCreds: (creds: ISetBuyerCredsPayload) => void
  setModCreds: (creds: ISetModCredsPayload) => void
  setId: (id: AuthState['user']['id']) => void
  setUsername: (username: AuthState['user']['name']) => void
  setRole: (role: AuthState['user']['role']) => void
  setUserForBan: (data: AuthState['userForBan']) => void
  setUserForMute: (data: AuthState['userForMute']) => void
}

export const useAuthStore = create<AuthState>()(
  persist((set) => ({
    user: {
      id: '',
      name: DefaultBuyerName,
      role: 'BUYER',
      tokens: null,
      bans: {},
      mutes: {},
    },
    userForBan: {
      id: null,
      name: '',
    },
    userForMute: {
      id: null,
      name: '',
      channelId: null,
    },
    addBan: (storeId) => set((state) => {
      const banTime = dayjs()
        .add(Number(BAN_TIME_NUMBER), BAN_TIME_UNIT)
        .valueOf();

      const { bans } = state.user;

      bans[storeId] = banTime;

      return {
        user: {
          ...state.user,
          bans,
        },
      };
    }),
    deleteBan: (storeId) => set((state) => {
      const { bans } = state.user;
      delete bans[storeId];

      return {
        user: {
          ...state.user,
          bans,
        },
      };
    }),
    addMute: (storeId) => set((state) => {
      const muteTime = dayjs()
        .add(Number(BAN_TIME_NUMBER), BAN_TIME_UNIT)
        .valueOf();

      const { mutes } = state.user;

      mutes[storeId] = muteTime;

      return {
        user: {
          ...state.user,
          mutes,
        },
      };
    }),
    deleteMute: (storeId) => set((state) => {
      const { mutes } = state.user;
      delete mutes[storeId];

      return {
        user: {
          ...state.user,
          mutes,
        },
      };
    }),
    setBuyerCreds: (newUser) => set((state) => ({
      user: {
        ...state.user,
        ...newUser,
      },
    })),
    setModCreds: (newUser) => set((state) => ({
      user: {
        ...state.user,
        ...newUser,
      },
    })),
    setId: (id) => set((state) => ({
      user: {
        ...state.user,
        id,
      },
    })),
    setUsername: (username) => set((state) => ({
      user: {
        ...state.user,
        name: username,
      },
    })),
    setRole: (role) => set((state) => ({
      user: {
        ...state.user,
        role,
      },
    })),
    setUserForBan: (data) => set(() => ({
      userForBan: data,
    })),
    setUserForMute: (data) => set(() => ({
      userForMute: data,
    })),
  }), {
    name: 'auth',
    partialize: (state) => ({
      user: {
        bans: state.user.bans,
        mutes: state.user.mutes,
        name: DefaultBuyerName,
        role: 'BUYER',
      },
    }),
  }),
);
