import { createContext } from "react";

import type { User } from "@/types";

export const AuthContext = createContext<{
  user: User | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getAuthHeader: () => Promise<{ Authorization: string }>;
  isLoading: boolean;
}>(
  // @ts-expect-error
  null,
);
