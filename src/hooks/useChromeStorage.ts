import { useCallback, useEffect, useState } from 'react';
import storage, { EmptyStorageValue, Storage } from '../storage/storage';

type UseChromeStorage = <Key extends keyof Storage, E = EmptyStorageValue>(
    key: Key,
    options: {
        storageArea?: 'local' | 'sync';
        initialValue?: Storage<E>[Key] | (() => Storage<E>[Key]);
        emptyValue?: E;
    }
) => [
    typeof options.initialValue extends undefined
        ? Storage<E>[Key] | undefined
        : Storage<E>[Key],
    (arg0: Storage<E>[Key]) => void,
    boolean,
    string
];

const useChromeStorage: UseChromeStorage = (
    key,
    { storageArea = 'local', initialValue, emptyValue }
) => {
    const [INITIAL_VALUE] = useState(() =>
        typeof initialValue === 'function'
            ? initialValue()
            : initialValue ?? emptyValue
    );
    const [STORAGE_AREA] = useState(storageArea);
    const [state, setState] = useState(INITIAL_VALUE);
    const [isPersistent, setIsPersistent] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        storage
            .getItem(key)
            .then((res) => {
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
            storage.setItem(key, toStore).then((result) => {
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
