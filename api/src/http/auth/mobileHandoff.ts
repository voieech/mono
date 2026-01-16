import { redisDB } from "src/redis/redisDB.js";
import { mapWorkOsUser } from "src/util/mapWorkOsUser.js";

type MobileHandoffPayload = {
  accessToken: string;
  refreshToken: string;
  user: ReturnType<typeof mapWorkOsUser>;
};

function isMobileHandoffPayload(value: any): value is MobileHandoffPayload {
  return (
    value &&
    typeof value === "object" &&
    typeof value.accessToken === "string" &&
    typeof value.refreshToken === "string" &&
    typeof value.user === "object"
  );
}

const TTL_SECONDS = 60;

export async function storeMobileHandoff(
  code: string,
  payload: MobileHandoffPayload,
) {
  const key = `auth_exchange:handoff:${code}`;

  await redisDB.set(key, payload, {
    ex: TTL_SECONDS, // 60 seconds
    nx: true, // prevent overwrite
  });
}

// LUA script to ensure “read once, then delete” atomic
const consumeScript = `
local val = redis.call("GET", KEYS[1])
if not val then
return nil
end
redis.call("DEL", KEYS[1])
return val
`;

/**
 * Consume a one-time handoff
 */
export async function consumeMobileHandoff(code: string) {
  const key = `auth_exchange:handoff:${code}`;

  const result = await redisDB.eval(consumeScript, [key], []);

  if (!result) {
    return null;
  }

  if (!isMobileHandoffPayload(result)) {
    throw new Error("Invalid mobile handoff payload in Redis");
  }

  return result;
}
