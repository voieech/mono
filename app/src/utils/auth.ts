/**
 * User type based on WorkOS User Management API
 * Matches what we return from backend auth endpoints
 */
export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  emailVerified?: boolean;
  profilePictureUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextValue {
  user: User | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  isLoading: boolean;
}
