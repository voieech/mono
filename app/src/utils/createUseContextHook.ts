import type { Context } from "react";

import { useContext } from "react";

/**
 * Factory function to create a new `useContextValue` hook, this hook will
 * include a check to ensure that the `useContext` hook itself is called within
 * a provider, to prevent the default value from being returned.
 *
 * Default value of the context should be set to null when using this factory
 * function to ensure that the check works.
 */
export function createUseContextHook<T>(
  context: Context<T>,
  contextName: string,
) {
  return function useContextValue() {
    const contextValue = useContext(context);
    if (contextValue === null) {
      throw new Error(`${contextName} must be used within a provider`);
    }
    return contextValue;
  };
}
