import React, {useEffect, useState} from 'react';
import {get, set, subscribe} from "./index";

export const useChromeStorages = (key: string, defaultValue: string | number) => {
    const [value, setValue] = useState(defaultValue);
    const [newValue, setNewValue] = useState('');
    const [error, setError] = useState('');

    useEffect( () => {
        get(key)
            .then(res => {
                // @ts-ignore
                res !== undefined && setValue(res);
                setError('');
            })
            .catch(error => {
                setError(error);
            });
    }, [key, defaultValue])

    useEffect(() => {
        set(key, newValue)
            .then(()=>{
                setValue(newValue);
            }).catch(e => {
                setError(e)
            })
    }, [newValue])

    return [value, setNewValue, error];
}

export const useStorageGet = (key: string) => get(key);

const useStorageSet = (key: string, value: string) => {
    useEffect(() => {
        set(key, value)
    }, [])
}

const useStorageListener = (fn: (data: {}) => void) => {
    subscribe(fn)
}