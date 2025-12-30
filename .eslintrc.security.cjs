const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
        File: 'readonly',
        setTimeout: 'readonly'
      }
    },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-unsafe-finally': 'error',
      'complexity': ['error', { max: 10 }],
      'max-lines-per-function': ['error', { max: 50 }],
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-case-declarations': 'error',
      'no-useless-escape': 'off'
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        console: 'readonly',
        process: 'readonly'
      }
    }
  },
  {
    files: ['src/tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly'
      }
    }
  }
];