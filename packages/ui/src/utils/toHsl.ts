import Color from 'color';

export function toHsl(hex: string) {
  const [h, s, l] = Color(hex).hsl().array().map((value) => Math.round(value));

  return `${h} ${s}% ${l}%`;
}
