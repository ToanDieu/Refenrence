module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "airbnb-typescript",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  env: {
    browser: true,
    jest: true
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "react/forbid-prop-types": "off",
    "react/destructuring-assignment": "off",
    // because using Typescript
    "react/prop-types": "off",
    // sometime we need to to this
    "import/no-named-default": "off",
    // we will not fullly support using ui via keyboard
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "import/prefer-default-export": "off",
    "import/no-named-as-default": "off",
    "no-use-before-define": "off",
    // for immer
    "no-param-reassign": "off"
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
      }
    }
  }
};
