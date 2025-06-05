// Import ESLint's JavaScript configuration
import js from '@eslint/js';
// Import globals for browser environment
import globals from 'globals';
// Import React Hooks plugin for ESLint
import reactHooks from 'eslint-plugin-react-hooks';
// Import React Refresh plugin for ESLint
import reactRefresh from 'eslint-plugin-react-refresh';
// Import TypeScript ESLint plugin
import tseslint from 'typescript-eslint';

// Export ESLint configuration
// First configuration object: ignore 'dist' directory
// Second configuration object: main ESLint rules
// - Extends recommended ESLint and TypeScript configurations
// - Applies to TypeScript and TSX files
// - Sets ECMAScript version to 2020
// - Includes browser globals
// - Adds React Hooks and Refresh plugins
// - Includes React Hooks recommended rules
// - Configures React Refresh to warn on non-component exports (allowing constants)
export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
