import type { JWTPayload } from "jose";
import type { ZodType } from "zod";

import { z } from "zod";

/**
 * See WorkOS JWT template to ensure that this is correct
 */
export const jwtPayloadSchema = z.object({
  /**
   * When user first sign up and gets their first token, the external_id might
   * not be populated yet, which is why it is optional.
   */
  external_id: z.string().optional(),

  /* Standard JWT fields that is always populated by WorkOS */
  sub: z.string(),
  iss: z.string(),
  sid: z.string(),
  jti: z.string(),
  exp: z.number().int().min(0),
  iat: z.number().int().min(0),
} satisfies Record<keyof JWTPayload, ZodType>);

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
