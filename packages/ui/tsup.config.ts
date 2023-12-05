// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  clean: false,
  dts: true,
  format: ['cjs'],
  external: ['react'],
});
