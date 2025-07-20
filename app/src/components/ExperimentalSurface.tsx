import { useEffect, useState, type PropsWithChildren } from "react";

import type { ExperimentalSurfaceName } from "@/utils";

import {
  useExperimentalSurfaceContext,
  ExperimentalSurfaceContext,
} from "@/context";
import { experimentalSurfaceInLocalStorage, posthog } from "@/utils";

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
  props: PropsWithChildren<{ name?: ExperimentalSurfaceName }>,
) =>
  useExperimentalSurfaceContext().getShowExperimentalSurface(
    props.name ?? "default",
  )
    ? props.children
    : null;

export function ExperimentalSurfaceProvider(props: PropsWithChildren) {
  const [isAsyncDataLoaded, setIsAsyncDataLoaded] = useState(false);
  const [experimentalSurfaces, setExperimentalSurfaces] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    experimentalSurfaceInLocalStorage.read().then((data) => {
      setExperimentalSurfaces(data);
      setIsAsyncDataLoaded(true);
    });
  }, [setExperimentalSurfaces]);

  // Dont return context and its children until data is loaded to prevent
  // showing UI with wrong data and re-rendering again after data loads.
  if (!isAsyncDataLoaded) {
    return null;
  }

  const getShowExperimentalSurface = (
    experimentalSurfaceName: ExperimentalSurfaceName,
  ) => experimentalSurfaces[experimentalSurfaceName] ?? __DEV__;

  return (
    <ExperimentalSurfaceContext
      value={{
        experimentalSurfaces,
        getShowExperimentalSurface,
        setShowExperimentalSurface(
          experimentalSurfaceName,
          showExperimentalSurface,
        ) {
          const newState = {
            ...experimentalSurfaces,
            [experimentalSurfaceName]: showExperimentalSurface,
          };
          setExperimentalSurfaces(newState);
          experimentalSurfaceInLocalStorage.update(newState);

          posthog.capture("experimental_surface_update", {
            experimentalSurfaceName,
            from: getShowExperimentalSurface(experimentalSurfaceName),
            to: showExperimentalSurface,
          });
        },
      }}
    >
      {props.children}
    </ExperimentalSurfaceContext>
  );
}
