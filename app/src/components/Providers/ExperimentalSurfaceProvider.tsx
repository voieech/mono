import { type PropsWithChildren, useState, useEffect } from "react";

import { ExperimentalSurfaceContext } from "@/context";
import {
  experimentalSurfaceInLocalStorage,
  type ExperimentalSurfaceName,
  posthog,
} from "@/utils";

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
  }, [setExperimentalSurfaces, setIsAsyncDataLoaded]);

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
