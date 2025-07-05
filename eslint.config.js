// Import ESLint JavaScript configuration
import js from '@eslint/js';
// Import globals for browser environment
import globals from 'globals';
// Import React Hooks plugin for ESLint
import reactHooks from 'eslint-plugin-react-hooks';
// Import React Refresh plugin for ESLint
import reactRefresh from 'eslint-plugin-react-refresh';
// Import TypeScript ESLint configuration
import tseslint from 'typescript-eslint';

// Export default ESLint configuration
export default tseslint.config(
  // First configuration object: ignore 'dist' directory
  { ignores: ['dist'] },
  // Second configuration object: main ESLint rules
  {
    // Extend recommended configurations from ESLint and TypeScript ESLint
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Apply these rules to TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    // Language options
    languageOptions: {
      // Use ECMAScript 2020 features
      ecmaVersion: 2020,
      // Include browser global variables
      globals: globals.browser,
    },
    // Plugins configuration
    plugins: {
      // Enable React Hooks linting rules
      'react-hooks': reactHooks,
      // Enable React Refresh linting rules
      'react-refresh': reactRefresh,
    },
    // Custom rules
    rules: {
      // Include recommended React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // Rule for React Refresh: only allow component exports
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
