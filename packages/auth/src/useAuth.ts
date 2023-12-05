import { useAuthStore } from './useAuthStore';

export const useAuth = () => {
  const state = useAuthStore((currentState) => currentState);
  return { ...state };
};
