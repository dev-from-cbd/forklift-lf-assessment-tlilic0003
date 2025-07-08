/** @type {import('tailwindcss').Config} */ // Type annotation for Tailwind CSS configuration
export default { // Exporting the default configuration object
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Files where Tailwind should look for classes
  theme: { // Theme customization section
    extend: {}, // Placeholder for extending default theme (currently empty)
  },
  plugins: [], // Array for Tailwind CSS plugins (currently empty)
};
