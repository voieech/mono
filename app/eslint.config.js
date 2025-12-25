// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const perfectionist = require("eslint-plugin-perfectionist");
const pluginLingui = require("eslint-plugin-lingui");

module.exports = defineConfig([
  expoConfig,
  pluginLingui.configs["flat/recommended"],
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
          object: "RNTPTrackPlayer",
          allowProperties: [
            "addEventListener",
            "getProgress",
            "getRepeatMode",
            "setRepeatMode",
          ],
          message:
            "Please use the `TrackPlayer` wrapper via `const trackPlayer = useTrackPlayer();` instead",
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
