import React from 'react'

import {QueryClient} from "./QueryClient";

declare global {
    interface Window {
        ReactQueryClientContext?: React.Context<QueryClient | undefined>
    }
}

const defaultContext = React.createContext<QueryClient | undefined>(undefined)
const QueryClientSharingContext = React.createContext<boolean>(false)

function getQueryClientContext(contextSharing: boolean) {
    if (contextSharing && typeof window !== 'undefined') {
        if (!window.ReactQueryClientContext) {
            window.ReactQueryClientContext = defaultContext
        }

        return window.ReactQueryClientContext
    }

    return defaultContext
}

export const useQueryClient = () => {
    const queryClient = React.useContext(
        getQueryClientContext(React.useContext(QueryClientSharingContext))
    )

    if (!queryClient) {
        throw new Error('No QueryClient set, use QueryClientProvider to set one')
    }

    return queryClient
}

export interface QueryClientProviderProps {
    client: QueryClient
    contextSharing?: boolean
}

export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
                                                                            client,
                                                                            contextSharing = false,
                                                                            children,
                                                                        }) => {
    // React.useEffect(() => {
    //     client.mount()
    //     return () => {
    //         client.unmount()
    //     }
    // }, [client])

    const Context = getQueryClientContext(contextSharing)

    return (
        <QueryClientSharingContext.Provider value={contextSharing}>
            <Context.Provider value={client}>{children}</Context.Provider>
        </QueryClientSharingContext.Provider>
    )
}