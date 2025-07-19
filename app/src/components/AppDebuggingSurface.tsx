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
export const AppDebuggingSurface = (props: PropsWithChildren) =>
  useAppDebuggingSurfaceContext().showDebuggingSurfaces ? props.children : null;

export function AppDebuggingSurfaceProvider(props: PropsWithChildren) {
  const [showDebuggingSurfaces, setShowDebuggingSurfaces] = useState(__DEV__);
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
