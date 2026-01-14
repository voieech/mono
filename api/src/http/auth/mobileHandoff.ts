import { mapWorkOsUser } from "src/util/mapWorkOsUser.js";

type MobileHandoffPayload = {
  accessToken: string;
  refreshToken: string;
  user: ReturnType<typeof mapWorkOsUser>;
  expiresAt: number;
};

const store = new Map<string, MobileHandoffPayload>();
const TTL_MS = 60_000;

export async function storeMobileHandoff(
  code: string,
  payload: Omit<MobileHandoffPayload, "expiresAt">,
) {
  store.set(code, {
    ...payload,
    expiresAt: Date.now() + TTL_MS,
  });
}

/**
 * Consume a one-time handoff
 */
export async function consumeMobileHandoff(code: string) {
  const payload = store.get(code);
  if (!payload) {
    return null;
  }

  // Enforce TTL at read time
  if (payload.expiresAt < Date.now()) {
    store.delete(code);
    return null;
  }

  store.delete(code); // one-time use
  return payload;
}

/**
 * Periodic cleanup (start ONCE at boot)
 */
setInterval(() => {
  const now = Date.now();
  for (const [code, payload] of store.entries()) {
    if (payload.expiresAt < now) {
      store.delete(code);
    }
  }
}, TTL_MS);
