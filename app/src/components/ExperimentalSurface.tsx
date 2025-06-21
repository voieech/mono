import { useState, type PropsWithChildren } from "react";

import type { ExperimentalSurfaceName } from "@/utils";

import {
  useExperimentalSurfaceContext,
  ExperimentalSurfaceContext,
} from "@/context";

/**
 * Wrapper component to conditionally show your children/wrapper component
 * depending on whether your `ExperimentalSurface` is set to show or not.
 *
 * Update `ExperimentalSurfaceName` if you would like to use a new custom name
 * and custom toggle setting.
 *
 * If no `name` is specified, the `default` ExperimentalSurfaceName will be used
 * and the surface can be shown/hidden using the "Show all other generic
 * experimental surfaces" setting.
 */
export const ExperimentalSurface = (
  props: PropsWithChildren<{ name?: ExperimentalSurfaceName }>
) =>
  useExperimentalSurfaceContext().getShowExperimentalSurface(
    props.name ?? "default"
  )
    ? props.children
    : null;

export function ExperimentalSurfaceProvider(props: PropsWithChildren) {
  const [experimentalSurfaces, setExperimentalSurfaces] = useState<
    Record<string, boolean>
  >({});
  return (
    <ExperimentalSurfaceContext
      value={{
        experimentalSurfaces,
        getShowExperimentalSurface(experimentalSurfaceName) {
          return experimentalSurfaces[experimentalSurfaceName] ?? __DEV__;
        },
        setShowExperimentalSurface(
          experimentalSurfaceName,
          showExperimentalSurface
        ) {
          setExperimentalSurfaces((state) => ({
            ...state,
            [experimentalSurfaceName]: showExperimentalSurface,
          }));
        },
      }}
    >
      {props.children}
    </ExperimentalSurfaceContext>
  );
}
