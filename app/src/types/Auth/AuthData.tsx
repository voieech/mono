import type { User } from "../User";
import type { JWTPayload } from "./JWTPayload";

/**
 * Auth data from workos auth
 */
export type AuthDataFromWorkos = {
  refreshToken: string;
  accessToken: string;
  userData: User;
};

/**
 * Combined Auth data object
 */
export type AuthData = AuthDataFromWorkos & {
  accessTokenPayload: JWTPayload;
};
