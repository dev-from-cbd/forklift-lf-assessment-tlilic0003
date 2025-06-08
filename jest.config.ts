module.exports = { // Export Jest configuration object
  preset: 'ts-jest', // Use ts-jest preset for TypeScript support
  testEnvironment: 'node', // Set test environment to Node.js
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Supported file extensions
  collectCoverage: true, // Enable code coverage collection
  coverageDirectory: 'coverage', // Directory to store coverage reports
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Paths to ignore during testing
  transform: { // File transformation configuration
    '^.+\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
};