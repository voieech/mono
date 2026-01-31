import type { JWTPayload } from "jose";
import type { ZodType } from "zod";

import { z } from "zod";

export const jwtPayloadSchema = z.object({
  iss: z.string(),
  sub: z.string(),
  sid: z.string(),
  jti: z.string(),
  exp: z.number().int().min(0),
  iat: z.number().int().min(0),
} satisfies Record<keyof JWTPayload, ZodType>);

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
