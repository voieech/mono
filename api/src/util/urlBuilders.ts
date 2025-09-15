/**
 * Simple hand crafted URL builders for now.
 */
export const urlBuilders = {
  rootDomain: (path?: `/${string}`) => `https://voieech.com${path ?? ""}`,

  apiDomain: (version: number, path: `/${string}`) =>
    `https://api.voieech.com/v${version}${path}`,
};
