import { WorkOS } from "@workos-inc/node";

if (process.env["WORKOS_API_KEY"] === undefined) {
  throw new Error(`process.env.WORKOS_API_KEY is undefined`);
}

if (process.env["WORKOS_CLIENT_ID"] === undefined) {
  throw new Error(`process.env.WORKOS_CLIENT_ID is undefined`);
}

if (process.env["WORKOS_COOKIE_PASSWORD"] === undefined) {
  throw new Error(`process.env.WORKOS_COOKIE_PASSWORD is undefined`);
}

if (process.env["WORKOS_REDIRECT_URI"] === undefined) {
  throw new Error(`process.env.WORKOS_REDIRECT_URI is undefined`);
}

export const WORKOS_API_KEY = process.env["WORKOS_API_KEY"];
export const WORKOS_CLIENT_ID = process.env["WORKOS_CLIENT_ID"];
export const WORKOS_COOKIE_PASSWORD = process.env["WORKOS_COOKIE_PASSWORD"];
export const WORKOS_REDIRECT_URI = process.env["WORKOS_REDIRECT_URI"];
export const WORKOS_COOKIE_NAME = "session-wos";

export const workos = new WorkOS(WORKOS_API_KEY, {
  clientId: WORKOS_CLIENT_ID,
});
