import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        allowImportExportEverywhere: true,
        ecmaFeatures: {
          globalReturn: true,
        },
      },
      globals: {
        strapi: false,
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'semi': ['error', 'always'],
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      '.cache/',
      'public/',
    ],
  },
];