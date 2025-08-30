// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const perfectionist = require("eslint-plugin-perfectionist");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "TrackPlayer",
          property: "play",
          message:
            "Please use the `TrackPlayerPlayWithGlobalRate()` wrapper instead",
        },
      ],
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-exports": "error",
    },
    plugins: {
      perfectionist,
    },
  },
]);
