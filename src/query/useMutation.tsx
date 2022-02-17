import React, {useEffect, useState} from "react";

export const useMutation = (queryFN: any, options: any) => {
    //const [_key, page, status ] = _keys
    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSuccess , setIsSuccess ] = useState(false)
    // const queryClient = useQueryClient()

    const mutate = async () => {
        try {
            const response = await queryFN()
            setIsSuccess(true)
            setData(response)
            setIsLoading(false)
            options.onSuccess()
        }  catch (e: any) {
            setError(e)
            setIsLoading(false)
            options.onError(e)
        }
    }

    return {isLoading, error, data, isSuccess, mutate}
}