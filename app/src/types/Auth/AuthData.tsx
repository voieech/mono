import type { User } from "../User";

/**
 * Auth data from workos auth
 */
export type AuthData = {
  accessToken: string;
  refreshToken: string;
  userData: User;
};
