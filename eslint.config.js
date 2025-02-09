// Import the core ESLint JavaScript configuration
import js from "@eslint/js";

// Import predefined global variables for different environments
import globals from "globals";

// Import React Hooks ESLint plugin for enforcing Rules of Hooks
import reactHooks from "eslint-plugin-react-hooks";

// Import React Refresh ESLint plugin for handling Fast Refresh capabilities
import reactRefresh from "eslint-plugin-react-refresh";

// Import TypeScript ESLint configuration and parser
import tseslint from "typescript-eslint";

// Export the complete ESLint configuration
export default tseslint.config(
  // Ignore the 'dist' directory during linting
  { ignores: ["dist"] },
  {
    // Extend from recommended JavaScript and TypeScript ESLint configurations
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    // Apply these rules to TypeScript and TSX files
    files: ["**/*.{ts,tsx}"],

    // Configure language options
    languageOptions: {
      // Set ECMAScript version to 2020
      ecmaVersion: 2020,
      // Use browser global variables
      globals: globals.browser,
    },

    // Configure ESLint plugins
    plugins: {
      // Add React Hooks linting rules
      "react-hooks": reactHooks,
      // Add React Refresh linting rules
      "react-refresh": reactRefresh,
    },

    // Define specific linting rules
    rules: {
      // Include all recommended React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // Configure React Refresh rule to warn about non-component exports
      "react-refresh/only-export-components": [
        "warn",
        // Allow constant exports alongside components
        { allowConstantExport: true },
      ],
    },
  }
);
