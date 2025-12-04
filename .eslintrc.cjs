module.exports = {
  env: {
    browser: true,
    es2021: true,
    'vitest-globals/env': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:vitest-globals/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', 'vitest-globals'],
  rules: {
    'react/prop-types': 'warn',
    'no-unused-vars': 'warn',
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};

