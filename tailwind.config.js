/** @type {import('tailwindcss').Config} */
// TypeScript type annotation for Tailwind CSS configuration object

export default {
  // Exporting the configuration object as the default module export
  
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Specifies which files Tailwind should scan for class usage
  // Includes index.html and all JS/TS/JSX/TSX files in the src directory
  
  theme: {
    // Theme configuration section for customizing the default Tailwind design system
    
    extend: {},
    // Empty extend object for adding custom values to the default theme
    // Currently not extending any default theme values
  },
  
  plugins: [],
  // Array for Tailwind plugins - currently empty
  // Can be used to add third-party plugins for additional functionality
};
