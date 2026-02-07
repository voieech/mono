module.exports = {
  "**/*.{ts,tsx}": (filenames) => {
    const files = filenames.join(" ");
    return [
      // Run typecheck on the WHOLE project (ignoring specific filenames)
      "npm run typecheck",

      // Run lint/format on staged files only
      `npx expo lint --fix ${files}`,
      `npx prettier --write ${files}`,

      // Extract translations from all files only, and not using "--clean" flag
      // to prevent deleting existing translations and comments
      "npx lingui extract",

      // Validate that there is no missing `msgstr ""` values in the .po files
      "node ./scripts/prevent-missing-translations.js",

      // Stage validated .po files if they get updated
      "git add **/*.po",
    ];
  },
};
