import globals from "globals";
import tseslint from "typescript-eslint";

import perfectionist from "eslint-plugin-perfectionist";

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["dist/**"],
    languageOptions: {
      globals: globals.node,
    },
    linterOptions: {
      // Disabling this for now so that we can add arbitrary eslint-disable
      // lines to codegen generated files without issue.
      reportUnusedDisableDirectives: "off",
    },
    rules: {
      "use-isnan": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "no-throw-literal": "error",
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "no-irregular-whitespace": "error",
      "no-unused-private-class-members": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "res",
          property: "end",
          message:
            "Please use res.send/alternatives instead of the low level .end method, for features like Etag generation",
        },
      ],
      "no-fallthrough": [
        "error",
        {
          // Allow a one or more empty cases to be stacked on top of a case that
          // actually implements some logic, to share the logic between these
          // stacked cases.
          allowEmptyCase: true,
        },
      ],
      "default-case": "error",
      curly: "error",
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-exports": "error",
    },
    plugins: {
      perfectionist,
    },
  },
  tseslint.configs.base,
];
