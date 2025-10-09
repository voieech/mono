import { createContext } from "react";

import { createUseContextHook } from "@/utils";

export const AppDebuggingSurfaceContext = createContext<{
  /**
   * Should debugging surfaces be shown?
   */
  showDebuggingSurfaces: boolean;
  /**
   * Setter to toggle whether debugging surfaces should be shown.
   */
  setShowDebuggingSurfaces: (showDebuggingSurfaces: boolean) => void;
}>(
  // @ts-expect-error
  null,
);

export const useAppDebuggingSurfaceContext = createUseContextHook(
  AppDebuggingSurfaceContext,
  "AppDebuggingSurfaceContext",
);
