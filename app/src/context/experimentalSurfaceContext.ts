import { createContext, useContext } from "react";

import type { ExperimentalSurfaceName } from "@/utils";

export const ExperimentalSurfaceContext = createContext<{
  /**
   * DO NOT USE DIRECTLY. This is the internal record for all experimental
   * surfaces. Updating this directly outside of the provider will not trigger
   * re-renders!
   */
  experimentalSurfaces: Partial<Record<ExperimentalSurfaceName, boolean>>;
  /**
   * Getter that will always default to false if not set, so that the
   * return type will always be a clean boolean without undefined.
   */
  getShowExperimentalSurface: (
    experimentalSurfaceName: ExperimentalSurfaceName
  ) => boolean;
  /**
   * Setter for a specific experimental surface
   */
  setShowExperimentalSurface: (
    experimentalSurfaceName: ExperimentalSurfaceName,
    showExperimentalSurface: boolean
  ) => void;
}>({
  experimentalSurfaces: {},
  getShowExperimentalSurface: () => {
    throw new Error(
      "Cannot call ExperimentalSurfaceContext.getShowExperimentalSurface outside of provider"
    );
  },
  setShowExperimentalSurface: () => {
    throw new Error(
      "Cannot call ExperimentalSurfaceContext.setShowExperimentalSurfaces outside of provider"
    );
  },
});

/**
 * Access the whole `ExperimentalSurfaceContext` value.
 */
export const useExperimentalSurfaceContext = () =>
  useContext(ExperimentalSurfaceContext);
