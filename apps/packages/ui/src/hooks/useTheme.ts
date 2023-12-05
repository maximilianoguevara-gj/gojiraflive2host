import { useStore } from 'state';
import { Theme } from '../Kit/theme';
import { defaultTheme } from '../utils';

interface IUseTheme {
  theme: Theme
}

export const useTheme = (): IUseTheme => {
  const store = useStore((storeState: any) => storeState.store);
  const storeIsUndefined = store === undefined;

  return {
    theme: storeIsUndefined ? defaultTheme : store.storeConfigurations?.storeCustomization?.theme,
  };
};
