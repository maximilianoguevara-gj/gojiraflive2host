import Color from 'color';
import { toHsl } from './toHsl';

export function darken(hex: string) {
  const darkenHex = Color(hex).darken(0.25).string();

  return toHsl(darkenHex);
}
