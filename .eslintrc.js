module.exports = {
  plugins: ["react"],
  globals: {
    importScripts: true
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "no-console": ["off"],
    camelcase: [
      1,
      {
        properties: "always"
      }
    ],
    "react/jsx-one-expression-per-line": [
      "warn",
      {
        allow: "none"
      }
    ],
    "react/prop-types": "off",
    complexity: ["warn", 5],
    "max-nested-callbacks": ["warn", 8],
    "no-unused-vars": "warn",
    "max-statements": [
      "warn",
      {
        max: 4
      }
    ],
    "max-statements-per-line": [
      "warn",
      {
        max: 1
      }
    ],
    "getter-return": "warn",
    "jsx-quotes": ["warn", "prefer-double"]
  },
  extends: ["prettier", "react-app", "eslint:recommended", "plugin:react/recommended"],
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React", // Pragma to use, default to "React"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      flowVersion: "0.53" // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { property: "freeze", object: "Object" },
      { property: "myFavoriteWrapper" }
    ]
  }
};
