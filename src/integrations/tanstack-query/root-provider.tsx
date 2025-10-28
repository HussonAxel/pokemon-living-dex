import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createAsyncStoragePersister,
} from '@tanstack/query-async-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 1 heure
        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
        retry: 1,
      },
    },
  })

  const localStoragePersister = createAsyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  })

  return {
    queryClient,
    localStoragePersister,
  }
}

export function Provider({
  children,
  queryClient,
  localStoragePersister,
}: {
  children: React.ReactNode
  queryClient: QueryClient
  localStoragePersister?: any
}) {
  if (!localStoragePersister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
