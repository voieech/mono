import type { PropsWithChildren } from "react";

import { useAppDebuggingSurfaceContext } from "@/context";

/**
 * Wrapper component to conditionally show your children/wrapper component
 * depending on whether the `AppDebuggingSurfaceContext`'s showDebuggingSurfaces
 * setting is set to true/false.
 */
export const AppDebuggingSurface = (props: PropsWithChildren) =>
  useAppDebuggingSurfaceContext().showDebuggingSurfaces ? props.children : null;
