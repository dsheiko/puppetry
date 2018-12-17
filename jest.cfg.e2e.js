module.exports = {
  verbose: true,
  testEnvironment: "node",
  setupFiles: [
    "./jest.setup.js"
  ],
  testRegex: "src/__e2e__/specs/.+\\.spec\\.jsx?$",
  moduleFileExtensions: [
    "js",
    "jsx"
  ],
  modulePaths: [
    "src",
    "app"
  ]
};