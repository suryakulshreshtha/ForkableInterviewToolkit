// ESLint 9 flat config.
//
// The project previously had no linter at all: `npm run typecheck` ran
// `tsc --noEmit` and that was the whole static-analysis story. A toolkit that
// teaches interview-grade TypeScript should ship the linter every interviewer
// asks about -- and eslint-plugin-playwright catches test smells the compiler
// cannot see: conditionals in tests, missing assertions, hard waits.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**', 'playwright-report/**', 'blob-report/**',
      'test-results/**', '.features-gen/**', 'dist/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  {
    files: ['framework/tests/**/*.spec.ts', 'examples/**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // The point of the repo is to demonstrate these, so a hard wait is a
      // warning to explain rather than an error to hide.
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-conditional-in-test': 'warn',
    },
  },

  // The empty-pattern `async ({}, use) =>` is required by Playwright's own
  // fixture API, so the generic lint rule against it does not apply here.
  {
    files: ['framework/fixtures/**/*.ts', 'examples/**/steps/*.ts'],
    rules: { 'no-empty-pattern': 'off' },
  },
);
