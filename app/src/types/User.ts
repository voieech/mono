/**
 * User type based on WorkOS User Management API
 * Matches what we return from backend auth endpoints
 */
export interface User {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  emailVerified?: boolean;
  profilePictureUrl?: string | null;
}
