import { User } from "@workos-inc/node";

export function mapWorkOsUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerified: user.emailVerified,
    profilePictureUrl: user.profilePictureUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
