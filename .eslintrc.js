module.exports = {
    "extends": [
      "standard",
      "plugin:vue/essential"
      //"plugin:vue/recommended"
    ],
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
      "space-in-parens": 'off'
    },
    parserOptions: {
      "parser": "babel-eslint",
      "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": true
      }
    }
};
