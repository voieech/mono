import { createContext } from "react";

import type { ExperimentalSurfaceName } from "@/utils";

import { createUseContextHook } from "@/utils";

export const ExperimentalSurfaceContext = createContext<{
  /**
   * DO NOT USE DIRECTLY. This is the internal record for all experimental
   * surfaces. Updating this directly outside of the provider will not trigger
   * re-renders!
   */
  experimentalSurfaces: Partial<Record<ExperimentalSurfaceName, boolean>>;
  /**
   * Getter that will always default to __DEV__ if not set, so that the
   * return type will always be a clean boolean without undefined.
   */
  getShowExperimentalSurface: (
    experimentalSurfaceName: ExperimentalSurfaceName,
  ) => boolean;
  /**
   * Setter for a specific experimental surface
   */
  setShowExperimentalSurface: (
    experimentalSurfaceName: ExperimentalSurfaceName,
    showExperimentalSurface: boolean,
  ) => void;
}>(
  // @ts-expect-error
  null,
);

export const useExperimentalSurfaceContext = createUseContextHook(
  ExperimentalSurfaceContext,
  "ExperimentalSurfaceContext",
);
