module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/**/*.stories.{js,jsx}"
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98
    }
  },
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    ".*\\.(css|less|styl|scss|sass)$": "<rootDir>/mocks/cssModule.js",
    ".*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/mocks/image.js"
  },
  setupFilesAfterEnv: ["react-testing-library/cleanup-after-each"],
  testRegex: "tests/.*\\.test\\.jsx?$",
  snapshotSerializers: ["jest-emotion"]
};
