import { getFreshAccessTokenIfAvailable } from "./getFreshAccessTokenIfAvailable";

export async function wrappedFetch(...args: Parameters<typeof fetch>) {
  let [input, init] = args;

  if (init === undefined) {
    init = {};
  }

  const originalHeaders = init.headers;

  init.headers = {
    ...originalHeaders,
    Authorization: `Bearer ${await getFreshAccessTokenIfAvailable()}`,
  };

  return fetch(input, init);
}
