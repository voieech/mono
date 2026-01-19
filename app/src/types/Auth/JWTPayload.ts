/**
 * JWT token's payload section
 */
export type JWTPayload = {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  sid: string;
  sub: string;
};
