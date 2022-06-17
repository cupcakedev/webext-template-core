import { useCallback, useEffect, useState } from 'react';
import { SyncStorageKeys } from 'src/storage/config';
import storage, { Storage, StorageKey, SyncStorage } from '../storage/storage';

function useChromeStorage<
    Key extends StorageKey,
    Default extends NonNullable<Storage[Key]> | undefined
>(key: Key, defaultValue?: Default) {
    type WithDefault<T> = Default extends undefined ? T : NonNullable<T>;

    const [STORAGE_AREA] = useState<'sync' | 'local'>(() =>
        SyncStorageKeys[key as keyof SyncStorage] ? 'sync' : 'local'
    );
    const [state, setState] = useState(
        defaultValue as WithDefault<Storage[Key]>
    );
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
                setError('');
            })
            .catch((error) => {
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
                    setError('');
                } else {
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
                setError('');
            }
        };
        chrome.storage.onChanged.addListener(onChange);
        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, [key, STORAGE_AREA]);

    return [state, updateValue, error] as const;
}

export default useChromeStorage;
