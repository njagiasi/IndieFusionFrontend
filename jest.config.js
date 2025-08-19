module.exports = {
    moduleNameMapper: {
        '^axios$': '<rootDir>/__mocks__/axios.js', // Mock axios for testing
      },
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios).+\\.js$"
    ],
    testEnvironment: "jsdom",
  };
  