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
      // The runner is Vitest, and Vitest's `expect` takes an optional message
      // as a second argument (jest's does not). `jest/valid-expect` misfires on
      // every assertion that documents what it checks, so it is off for the
      // Vitest suites. Same reasoning as the Playwright override below; every
      // other jest rule stays on.
      files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'jest/valid-expect': 'off'
      }
    },
    {
      // Playwright specs are not RTL tests: `expect` is Playwright's, and the
      // page locators are not "render" queries. The testing-library rules
      // misread them. `jest/valid-expect` also misfires: Playwright's expect
      // takes an optional message as a second argument, jest's does not.
      // Every other jest rule stays on.
      files: ['e2e/**/*.ts', 'playwright.config.ts'],
      rules: {
        'jest/valid-expect': 'off',
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/no-node-access': 'off'
      }
    }
  ]
};
