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
    }
  ]
};
