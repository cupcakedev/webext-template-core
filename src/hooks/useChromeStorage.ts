import { useCallback, useEffect, useState } from 'react';
import { getItem, setItem } from '../storage/storage';

/**
 * Basic hook for storage
 * @param {string} key
 * @param {*} initialValue
 * @param {'local'|'sync'} storageArea
 * @returns {[*, function(*= any): void, boolean, string]}
 */

const useChromeStorage = (
    key: string,
    initialValue?: {},
    storageArea: 'local' | 'sync' = 'local'
) => {
    const [INITIAL_VALUE] = useState(() =>
        typeof initialValue === 'function' ? initialValue() : initialValue
    );
    const [STORAGE_AREA] = useState(storageArea);
    const [state, setState] = useState(INITIAL_VALUE);
    const [isPersistent, setIsPersistent] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getItem(key)
            .then((res: any) => {
                setState(res);
                setIsPersistent(true);
                setError('');
            })
            .catch((error) => {
                setIsPersistent(false);
                setError(error);
            });
    }, [key, INITIAL_VALUE]);

    const updateValue = useCallback(
        (newValue) => {
            const toStore =
                typeof newValue === 'function' ? newValue(state) : newValue;
            setState(toStore);
            setItem(key, toStore).then((result) => {
                if (result) {
                    setIsPersistent(true);
                    setError('');
                } else {
                    setIsPersistent(false);
                    setError(error);
                }
            });
        },
        [key, state, error]
    );

    useEffect(() => {
        const onChange = (changes: any, areaName: string) => {
            if (areaName === STORAGE_AREA && key in changes) {
                setState(changes[key].newValue);
                setIsPersistent(true);
                setError('');
            }
        };
        chrome.storage.onChanged.addListener(onChange);
        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, [key, STORAGE_AREA]);

    return [state, updateValue, isPersistent, error];
};

export default useChromeStorage;
