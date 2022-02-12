import {ICommand} from "../interfaces";
import React, {useEffect, useState} from 'react';

export const execute = ({method, params}:ICommand) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "command",
            method,
            params: JSON.stringify(params)
        }, (response) => resolve(response));
    })
}

export const useApi = ({method, params, response}:ICommand) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState();

    useEffect(() => {
        execute({method, params, response})
            .then((data) => {
                setIsLoading(false)
                setError('')
                response && response(data)
            })
            .catch(e => {
                setIsLoading(false)
                setError(e)
            })
    })

    return {data, error, isLoading}
}