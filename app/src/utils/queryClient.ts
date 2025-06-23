import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set these options to ensure that once data is loaded and cached it will
      // never be refetched again automatically.
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,

      // Dont retry on failure, this assumes that things wont be automatically
      // fixed after just waiting a few seconds
      retry: false,
    },
  },
});
