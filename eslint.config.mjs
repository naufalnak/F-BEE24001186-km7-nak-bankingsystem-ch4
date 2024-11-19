import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.jest,
        io: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Abaikan variabel dengan nama diawali _
      "no-undef": "warn", // Beri peringatan untuk variabel undefined
      "no-console": "off",
    },
  },
  pluginJs.configs.recommended,
];
