module.exports = {
  "extends": [
    "standard",
    "plugin:vue/essential"
    //"plugin:vue/recommended"
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "space-in-parens": "off",
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    "semi": ["error", "always"],
    "no-extra-semi": "error",
    "space-before-function-paren": ["error", "never"]
  },
  parserOptions: {
    "parser": "babel-eslint",
    "parserOptions": {
      "sourceType": "module",
      "allowImportExportEverywhere": true
    }
  }
};
