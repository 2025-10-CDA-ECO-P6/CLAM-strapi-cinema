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
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                prompt: 'readonly',
                fetch: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                // Framework globals
                Alpine: 'readonly',
                axios: 'readonly',
                Swiper: 'readonly',
                // Materialize CSS globals (if used)
                M: 'readonly',
            },
        },
        rules: {
            'linebreak-style': 'off', // Disabled for Windows compatibility
            'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
            'semi': ['error', 'always'],
            'no-debugger': 'warn', // Changed to warning for development
            'no-console': 'off', // Allow console for frontend debugging
            'no-undef': 'warn', // Keep undefined variable checking
        },
    },
    {
        ignores: [
            'node_modules/',
            'build/',
            'dist/',
            '.cache/',
            'public/',
            'server.js', // Ignore the Express server file
        ],
    },
];
