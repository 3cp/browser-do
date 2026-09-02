const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      semi: ['error', 'always']
    }
  }
];
