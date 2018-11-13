module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },

  "extends": [
    // Enables rules, which have a check mark here
    // https://eslint.org/docs/rules/
    "eslint:recommended",
    // Enables rules enlisted here:
    // https://github.com/yannickcr/eslint-plugin-react#recommended
    "plugin:react/recommended",
    // Enables rules enlisted here:
    // https://github.com/evcohen/eslint-plugin-jsx-a11y#difference-between-recommended-and-strict-mode
    "plugin:jsx-a11y/recommended"
  ],
  "settings": {
    "react": {
      "version": "16.6" // React version, default to the latest React stable release
    }
  },

  "globals": {
    "smalltalk": true
  },
  //  A wrapper for Babel's parser used for ESLint
  // https://github.com/babel/babel-eslint
  "parser": "babel-eslint",
  // babel-eslint parser options
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
      "legacyDecorators": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    // React specific linting rules for ESLint
    // https://github.com/yannickcr/eslint-plugin-react
    "react",
    // Static AST checker for accessibility rules on JSX elements.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y
    "jsx-a11y",
    // This plugin intends to support linting of ES2015+ (ES6+) import/export syntax,
    // and prevent issues with misspelling of file paths and import names
    // https://github.com/benmosher/eslint-plugin-import
    "import"
  ],
  "rules": {
    // disallow strict mode directives
    // https://eslint.org/docs/rules/strict
    "strict": 0,
    // When there is only a single export from a module, prefer using default export over named export.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    "import/prefer-default-export": "off",
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive.md
    "jsx-a11y/tabindex-no-positive": "off",
    // Enforce that autoFocus prop is not used on elements. Autofocusing elements can cause usability
    // issues for sighted and non-sighted users
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md
    "jsx-a11y/no-autofocus": [ 2, {
        "ignoreNonDOM": true
    }],
    // Control sanity of HTML anchors
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    "jsx-a11y/anchor-is-valid": [ "error", {
        "aspects": [ "invalidHref" ]
      } ],
    // The recommended options for this rule allow tabIndex on elements with the noninteractive tabpanel role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-tabindex.md
    "jsx-a11y/no-noninteractive-tabindex": "off",
    //https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    // Prevent missing displayName in a React component definition
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
    "jsx-a11y/click-events-have-key-events": "off",
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
    "react/display-name": "off",
    // enforce a maximum line length
    // https://eslint.org/docs/rules/max-len
    "max-len": [ "error", {"code": 120, "comments": 120} ],
    // enforce consistent linebreak style
    "linebreak-style": [
      "error",
      "unix"
    ],
    // requires the use of double quotes wherever possible, backtick are also allowed though
    "quotes": [
      "error",
      "double",
      {"allowTemplateLiterals": true}
    ],
    // require or disallow semicolons instead of ASI
    "semi": [
      "error",
      "always"
    ],
    // disallow the use of console
    "no-console": [ "error", {"allow": [ "log", "warn", "error" ]} ],
    // allows multiple variable declarations per scope
    // but requires consecutive variable declarations to be combined into a single declaration
    "one-var": [ "error", "consecutive" ],
    // Disallow or enforce spaces inside of parentheses
    "space-in-parens": [ 1, "always", {"exceptions": [ "empty", "{}", "[]" ]} ],
    // Disallow or enforce spaces inside of brackets
    "array-bracket-spacing": [ "error", "always", {
        "objectsInArrays": false,
        "arraysInArrays": false

      } ],
    // enforce consistent spacing inside braces
    "object-curly-spacing": [ "error", "always", {
        "arraysInObjects": false,
        "objectsInObjects": false
      } ],
    // Disallow or enforce spaces inside of computed properties
    "computed-property-spacing": [ "error", "always" ],
    // require or disallow trailing commas
    "comma-dangle": [ "error", "never" ],
    // enforce consistent indentation
    "indent": [ "error", 2, {"VariableDeclarator": {"var": 2, "let": 2, "const": 3}} ],
    // Disallow Unused Variables
    "no-unused-vars": [ "error", {
        "caughtErrors": "all",
        "args": "after-used",
        "ignoreRestSiblings": true
      } ],
    // require "1tbs" brace style (https://eslint.org/docs/rules/brace-style)
    "brace-style": [ "error", "1tbs", { "allowSingleLine": true } ],
    // no more than two sequent empty lines
    "no-multiple-empty-lines": ["error", { "max": 2 }],
    // do not mix spaces and tabs for indentation
    "no-mixed-spaces-and-tabs": ["error"],
    // no trailing spaces llowed
    "no-trailing-spaces":  ["error"],
    // keyword words shall be surrounded by spaces
    "keyword-spacing": ["error", { "before": true, "after": true }]
  }
};