module.exports = {
  verbose: true,
  testEnvironment: "node",
  setupFiles: [
    "./jest.setup.js"
  ],
  testRegex: "src/__tests__/.+\\.spec\\.jsx?$",
  moduleFileExtensions: [
    "js",
    "jsx"
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  modulePaths: [
    "src",
    "app"
  ]
};