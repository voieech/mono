import { useState, type PropsWithChildren } from "react";

import {
  useAppDebuggingSurfaceContext,
  AppDebuggingSurfaceContext,
} from "@/context";

/**
 * Wrapper component to conditionally show your children/wrapper component
 * depending on whether the `AppDebuggingSurfaceContext`'s showDebuggingSurfaces
 * setting is set to true/false.
 */
export function AppDebuggingSurface(props: PropsWithChildren) {
  const appDebuggingSurfaceContext = useAppDebuggingSurfaceContext();
  if (!appDebuggingSurfaceContext.showDebuggingSurfaces) {
    return null;
  }
  return props.children;
}

export function AppDebuggingSurfaceProvider(props: PropsWithChildren) {
  const [showDebuggingSurfaces, setShowDebuggingSurfaces] = useState(false);
  return (
    <AppDebuggingSurfaceContext
      value={{
        showDebuggingSurfaces,
        setShowDebuggingSurfaces,
      }}
    >
      {props.children}
    </AppDebuggingSurfaceContext>
  );
}
