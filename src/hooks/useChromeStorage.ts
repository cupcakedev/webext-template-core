import { useCallback, useEffect, useState } from 'react';
import { syncStorageKeys } from 'src/storage/config';
import storage, { Storage, StorageKey } from '../storage/storage';

function useChromeStorage<
    Key extends StorageKey,
    Default extends NonNullable<Storage[Key]> | undefined
>(key: Key, defaultValue?: Default) {
    type WithDefault<T> = Default extends undefined ? T : NonNullable<T>;

    const [STORAGE_AREA] = useState<'sync' | 'local'>(() =>
        Object.keys(syncStorageKeys).includes(key) ? 'sync' : 'local'
    );
    const [state, setState] = useState(
        defaultValue as WithDefault<Storage[Key]>
    );
    const [isPersistent, setIsPersistent] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        storage.any
            .get(key)
            .then((res) => {
                setState(
                    (defaultValue ? res || defaultValue : res) as WithDefault<
                        typeof res
                    >
                );
                setIsPersistent(true);
                setError('');
            })
            .catch((error) => {
                setIsPersistent(false);
                setError(error);
            });
    }, [key, defaultValue]);

    const updateValue: typeof setState = useCallback(
        (newValue) => {
            const toStore =
                typeof newValue === 'function' ? newValue(state) : newValue;
            setState(toStore);
            storage.any.set(key, toStore).then((result) => {
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

    return [state, updateValue, isPersistent, error] as const;
}

export default useChromeStorage;
