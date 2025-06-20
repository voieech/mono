import { createContext, useContext } from "react";

export const AppDebuggingSurfaceContext = createContext<{
  showDebuggingSurfaces: boolean;
  setShowDebuggingSurfaces: (showDebuggingSurfaces: boolean) => void;
}>({
  showDebuggingSurfaces: false,
  setShowDebuggingSurfaces: () => {
    throw new Error(
      "Cannot call AppDebuggingSurfaceContext.setShowDebuggingSurfaces outside of provider"
    );
  },
});

export const useAppDebuggingSurfaceContext = () =>
  useContext(AppDebuggingSurfaceContext);
