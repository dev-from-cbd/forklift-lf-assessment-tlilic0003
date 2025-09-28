// Import ESLint's core JavaScript configuration and rules
import js from '@eslint/js';
// Import global variables definitions for different environments (browser, node, etc.)
import globals from 'globals';
// Import React Hooks ESLint plugin to enforce React Hooks rules
import reactHooks from 'eslint-plugin-react-hooks';
// Import React Refresh plugin for development hot reloading support
import reactRefresh from 'eslint-plugin-react-refresh';
// Import TypeScript ESLint parser and rules
import tseslint from 'typescript-eslint';

// Export default ESLint configuration using TypeScript ESLint config helper
export default tseslint.config(
  // First configuration object: specify files to ignore during linting
  { ignores: ['dist'] }, // Ignore the dist directory (build output)
  // Second configuration object: main linting rules and settings
  {
    // Extend from recommended configurations for JavaScript and TypeScript
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Apply this configuration to TypeScript and TypeScript React files
    files: ['**/*.{ts,tsx}'],
    // Language-specific options for the parser
    languageOptions: {
      // Set ECMAScript version to 2020 for modern JavaScript features
      ecmaVersion: 2020,
      // Define global variables available in browser environment
      globals: globals.browser,
    },
    // ESLint plugins to use for additional rules and functionality
    plugins: {
      // React Hooks plugin for enforcing React Hooks best practices
      'react-hooks': reactHooks,
      // React Refresh plugin for hot module replacement in development
      'react-refresh': reactRefresh,
    },
    // Custom linting rules configuration
    rules: {
      // Include all recommended React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // Configure React Refresh rule to warn about non-component exports
      'react-refresh/only-export-components': [
        // Set rule severity to warning level
        'warn',
        // Allow constant exports (like configuration objects)
        { allowConstantExport: true },
      ],
    },
  }
);
