/** @type {import('tailwindcss').Config} */
// This comment specifies the type of the configuration object using JSDoc. 
// It tells the editor or TypeScript that this object follows the structure expected by Tailwind CSS.

export default {
  // Exporting a default object, which is the configuration for Tailwind CSS.
  
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // The 'content' property specifies the files that Tailwind CSS should scan for classes to include in the final CSS.
  // Here, it includes 'index.html' and all files in the 'src' directory with extensions like .js, .ts, .jsx, and .tsx.

  theme: {
    // The 'theme' section allows customization of the default design system provided by Tailwind CSS.
    
    extend: {},
    // The 'extend' property is used to add or modify values in the default theme without overwriting the entire theme.
    // In this case, it's an empty object, meaning no additional customizations are made to the default theme.
  },
  
  plugins: [],
  // The 'plugins' array lists any additional plugins you want to use with Tailwind CSS.
  // An empty array means no extra plugins are being used in this configuration.
};