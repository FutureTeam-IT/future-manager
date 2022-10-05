module.exports = {
  env: {
    node: true
  },
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  extends: ["google", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "prettier"],
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "prettier/prettier": ["error"]
  }
};
