module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest", // Transforms TypeScript files
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/src/tests/**/*.test.ts"], // Runs tests inside `src/tests`
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/tests/**"], // Exclude test files from coverage
};
