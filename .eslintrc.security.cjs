const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      security: require('eslint-plugin-security'),
      xss: require('eslint-plugin-xss')
    },
    rules: {
      // Basic Security Rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      
      // SOLID Principles Validation Rules
      complexity: ['warn', { max: 10 }],
      'max-depth': ['warn', { max: 4 }],
      'max-params': ['warn', { max: 5 }],
      'max-lines-per-function': ['warn', { max: 50 }],
      
      // Code Quality Rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-promise-reject-errors': 'error',
      'no-throw-literal': 'error'
    }
  },
  {
    files: ['src/services/**/*.js'],
    rules: {
      // SOLID SRP: Single Responsibility
      'max-lines-per-function': ['error', { max: 30 }],
      complexity: ['error', { max: 7 }]
    }
  },
  {
    files: ['src/tests/**/*.test.js'],
    rules: {
      'no-console': 'off',
      'max-lines-per-function': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs'
    ]
  }
];