import { useCallback, useEffect, useState } from 'react';
import { SyncStorageKeys } from 'src/storage/config';
import storage, {
    Storage,
    StorageKey,
    StorageUpdate,
    SyncStorage,
} from '../storage/storage';

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
            const value =
                typeof newValue === 'function' ? newValue(state) : newValue;
            setState(value);
            storage.any.set(key, value).then((result) => {
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
        const onChange = (
            changes: Partial<StorageUpdate>,
            areaName: string
        ) => {
            if (areaName === STORAGE_AREA && key in changes) {
                const val = changes[key]?.newValue;
                setState(
                    (defaultValue ? val || defaultValue : val) as WithDefault<
                        typeof val
                    >
                );
                setError('');
            }
        };
        chrome.storage.onChanged.addListener(onChange);
        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, [key, STORAGE_AREA, defaultValue]);

    return [state, updateValue, error] as const;
}

export default useChromeStorage;
