import {PersistedClient, Persistor} from 'react-query/persistQueryClient-experimental'
import {getItem, removeItem, setItem} from "./storage";

interface CreateChromeStoragePersistorOptions {
    /** The key to use when storing the cache */
    key: string
    /** To avoid spamming,
     * pass a time in ms to throttle saving the cache to disk */
    throttleTime?: number
    /**
     * How to serialize the data to storage.
     * @default `JSON.stringify`
     */
    serialize?: (client: PersistedClient) => string
    /**
     * How to deserialize the data from storage.
     * @default `JSON.parse`
     */
    deserialize?: (cachedString: string) => PersistedClient
}

export function noop(): undefined {
    return undefined
}

export function createChromeStoragePersistor({
                                                 key = `REACT_QUERY_CHROME_STORAGE_LOCAL`,
                                                 throttleTime = 1000,
                                                 serialize = JSON.stringify,
                                                 deserialize = JSON.parse,
                                             }: CreateChromeStoragePersistorOptions): Persistor {
    //try to save data to storage
    function trySave(persistedClient: PersistedClient) {
        try {
            setItem(key, serialize(persistedClient))
        } catch {
            return false
        }
        return true
    }

    return {
        persistClient: throttle(persistedClient => {
            if (trySave(persistedClient) !== true) {
                const mutations = [...persistedClient.clientState.mutations]
                const queries = [...persistedClient.clientState.queries]
                const client: PersistedClient = {
                    ...persistedClient,
                    clientState: {mutations, queries},
                }

                // sort queries by dataUpdatedAt (oldest first)
                const sortedQueries = [...queries].sort(
                    (a, b) => a.state.dataUpdatedAt - b.state.dataUpdatedAt
                )
                // clean old queries and try to save
                while (sortedQueries.length > 0) {
                    const oldestData = sortedQueries.shift()
                    client.clientState.queries = queries.filter(q => q !== oldestData)
                    if (trySave(client)) {
                        return // save success
                    }
                }

                // clean mutations and try to save
                while (mutations.shift()) {
                    if (trySave(client)) {
                        return // save success
                    }
                }
            }
        }, throttleTime),
        restoreClient: async () => {
            const cacheString = await getItem(key)

            if (!cacheString) {
                return
            }

            return deserialize(cacheString) as PersistedClient
        },
        removeClient: () => {
            removeItem(key)
        },
    }

    return {
        persistClient: noop,
        restoreClient: noop,
        removeClient: noop,
    }
}

function throttle<TArgs extends any[]>(
    func: (...args: TArgs) => any,
    wait = 100
) {
    let timer: number | null = null
    let params: TArgs
    return function (...args: TArgs) {
        params = args
        if (timer === null) {
            // @ts-ignore
            timer = setTimeout(() => {
                func(...params)
                timer = null
            }, wait)
        }
    }
}
