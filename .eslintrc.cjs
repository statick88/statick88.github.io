module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    'no-restricted-globals': 'off'
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'jest/valid-expect': 'warn',
        'jest/no-conditional-expect': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        'testing-library/prefer-screen-queries': 'warn'
      }
    },
    {
      // Playwright specs are not RTL tests: `expect` is Playwright's, and the
      // page locators are not "render" queries. The testing-library and jest
      // rules from `react-app/jest` misread them, so they are off here.
      files: ['e2e/**/*.ts', 'playwright.config.ts'],
      rules: {
        'jest/valid-expect': 'off',
        'jest/valid-title': 'off',
        'jest/no-conditional-expect': 'off',
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/no-node-access': 'off'
      }
    }
  ]
};
