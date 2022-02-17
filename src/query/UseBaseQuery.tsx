import {useQueryClient} from "./Provider";
import React, {useEffect, useState} from "react";

export function useQuery (_keys: any, queryFN: any, options: any) {

    const queryClient = useQueryClient()

    const [_key, page, status ] = _keys
    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    console.log("useQuery запустился")
    console.log(_key)

    const load = async () => {
        try {
            const response = await queryFN(_keys)
            console.log("Кэш обновлен")
            console.log(response)
            await queryClient.set(_key, response)
            console.log(_keys)
            setData(response)
            setIsLoading(false)
        }  catch (e: any) {
            setError(e)
            setIsLoading(false)
        }
    }

    queryClient.refresh = {...queryClient.refresh, [_key]: load}

    // const defaultedOptions = queryClient.defaultQueryObserverOptions(options)
    //
    // // Make sure results are optimistically set in fetching state before subscribing or updating options
    // defaultedOptions.optimisticResults = true

    // // Include callbacks in batch renders
    // if (defaultedOptions.onError) {
    //     defaultedOptions.onError = notifyManager.batchCalls(
    //         defaultedOptions.onError
    //     )
    // }
    //
    // if (defaultedOptions.onSuccess) {
    //     defaultedOptions.onSuccess = notifyManager.batchCalls(
    //         defaultedOptions.onSuccess
    //     )
    // }
    //
    // if (defaultedOptions.onSettled) {
    //     defaultedOptions.onSettled = notifyManager.batchCalls(
    //         defaultedOptions.onSettled
    //     )
    // }
    //
    // if (defaultedOptions.suspense) {
    //     // Always set stale time when using suspense to prevent
    //     // fetching again when directly mounting after suspending
    //     if (typeof defaultedOptions.staleTime !== 'number') {
    //         defaultedOptions.staleTime = 1000
    //     }
    //
    //     // Set cache time to 1 if the option has been set to 0
    //     // when using suspense to prevent infinite loop of fetches
    //     if (defaultedOptions.cacheTime === 0) {
    //         defaultedOptions.cacheTime = 1
    //     }
    // }
    //
    // if (defaultedOptions.suspense || defaultedOptions.useErrorBoundary) {
    //     // Prevent retrying failed query if the error boundary has not been reset yet
    //     if (!errorResetBoundary.isReset()) {
    //         defaultedOptions.retryOnMount = false
    //     }
    // }

    // const [observer] = React.useState(
    //     () =>
    //         new Observer<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
    //             queryClient,
    //             defaultedOptions
    //         )
    // )

    useEffect(() => {
        const onChange = (changes: any) => {
            if (_key in changes) {
                //setData(changes[_key].newValue);
            }
        };

        return queryClient.addListener(_key, onChange)
    }, [_key]);



    React.useEffect( () => {
        console.log("Проверяем кэш")
        queryClient.get(_key).then(async cachedData => {
            if(cachedData) {
                console.log("Кэш заполнен")
                console.log(_keys)

                setData(cachedData)
                setIsLoading(false)
            } else {
                console.log("Кэш пуст")
                await load()
            }
        })
    }, [])

    return [data, isLoading, error]
}