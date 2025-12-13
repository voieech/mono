import { createContext } from "react";

import { AuthContextValue } from "@/utils";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
