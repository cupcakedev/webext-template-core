import { useCallback, useEffect, useState } from 'react';
import storage, {
    StorageData,
    StorageKey,
    syncStorageKeys,
} from '../storage/storage';

type StorageDispatch<T> = (data: T | ((prevState: T) => T)) => void;
type StorageTuple<T> = [T, StorageDispatch<T>, boolean, string];

export type StorageHookReturn<
    Key extends StorageKey,
    Data extends StorageData<Key>
> = Data extends undefined
    ? StorageTuple<StorageData<Key>>
    : StorageTuple<NonNullable<StorageData<Key>>>;

function useChromeStorage<
    Key extends StorageKey,
    Data extends StorageData<Key>
>(key: Key, defaultValue?: Data | (() => Data)) {
    const [DEFAULT_VALUE] = useState(() =>
        typeof defaultValue === 'function' ? defaultValue() : defaultValue
    );
    const [STORAGE_AREA] = useState<'sync' | 'local'>(() =>
        Object.keys(syncStorageKeys).includes(key) ? 'sync' : 'local'
    );
    const [state, setState] = useState(DEFAULT_VALUE);
    const [isPersistent, setIsPersistent] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        storage
            .get(key as any)
            .then((res) => {
                setState(res || DEFAULT_VALUE);
                setIsPersistent(true);
                setError('');
            })
            .catch((error) => {
                setIsPersistent(false);
                setError(error);
            });
    }, [key, DEFAULT_VALUE]);

    const updateValue = useCallback(
        (newValue) => {
            const toStore =
                typeof newValue === 'function' ? newValue(state) : newValue;
            setState(toStore);
            storage.set(key as any, toStore).then((result) => {
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

    return [state, updateValue, isPersistent, error] as StorageHookReturn<
        Key,
        Data
    >;
}

export default useChromeStorage;
