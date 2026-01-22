import type { PropsWithChildren } from "react";

import { useAuthContext } from "@/context";

/**
 * Wrapper component to conditionally show your children/wrapper component
 * depending on whether the current user is authenticated.
 */
export const AuthenticatedUsersOnly = (props: PropsWithChildren) =>
  useAuthContext().isAuthenticated ? props.children : null;
