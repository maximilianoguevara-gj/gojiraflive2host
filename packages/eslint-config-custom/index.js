module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    'turbo'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js','.jsx','.ts', '.tsx'] }],
    'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
    'import/prefer-default-export': "off",
    'react/jsx-props-no-spreading': "off"
  },
};
