/** @type {import('ts-jest').JestConfigWithTsJest} **/ // TypeScript type annotation for Jest configuration
export default { // Export default Jest configuration object
  testEnvironment: "node", // Set test environment to Node.js (for backend testing)
  transform: { // Configure how files should be transformed before running tests
    "^.+\\.tsx?$": ["ts-jest",{}], // Use ts-jest to transform TypeScript files
  },
};