module.exports = {
  rules: {
    // "no-unused-vars": "off",
    // "vue/multi-word-component-names": "off",
    // "vue/no-mutating-props": "off",
    // "no-useless-escape": "off",
    // "no-empty": "off",
    // "no-unsafe-finally": "off",
    // "vue/no-side-effects-in-computed-properties": "off",
    // "no-undef": "off",
    // "vue/return-in-computed-property": "off",
    // "no-dupe-else-if": "off",
    // "vue/no-unused-components": "off",
    // "vue/no-unused-vars": "off",
    // "vue/require-valid-default-prop": "off",
  },
  parserOptions: {
    // parser: "babel-eslint",
  },
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
  },
};
