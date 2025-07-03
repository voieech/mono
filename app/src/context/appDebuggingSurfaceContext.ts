import { createContext, useContext } from "react";

export const AppDebuggingSurfaceContext = createContext<{
  showDebuggingSurfaces: boolean;
  setShowDebuggingSurfaces: (showDebuggingSurfaces: boolean) => void;
}>({
  showDebuggingSurfaces: false,
  /**
   * Setter to toggle whether debugging surfaces should be shown.
   */
  setShowDebuggingSurfaces: () => {
    throw new Error(
      "Cannot call AppDebuggingSurfaceContext.setShowDebuggingSurfaces outside of provider",
    );
  },
});

export const useAppDebuggingSurfaceContext = () =>
  useContext(AppDebuggingSurfaceContext);
