import { router } from "./router";

export function updateLangQueryParam(lang: string) {
  router.push({
    query: {
      lang,
    },
  });
}
