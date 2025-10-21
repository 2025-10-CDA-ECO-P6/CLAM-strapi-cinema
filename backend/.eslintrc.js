module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  globals: {
    strapi: false,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-console': 'warn',
    'no-debugger': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'build/',
    'dist/',
    '.cache/',
    'public/',
  ],
};