import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "zh"],
  // Falls back to "en" if key is missing in any other locale
  // To support this, "en" must always be loaded to support the fallback
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
});
