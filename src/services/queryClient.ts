import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Disable retries by default
      retryDelay: 1000, // 1 second delay if retry is enabled
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
    },
    mutations: {
      retry: 0, // Disable retries for mutations
    },
  },
});

// Global error handler
queryClient.getQueryCache().subscribe((event) => {
  const error = event.query.state.error as any;
  if (error?.status === 401) {
    localStorage.clear();
    window.location.href = "/sign-in";
  }
});

// Global mutation error handler
queryClient.getMutationCache().subscribe((event) => {
  if (event.mutation) {
    const error = event.mutation.state.error as any;
    if (error?.status === 401) {
      localStorage.clear();
      window.location.href = "/sign-in";
    }
  }
});
