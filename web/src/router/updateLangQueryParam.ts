import { router } from "./router";

/**
 * Updates the lang query param
 */
export function updateLangQueryParam(lang: string) {
  router.replace({
    query: {
      lang,
    },
  });
}
