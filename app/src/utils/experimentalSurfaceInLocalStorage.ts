import { LocalStorageWrapper } from "./LocalStorageWrapper";

class ExperimentalSurfaceInLocalStorage extends LocalStorageWrapper<
  Record<string, boolean>
> {
  _storageKey = "experimental_surfaces";
  _defaultValue = {};
}

/**
 * Wrapper around `localStorage` API for ExperimentalSurfaces
 */
export const experimentalSurfaceInLocalStorage =
  new ExperimentalSurfaceInLocalStorage();
