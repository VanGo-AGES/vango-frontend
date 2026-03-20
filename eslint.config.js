const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier/recommended');

module.exports = [
  ...expo,
  prettier,
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    ignores: ['node_modules/**', '.expo/**', 'scripts/**', 'coverage/**'],
  },
];
